/**
 * PREVIEW-ONLY. Renders the existing Amino Based email templates to static HTML so their
 * current design can be inspected in a browser.
 *
 * This script does not modify any application file, does not touch the database, does not
 * read .env/.env.local, and does not send mail. It imports the real template generators and
 * the real shared layout, so what you see is exactly what the application produces today.
 *
 * Every value below is fictional.
 *
 *   node email-previews/generate.mjs      (run via: npx tsx email-previews/generate.mjs)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, "out");

// ---------------------------------------------------------------------------------------------
// Environment. Set BEFORE importing any template module, because lib/siteUrl.ts and
// lib/email/layout.ts read these at module-evaluation time.
//
// Nothing here is read from .env or .env.local. These are literals chosen for the preview:
//   - SITE_URL points at the local preview server (serve.mjs) so the real logo, hero images and
//     product images resolve. No production domain is referenced.
//   - PAYLOAD_SECRET is a throwaway string so signOrderAccessToken() can run. The resulting JWT
//     is signed with this fake key and is not a valid application token.
//   - SUPPORT_EMAIL is a fictional address, so the real support inbox never appears in output.
// ---------------------------------------------------------------------------------------------
const PREVIEW_ORIGIN = process.env.PREVIEW_ORIGIN || "http://localhost:4300";

process.env.NEXT_PUBLIC_SITE_URL = PREVIEW_ORIGIN;
process.env.PAYLOAD_SECRET = "preview-only-fake-secret-not-used-by-the-app";
process.env.SUPPORT_EMAIL = "support@example.com";
if (process.env.NODE_ENV === "production") process.env.NODE_ENV = "development";

// Dynamic imports so the assignments above are in place first.
const { generateOrderEmail } = await import("../lib/email/templates/orderInvoice.ts");
const { generateWelcomeEmail } = await import("../lib/email/templates/welcome.ts");
const { generateForgotPasswordEmail } = await import("../lib/email/templates/forgotPassword.ts");
const { generateMilitaryApprovedEmail } = await import("../lib/email/templates/militaryDiscount.ts");
const { generateAdminNewUserEmail } = await import("../lib/email/templates/adminNewUser.ts");

// ---------------------------------------------------------------------------------------------
// Fictional sample data. No real customer, order, address, phone number or payment detail.
// ---------------------------------------------------------------------------------------------
const sampleOrder = {
  id: 10427,
  orderNumber: "AB-10427",
  createdAt: "2026-03-14T10:24:00.000Z",
  paymentMethod: "zelle",      // manual method -> exercises the pending-payment instructions
  paymentStatus: "unpaid",
  items: [
    {
      productSnapshot: { name: "BPC-157", imageUrl: "/product-images/BPC-157-10mg.webp" },
      variantTitle: "10mg",
      price: 54.0,
      quantity: 2,
    },
    {
      productSnapshot: { name: "Epitalon", imageUrl: "/product-images/EPITALON-10MG.webp" },
      variantTitle: "10mg",
      price: 48.0,
      quantity: 1,
    },
    {
      // Deliberately no productSnapshot.imageUrl -> exercises the grey placeholder branch.
      product: { name: "DSIP" },
      variantTitle: "DEFAULT",
      price: 39.0,
      quantity: 1,
    },
  ],
  subtotal: 195.0,
  discountTotal: 19.5,
  couponCode: "PREVIEW10",
  shippingTotal: 0,
  shippingMethod: "Standard",
  feeTotal: 4.5,
  total: 180.0,
  customerFirstName: "Jordan",
  customerLastName: "Reyes",
  customerPhone: "+1 555 0100",
  shippingAddress: {
    line1: "114 Example Research Park",
    line2: "Suite 7",
    city: "Springfield",
    state: "IL",
    postalCode: "62704",
    country: "United States",
  },
  billingAddress: null, // falls back to the shipping address, as the template intends
};

const PREVIEWS = [
  {
    slug: "order-confirmation",
    label: "Order Confirmation",
    note: "Manual payment (Zelle), awaiting payment. Exercises the pending-payment instruction card.",
    render: () => generateOrderEmail(sampleOrder, { kind: "confirmation" }, "jordan.reyes@example.com"),
  },
  {
    slug: "welcome",
    label: "Welcome",
    note: "New customer account. Includes the hero image and both button variants.",
    render: () => generateWelcomeEmail("Jordan"),
  },
  {
    slug: "forgot-password",
    label: "Forgot Password",
    note: "Reset link. The token below is the literal placeholder string, not a real token.",
    render: () => generateForgotPasswordEmail("preview-token-0000-not-a-real-token"),
  },
  {
    slug: "military-approved",
    label: "Military Verification Approved",
    note: "Includes the hero image and the dashed code box.",
    render: () => generateMilitaryApprovedEmail("PREVIEW-MIL-30"),
  },
  {
    slug: "admin-new-user",
    label: "Admin — New User Notification",
    note: "Admin-facing detail-rows layout.",
    render: () =>
      generateAdminNewUserEmail({
        firstName: "Jordan",
        lastName: "Reyes",
        email: "jordan.reyes@example.com",
        authProvider: "credentials",
      }),
  },
];

// ---------------------------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------------------------
fs.mkdirSync(OUT, { recursive: true });

const results = [];
for (const p of PREVIEWS) {
  try {
    const { subject, html } = p.render();
    fs.writeFileSync(path.join(OUT, `${p.slug}.html`), html, "utf8");
    results.push({ ...p, subject, bytes: Buffer.byteLength(html, "utf8"), ok: true });
    console.log(`OK    ${p.slug.padEnd(22)} ${(Buffer.byteLength(html, "utf8") / 1024).toFixed(1)}KB  "${subject}"`);
  } catch (err) {
    results.push({ ...p, ok: false, error: err instanceof Error ? err.message : String(err) });
    console.error(`FAIL  ${p.slug}: ${err instanceof Error ? err.message : err}`);
  }
}

// ---------------------------------------------------------------------------------------------
// Index page: side-by-side 600px desktop / 375px mobile iframes.
// ---------------------------------------------------------------------------------------------
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const tabs = results
  .map(
    (r, i) =>
      `<button class="tab${i === 0 ? " active" : ""}" data-slug="${esc(r.slug)}" data-subject="${esc(r.subject || "—")}" data-note="${esc(r.note)}"${r.ok ? "" : " disabled"}>${esc(r.label)}${r.ok ? "" : " (failed)"}</button>`
  )
  .join("\n      ");

const first = results.find((r) => r.ok);

const indexHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Amino Based — Email Previews (read-only)</title>
<style>
  :root { --bd:#d8d4cc; --mut:#6a6a6a; }
  * { box-sizing: border-box; }
  body { margin:0; font:14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
         background:#eceae5; color:#1a1a1a; }
  header { background:#fff; border-bottom:1px solid var(--bd); padding:16px 24px; position:sticky; top:0; z-index:5; }
  h1 { margin:0 0 4px; font-size:16px; font-weight:700; letter-spacing:-0.2px; }
  .sub { color:var(--mut); font-size:12px; }
  .banner { margin-top:10px; background:#fff8e6; border:1px solid #f0dca8; color:#6b5313;
            padding:8px 12px; border-radius:6px; font-size:12px; }
  .tabs { display:flex; flex-wrap:wrap; gap:8px; padding:14px 24px; background:#fff; border-bottom:1px solid var(--bd); }
  .tab { font:inherit; font-size:13px; padding:8px 14px; border:1px solid var(--bd); background:#fff;
         border-radius:999px; cursor:pointer; color:#333; }
  .tab:hover:not(:disabled) { border-color:#9a9a9a; }
  .tab.active { background:#1a1a1a; border-color:#1a1a1a; color:#fff; }
  .tab:disabled { opacity:.4; cursor:not-allowed; }
  .meta { padding:14px 24px 0; }
  .meta .subject { font-weight:600; font-size:14px; }
  .meta .note { color:var(--mut); font-size:12px; margin-top:2px; }
  .stage { display:flex; gap:24px; padding:16px 24px 48px; align-items:flex-start; flex-wrap:wrap; }
  .pane { background:#fff; border:1px solid var(--bd); border-radius:10px; overflow:hidden;
          box-shadow:0 1px 3px rgba(0,0,0,.06); }
  .pane h2 { margin:0; font-size:11px; text-transform:uppercase; letter-spacing:.08em; color:var(--mut);
             padding:10px 12px; border-bottom:1px solid var(--bd); background:#faf9f7; font-weight:700; }
  .pane iframe { display:block; border:0; width:100%; height:78vh; background:#fff; }
  .desktop { flex:1 1 640px; min-width:360px; max-width:660px; }
  .mobile  { flex:0 0 393px; }
  .mobile iframe { width:375px; }
  code { background:#f3f1ed; padding:1px 5px; border-radius:4px; font-size:12px; }
</style>
</head>
<body>
  <header>
    <h1>Amino Based — Existing Email Previews</h1>
    <div class="sub">Rendered from the live template generators and shared <code>emailLayout</code>. Read-only: no source file was changed.</div>
    <div class="banner">
      All data is fictional. Assets load from <code>${esc(PREVIEW_ORIGIN)}</code> (the local preview server).
      No production URL, real customer data, or valid token appears in these files.
    </div>
  </header>

  <nav class="tabs">
      ${tabs}
  </nav>

  <div class="meta">
    <div class="subject" id="subject"></div>
    <div class="note" id="note"></div>
  </div>

  <div class="stage">
    <div class="pane desktop">
      <h2>Desktop — 600px email width</h2>
      <iframe id="fd" title="Desktop preview"></iframe>
    </div>
    <div class="pane mobile">
      <h2>Mobile — 375px viewport</h2>
      <iframe id="fm" title="Mobile preview"></iframe>
    </div>
  </div>

<script>
  var tabs = document.querySelectorAll('.tab');
  function show(btn) {
    tabs.forEach(function (t) { t.classList.toggle('active', t === btn); });
    var src = './out/' + btn.dataset.slug + '.html';
    document.getElementById('fd').src = src;
    document.getElementById('fm').src = src;
    document.getElementById('subject').textContent = 'Subject: ' + btn.dataset.subject;
    document.getElementById('note').textContent = btn.dataset.note;
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { show(t); }); });
  var firstEnabled = document.querySelector('.tab:not(:disabled)');
  if (firstEnabled) show(firstEnabled);
</script>
</body>
</html>`;

fs.writeFileSync(path.join(HERE, "index.html"), indexHtml, "utf8");

const okCount = results.filter((r) => r.ok).length;
console.log(`\n${okCount}/${results.length} templates rendered -> ${path.join(HERE, "index.html")}`);
if (!first) process.exit(1);
