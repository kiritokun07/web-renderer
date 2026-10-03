// Test the actual ZIP in an isolated browser profile, never the user's daily profile.
import { chromium, expect } from "@playwright/test";
import { readFile, writeFile, mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { unzipSync } from "fflate";

const root = fileURLToPath(new URL("../", import.meta.url));
const { version } = JSON.parse(await readFile(path.join(root, "manifest.json"), "utf8"));
const archive = await readFile(path.join(root, `dist/web-renderer-edge-${version}.zip`));
const files = unzipSync(archive);
const manifest = JSON.parse(new TextDecoder().decode(files["manifest.json"]));
expect(manifest.manifest_version).toBe(3);
expect(manifest.version).toBe(version);
expect(manifest.permissions || []).toEqual([]);
expect(manifest.host_permissions || []).toEqual([]);
const directory = await mkdtemp(path.join(tmpdir(), "web-renderer-release-"));
const channel = process.env.EDGE_TEST_CHANNEL || "msedge";
const screenshots = process.argv.includes("--screenshots");
const report = { version, channel, sha256: createHash("sha256").update(archive).digest("hex"), checkedAt: new Date().toISOString(), locales: [] };
try {
  for (const [name, contents] of Object.entries(files)) {
    if (name.startsWith("/") || name.includes("..") || name.includes("\\") || /(^|\/)(node_modules|tests|scripts|\.git|store)(\/|$)/.test(name)) throw new Error(`Unexpected archive entry: ${name}`);
    const destination = path.join(directory, name);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, contents);
  }
  for (const language of ["zh", "en"]) {
    const context = await chromium.launchPersistentContext("", {
      channel, headless: true, locale: language === "zh" ? "zh-CN" : "en-US",
      viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1,
      args: [`--disable-extensions-except=${directory}`, `--load-extension=${directory}`],
    });
    try {
      const worker = context.serviceWorkers()[0] || await context.waitForEvent("serviceworker", { timeout: 20000 });
      expect(await worker.evaluate(() => chrome.action.onClicked.hasListeners())).toBe(true);
      const page = await context.newPage();
      const runtimeErrors = [];
      page.on("pageerror", error => runtimeErrors.push(error.message));
      const screenshotDirectory = path.join(root, "store/assets", language);
      if (screenshots) await mkdir(screenshotDirectory, { recursive: true });
      const capture = async name => { if (screenshots) await page.screenshot({ path: path.join(screenshotDirectory, `${name}.png`) }); };
      const ready = language === "zh" ? "预览已更新" : "Preview updated";
      const rendered = page.frameLocator("#preview").frameLocator("iframe");
      const demo = page.frameLocator("#template-preview-frame").frameLocator("iframe");
      const edit = async (tab, value) => {
        await page.locator(`[data-tab="${tab}"]`).click();
        await page.locator("#code-editor .cm-content").fill(value);
      };
      const run = async () => {
        await page.locator("#run").click();
        await expect(page.locator("#preview-status")).toHaveText(ready);
      };
      await page.goto(new URL("index.html", worker.url()).href);
      await expect(page.locator("#preview-status")).toHaveText(ready);
      await expect(rendered.locator("#grow")).toBeVisible();
      expect(await page.locator(".brand-mark").evaluate(image => image.complete && image.naturalWidth === 48)).toBe(true);
      await capture("01-workspace");
      await page.screenshot(); // Wait for nested frame hit-testing before first click.
      await rendered.locator("#grow").click();
      await expect(rendered.locator("#message")).toContainText("1");
      await page.locator("#preview-fullscreen").click();
      await expect.poll(() => page.evaluate(() => document.fullscreenElement?.className)).toBe("preview-panel");
      await page.locator("#preview-fullscreen").click();
      await expect.poll(() => page.evaluate(() => document.fullscreenElement)).toBe(null);
      await page.screenshot(); // Native fullscreen changes also need a compositor frame.
      await page.locator("#open-templates").click();
      await expect(page.locator("#templates-dialog")).toBeVisible();
      await expect(page.locator("[data-template]").first()).toHaveAttribute("data-template", "blank");
      await expect(page.locator("[data-template-preview]")).toHaveCount(9);
      await capture("02-templates");
      for (const id of ["blank", "resume", "website", "admin", "garden", "profile", "form", "landing", "todo"]) {
        await page.locator(`[data-template-preview="${id}"]`).click();
        const originalLanguage = language === "zh" ? "zh-CN" : "en";
        await expect(demo.locator("html")).toHaveAttribute("lang", originalLanguage);
        await expect(page.locator("#template-preview-status")).toHaveText(ready);
        await page.screenshot();
        await demo.locator("#template-language-toggle").click();
        await expect(demo.locator("html")).toHaveAttribute("lang", language === "zh" ? "en" : "zh-CN");
        await demo.locator("#template-language-toggle").click();
        if (id === "admin") {
          await expect(demo.locator("#username")).toHaveValue("admin");
          await expect(demo.locator("#password")).toHaveValue("admin123");
          await demo.locator("#login-submit").click();
          await expect(demo.locator("#page-overview")).toBeVisible();
          await capture("03-admin-demo");
          await demo.locator('[data-page="users"]').click();
          await expect(demo.locator("#user-list tr")).toHaveCount(4);
        }
        await page.locator("#close-template-preview").click();
      }
      await page.locator("#close-templates").click();
      await page.locator("#auto-run").uncheck();
      await edit("js", 'console.log({preview:"ready"});');
      await page.locator("#editor-format").click();
      await expect(page.locator("#code-editor .cm-content")).toContainText('preview: "ready"');
      await run();
      await page.locator("#console-toggle").click();
      await expect(page.locator("#console-output")).toContainText("preview: ready");
      await page.locator("#theme-toggle").click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await capture("04-dark-console");
      await page.reload();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await page.locator('[data-tab="js"]').click();
      await expect(page.locator("#code-editor .cm-content")).toContainText('preview: "ready"');
      // Verify sandbox isolation and remote script restrictions using local intercepted responses.
      let remoteScriptRequests = 0;
      await context.route("https://web-renderer.invalid/remote.js", route => {
        remoteScriptRequests++;
        return route.fulfill({ contentType: "text/javascript", body: "document.body.dataset.remote='ran';" });
      });
      await edit("html", '<p id="result"></p><script src="https://web-renderer.invalid/remote.js"></script>');
      await edit("js", `let isolated = false;
try { top.localStorage.getItem('web-renderer.workspace.v1'); } catch { isolated = true; }
document.querySelector('#result').textContent = String(isolated) + ':' + String(typeof chrome?.runtime);`);
      await run();
      await expect(rendered.locator("#result")).toHaveText("true:undefined");
      expect(remoteScriptRequests).toBe(0);
      await expect(rendered.locator("body")).not.toHaveAttribute("data-remote", "ran");
      expect(runtimeErrors).toEqual([]);
      report.locales.push({ language, status: "passed", templates: 9, sandboxIsolation: true, remoteScriptBlocked: true });
      report.browserVersion = await page.evaluate(() => navigator.userAgent);
      console.log(`${channel} ${language}: ZIP runtime, 9 bilingual templates, demo login, formatting, console, persistence, fullscreen and sandbox checks passed.`);
    } finally { await context.close(); }
  }
  await writeFile(path.join(root, "dist/edge-verification.json"), `${JSON.stringify(report, null, 2)}\n`);
} finally { await rm(directory, { recursive: true, force: true }); }
