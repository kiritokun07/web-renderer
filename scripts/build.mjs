import { build } from "esbuild";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { buildBuiltinCode } from "./format-builtins.mjs";
await buildBuiltinCode();
const result = await build({
  entryPoints: { editor: "editor-source.js" }, outdir: "vendor", bundle: true,
  format: "esm", splitting: true, minify: true, target: ["chrome110"],
  metafile: true, legalComments: "eof", chunkNames: "[name]-[hash]",
});
// 与运行资源一起保留依赖许可证；构建产物一并交付，用户可直接加载扩展。
const packages = new Set(Object.keys(result.metafile.inputs).filter(file => file.startsWith("node_modules/")).map(file => {
  const parts = file.slice(13).split("/");
  return parts[0].startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}));
const licenses = [];
for (const name of [...packages].sort()) {
  for (const filename of ["LICENSE", "LICENSE.md", "LICENSE-MIT"]) {
    try { licenses.push(`${name}\n${await readFile(`node_modules/${name}/${filename}`, "utf8")}`); break; } catch {}
  }
}
await mkdir("vendor", { recursive: true });
await writeFile("vendor/THIRD-PARTY-LICENSES.txt", licenses.join("\n\n---\n\n"));
console.log(`Built ${Object.keys(result.metafile.outputs).length} local assets.`);
