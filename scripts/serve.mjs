// 仅供本机开发：不需要安装依赖，也不是生产服务器。
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8" };
// 显式发布运行文件，避免把测试、备份或隐藏文件暴露给网页。
const files = new Set(["index.html", "styles.css", "theme.css", "app.js", "model.js", "example.js", "i18n.js", "sandbox.html", "sandbox.js", "templates.js", "builtin-code.js", "console-panel.js", "layout.js"]);
for (const name of ["resume", "website", "admin", "i18n"]) files.add(`templates/${name}.js`);
files.add("template-preview.js");
files.add("legacy-template-code.js");
createServer(async (request, response) => {
  try {
    const name = decodeURIComponent(new URL(request.url, "http://localhost").pathname).slice(1) || "index.html";
    const bundledAsset = /^vendor\/[a-zA-Z0-9_-]+\.js$/.test(name);
    if (!["GET", "HEAD"].includes(request.method) || (!files.has(name) && !bundledAsset)) { response.writeHead(404).end("Not found"); return; }
    const body = await readFile(path.join(root, name));
    response.writeHead(200, { "Content-Type": types[path.extname(name)], "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch { response.writeHead(500).end("Unable to load file"); }
}).listen(port, "127.0.0.1", () => console.log(`Web Renderer: http://127.0.0.1:${port}`));
