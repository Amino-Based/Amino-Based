/**
 * PREVIEW-ONLY static file server. Zero dependencies — Node's built-in http/fs only.
 *
 * Serves two roots so the generated emails resolve their real assets:
 *   /                     -> <repo>/public        (logo, hero images, product images)
 *   /email-previews/...   -> <repo>/email-previews (index.html and out/*.html)
 *
 * It serves static files and nothing else: no application code, no Payload, no database,
 * no Resend, no environment file. Read-only on disk.
 *
 *   node email-previews/serve.mjs
 *   -> http://localhost:4300/email-previews/index.html
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const PUBLIC_DIR = path.join(REPO, "public");
const PORT = Number(process.env.PREVIEW_PORT || 4300);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
};

/** Resolve a URL path to a file inside one of the two allowed roots, or null. */
function resolveFile(urlPath) {
  let rel;
  let root;
  if (urlPath === "/email-previews" || urlPath === "/email-previews/") {
    root = HERE;
    rel = "index.html";
  } else if (urlPath.startsWith("/email-previews/")) {
    root = HERE;
    rel = urlPath.slice("/email-previews/".length);
  } else {
    root = PUBLIC_DIR;
    rel = urlPath.replace(/^\/+/, "");
  }

  const full = path.resolve(root, rel);
  // Containment check: never serve outside the chosen root.
  if (full !== root && !full.startsWith(root + path.sep)) return null;
  if (!fs.existsSync(full) || !fs.statSync(full).isFile()) return null;
  return full;
}

const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    res.writeHead(400).end("Bad request");
    return;
  }

  if (urlPath === "/") {
    res.writeHead(302, { Location: "/email-previews/index.html" }).end();
    return;
  }

  const file = resolveFile(urlPath);
  if (!file) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(
      `404 — ${urlPath}\n\nThis preview server only serves static assets.\nStart at http://localhost:${PORT}/email-previews/index.html\n`
    );
    return;
  }

  res.writeHead(200, {
    "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream",
    "Cache-Control": "no-store",
  });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Email previews:  http://localhost:${PORT}/email-previews/index.html`);
  console.log(`Serving assets:  ${PUBLIC_DIR}`);
  console.log(`Press Ctrl+C to stop.`);
});
