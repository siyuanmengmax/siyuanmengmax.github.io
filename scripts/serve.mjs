import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
await fs.access(path.join(root, "index.html")).catch(() => {
  console.error("Run npm run build first.");
  process.exit(1);
});
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".ico": "image/x-icon",
  ".bib": "text/plain; charset=utf-8",
};
const server = http.createServer(async (req, res) => {
  if (!["GET", "HEAD"].includes(req.method)) {
    res.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    res.writeHead(400).end("Bad request");
    return;
  }
  try {
    let file = path.resolve(root, "." + pathname);
    if (file !== root && !file.startsWith(root + path.sep)) {
      res.writeHead(403).end();
      return;
    }
    const stat = await fs.stat(file);
    if (stat.isDirectory()) {
      if (!pathname.endsWith("/")) {
        res.writeHead(302, { Location: encodeURI(pathname + "/") }).end();
        return;
      }
      file = path.join(file, "index.html");
    }
    const bytes = await fs.readFile(file);
    res.writeHead(200, {
      "Content-Type": mime[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(req.method === "HEAD" ? undefined : bytes);
  } catch {
    const notFound = await fs.readFile(path.join(root, "404.html")).catch(() => "Not found");
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(req.method === "HEAD" ? undefined : notFound);
  }
});
const port = Number(process.env.PORT || 4173);
server.on("error", (error) => {
  console.error(
    error.code === "EADDRINUSE"
      ? `Port ${port} is in use. Try PORT=8080 npm run dev.`
      : `Cannot start local preview: ${error.message}`,
  );
  process.exit(1);
});
server.listen(port, "127.0.0.1", () => console.log(`Max Portfolio: http://localhost:${port}/ (Ctrl+C to stop)`));
