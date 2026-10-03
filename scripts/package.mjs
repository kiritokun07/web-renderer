// Explicit runtime allowlist: source repo archives must never be uploaded to the store.
import { readFile, writeFile, mkdir, readdir, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
import { zipSync, unzipSync } from "fflate";

const root = new URL("../", import.meta.url);
const manifest = JSON.parse(await readFile(new URL("manifest.json", root), "utf8"));
const pkg = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
if (manifest.version !== pkg.version) throw new Error("Manifest and package versions must match.");
if (manifest.manifest_version !== 3) throw new Error("The store package must use Manifest V3.");
if (manifest.permissions?.length || manifest.host_permissions?.length) throw new Error("Review store privacy disclosures before adding permissions.");
const files = [
  "manifest.json", "background.js", "index.html", "styles.css", "theme.css",
  "app.js", "model.js", "example.js", "i18n.js", "sandbox.html", "sandbox.js",
  "templates.js", "template-preview.js", "builtin-code.js", "legacy-template-code.js",
  "console-panel.js", "layout.js", "vendor/THIRD-PARTY-LICENSES.txt",
  ...["resume", "website", "admin", "i18n"].map(name => `templates/${name}.js`),
  ...["en", "zh_CN"].map(language => `_locales/${language}/messages.json`),
  ...Object.values(manifest.icons),
  ...(await readdir(new URL("vendor/", root))).filter(name => /^[\w-]+\.js$/.test(name)).map(name => `vendor/${name}`),
].sort();
const contents = {};
for (const file of files) contents[file] = new Uint8Array(await readFile(new URL(file, root)));
for (const [size, file] of Object.entries(manifest.icons)) {
  const png = Buffer.from(contents[file]);
  if (png.toString("hex", 0, 8) !== "89504e470d0a1a0a" || png.readUInt32BE(16) !== Number(size) || png.readUInt32BE(20) !== Number(size)) throw new Error(`Invalid icon: ${file}`);
}
// Fixed timestamps produce byte-identical archives for identical runtime files.
const archive = zipSync(Object.fromEntries(files.map(file => [file, [contents[file], { mtime: new Date(2020, 0, 1) }]])), { level: 9 });
const extracted = unzipSync(archive);
const output = new URL("dist/", root);
const unpacked = new URL("edge-unpacked/", output);
await mkdir(output, { recursive: true });
await rm(unpacked, { recursive: true, force: true });
for (const file of files) {
  const target = new URL(file, unpacked);
  await mkdir(new URL(".", target), { recursive: true });
  await writeFile(target, extracted[file]);
}
const name = `web-renderer-edge-${manifest.version}.zip`;
await writeFile(new URL(name, output), archive);
await writeFile(new URL(`${name}.sha256`, output), `${createHash("sha256").update(archive).digest("hex")}  ${name}\n`);
console.log(`Created dist/${name} (${files.length} files, ${(archive.length / 1024).toFixed(0)} KB).`);
console.log("Load dist/edge-unpacked in Edge to test exactly the files in the ZIP.");
