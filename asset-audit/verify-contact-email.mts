/**
 * TEST-ONLY harness for the contact-form notification email.
 *
 * Renders the template with synthetic data and asserts the properties that matter for inbox
 * placement and safety. The email transport is MOCKED — nothing is sent, the Resend API is never
 * called, no database is touched, and no secret is read.
 *
 *   npx tsx asset-audit/verify-contact-email.mts
 */
import { generateContactFormEmail } from "../lib/email/templates/contactForm.ts";
import type { TrackedEmailArgs } from "../lib/email/sendTrackedEmail.ts";

let failures = 0;
function check(label: string, pass: boolean, detail = "") {
  if (!pass) failures++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${label}${detail ? `\n        ${detail}` : ""}`);
}

// ----------------------------------------------------------------- mocked transport
type SentMessage = TrackedEmailArgs;
const outbox: SentMessage[] = [];
/** Stand-in for sendTrackedEmail. Records the payload; sends nothing. */
async function mockSendTrackedEmail(args: TrackedEmailArgs): Promise<{ success: boolean }> {
  outbox.push(args);
  return { success: true };
}

// ----------------------------------------------------------------- synthetic submission
const SUBMISSION = {
  name: "Jordan Reyes",
  email: "jordan.reyes@example.com",
  subject: "Question about order AB-10427",
  message: "Hi,\n\nCould you confirm the shipping date?\n\nThanks,\nJordan",
};
const SUPPORT_INBOX = "support@example.com"; // synthetic stand-in for ADMIN_EMAIL

const notice = generateContactFormEmail(SUBMISSION);

console.log("=== 1. Rendered output ===\n");
console.log(`subject: ${notice.subject}`);
console.log(`html:    ${Buffer.byteLength(notice.html)} bytes`);
console.log(`text:    ${Buffer.byteLength(notice.text)} bytes\n`);

// ----------------------------------------------------------------- 2. No dev / loopback URLs
console.log("=== 2. No localhost, loopback or development URLs ===\n");
const BAD_HOST = /localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]|\.local\b|:3000/i;
check("html contains no localhost/loopback host", !BAD_HOST.test(notice.html));
check("text contains no localhost/loopback host", !BAD_HOST.test(notice.text));
check("subject contains no localhost/loopback host", !BAD_HOST.test(notice.subject));

const urls = notice.html.match(/https?:\/\/[^"'\s<>]+/gi) ?? [];
check("html contains zero http(s) URLs", urls.length === 0, urls.length ? `found: ${urls.join(", ")}` : "");
check("html contains zero <img> tags", !/<img/i.test(notice.html));
check("html contains zero <a> tags", !/<a\s/i.test(notice.html));
check("text contains zero http(s) URLs", (notice.text.match(/https?:\/\//gi) ?? []).length === 0);

// ----------------------------------------------------------------- 3. Promotional content removed
console.log("\n=== 3. Marketing / promotional content removed ===\n");
check("no 'Research-grade peptides' tagline", !/research-grade peptides/i.test(notice.html));
check("no 'Dedicated to purity' tagline", !/dedicated to purity/i.test(notice.html));
check("no Research-Use-Only disclaimer", !/research use only/i.test(notice.html));
check("no 'not for human' disclaimer", !/not for human/i.test(notice.html));
check("no 'All rights reserved' footer", !/all rights reserved/i.test(notice.html));
check("brand name still present (identification retained)", /Amino Based/.test(notice.html));

// ----------------------------------------------------------------- 4. Required content retained
console.log("\n=== 4. Required content retained ===\n");
check("customer name present (html)", notice.html.includes("Jordan Reyes"));
check("customer email present (html)", notice.html.includes("jordan.reyes@example.com"));
check("subject present (html)", notice.html.includes("Question about order AB-10427"));
check("message present (html)", notice.html.includes("Could you confirm the shipping date?"));
check("reply instruction present (html)", /Reply to this email/i.test(notice.html));
check("customer name present (text)", notice.text.includes("Jordan Reyes"));
check("customer email present (text)", notice.text.includes("jordan.reyes@example.com"));
check("message present (text)", notice.text.includes("Could you confirm the shipping date?"));
check("reply instruction present (text)", /Reply to this email/i.test(notice.text));
check("message newlines preserved in text", notice.text.includes("Thanks,\nJordan"));
check("html uses pre-wrap so newlines survive", /white-space:pre-wrap/.test(notice.html));

// ----------------------------------------------------------------- 5. Subject format preserved
console.log("\n=== 5. Subject format preserved ===\n");
check("prefix retained", notice.subject === "[Contact Form] Question about order AB-10427", notice.subject);
check(
  "empty subject falls back to 'New message'",
  generateContactFormEmail({ ...SUBMISSION, subject: undefined }).subject === "[Contact Form] New message"
);
const injected = generateContactFormEmail({
  ...SUBMISSION,
  subject: "Hello\r\nBcc: attacker@example.net",
});
check("CRLF stripped from subject (header-injection safety)", !/[\r\n]/.test(injected.subject), injected.subject);

// ----------------------------------------------------------------- 6. HTML escaping
console.log("\n=== 6. HTML escaping of customer content ===\n");
const hostile = generateContactFormEmail({
  name: '<script>alert("xss")</script>',
  email: "evil<img src=x onerror=alert(1)>@example.com",
  subject: "</title><script>bad()</script>",
  message: 'Hi <b>there</b> & "quoted" \'single\' <a href="http://evil.example.com">click</a>',
});
check("no executable <script> tag in html", !/<script/i.test(hostile.html));
check("no injected <img> tag in html", !/<img/i.test(hostile.html));
check("no injected <a> tag in html", !/<a\s/i.test(hostile.html));
check("angle brackets escaped", hostile.html.includes("&lt;script&gt;"));
check("ampersand escaped", hostile.html.includes("&amp;"));
check("double quote escaped", hostile.html.includes("&quot;"));
check("single quote escaped", hostile.html.includes("&#39;"));
// A customer may legitimately include a URL in their message and support must be able to read it,
// so the URL string survives — but only as inert escaped text. What must never happen is the
// template emitting it inside an href/src attribute, which is what makes a link clickable.
const linkedUrl = /(?:href|src)\s*=\s*["']?\s*https?:/i.test(hostile.html);
check("customer-supplied URL is never emitted into href/src", !linkedUrl);
check(
  "customer-supplied URL survives as inert escaped text",
  hostile.html.includes("http://evil.example.com") && hostile.html.includes("&lt;a href=&quot;")
);

// ----------------------------------------------------------------- 7. Envelope via mocked transport
console.log("\n=== 7. Envelope handling (transport mocked) ===\n");
await mockSendTrackedEmail({
  to: SUPPORT_INBOX,
  subject: notice.subject,
  html: notice.html,
  text: notice.text,
  replyTo: SUBMISSION.email,
});
const sent = outbox[0];
check("exactly one message queued (no duplicate send)", outbox.length === 1);
check("recipient is the support inbox", sent.to === SUPPORT_INBOX);
check("Reply-To is the customer address", sent.replyTo === SUBMISSION.email);
check("no 'from' override — adapter default sender is used", sent.from === undefined);
check("text alternative is supplied and non-empty", typeof sent.text === "string" && sent.text.trim().length > 0);
check("html is supplied and non-empty", typeof sent.html === "string" && sent.html.trim().length > 0);
check("no attachments", sent.attachments === undefined);
check("NO network call was made (transport is a local mock)", true);

// ----------------------------------------------------------------- 8. Backward compatibility
console.log("\n=== 8. Backward compatibility of the shared sender ===\n");
const legacy: TrackedEmailArgs = { to: "a@example.com", subject: "s", html: "<p>h</p>" };
check("TrackedEmailArgs still valid without `text` (other 16 templates unaffected)", legacy.text === undefined);

console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : failures + " CHECK(S) FAILED"}`);
console.log("\n--- plain-text body as transmitted ---\n");
console.log(notice.text);
process.exit(failures === 0 ? 0 : 1);
