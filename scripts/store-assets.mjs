// Render our vector logo into the PNG sizes accepted by browser manifests and Edge Add-ons.
import { chromium } from "@playwright/test";
import { readFile, mkdir } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const svg = await readFile(new URL("icons/icon.svg", root), "utf8");
await mkdir(new URL("store/assets/", root), { recursive: true });
const browser = await chromium.launch({ channel: "chromium", headless: true });
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  for (const size of [16, 32, 48, 128, 300]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:100%;height:100%}</style>${svg}`);
    await page.screenshot({ path: new URL(size === 300 ? "store/assets/logo-300.png" : `icons/icon-${size}.png`, root).pathname, omitBackground: true });
  }
  for (const language of ["zh", "en"]) {
    await page.setViewportSize({ width: 440, height: 280 });
    const label = language === "zh" ? "你的网页实验室" : "Your web playground";
    const detail = language === "zh" ? "写代码 · 实时预览 · 保存灵感" : "Write. Preview. Make it yours.";
    await page.setContent(`<style>*{box-sizing:border-box}body{margin:0;width:440px;height:280px;padding:32px;background:#f6f7f0;color:#29392d;font-family:system-ui,sans-serif}svg{width:62px;height:62px}header{display:flex;gap:16px;align-items:center}strong{font-size:25px;letter-spacing:-1px}h1{font-size:25px;margin:29px 0 8px;font-weight:600}p{margin:0;color:#647560;font-size:15px}.code{position:absolute;right:28px;bottom:27px;color:#326449;font:22px monospace}</style><header>${svg}<strong>Web Renderer</strong></header><h1>${label}</h1><p>${detail}</p><span class="code">&lt;/&gt;</span>`);
    await page.screenshot({ path: new URL(`store/assets/tile-${language}-440x280.png`, root).pathname });
  }
} finally { await browser.close(); }
console.log("Generated extension icons, store logo and promotional tiles.");
