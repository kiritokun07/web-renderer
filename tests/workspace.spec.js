import { test, expect, chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { example } from "../example.js";
import { builtinCode } from "../builtin-code.js";

const url = "http://127.0.0.1:4173";
const rendered = page => page.frameLocator("#preview").frameLocator("iframe");
// DOM ready can precede Chromium's first hit-test surface for nested sandbox frames.
// A captured frame waits for the compositor before the first pointer interaction.
const previewPainted = page => page.screenshot();
const code = async (page, tab, value) => {
  await page.locator(`[data-tab="${tab}"]`).click();
  await page.locator("#code-editor .cm-content").fill(value);
};
const run = async page => {
  await page.locator("#run").click();
  await expect(page.locator("#preview-status")).toHaveText("预览已更新");
};

test("HTML, CSS and JavaScript render, and sandbox isolates workspace data", async ({ page }) => {
  await page.goto(url);
  await expect(page.locator("#preview-status")).toHaveText("预览已更新");
  await expect(rendered(page).locator("h1")).toHaveText("让想法，慢慢生长。");
  await previewPainted(page);
  await rendered(page).locator("#grow").click();
  await expect(rendered(page).locator("#message")).toContainText("1 个灵感");
  await page.locator("#auto-run").uncheck();
  await code(page, "html", '<!doctype html><html><head><title>Full document</title></head><body><h1 id="result">Before</h1><script>document.body.dataset.inline = "works";</script></body></html>');
  await code(page, "css", "h1 { color: rgb(12, 34, 56); }");
  await code(page, "js", `document.querySelector('#result').textContent = '</script> works';
let blocked = 0;
try { top.document.body.dataset.compromised = 'yes'; } catch { blocked++; }
try { localStorage.setItem('stolen', 'yes'); } catch { blocked++; }
document.body.dataset.blocked = String(blocked);
document.body.dataset.extensionApi = String(typeof chrome?.runtime);
top.postMessage({ channel: 'web-renderer', type: 'error', runId: 1, message: 'forged' }, '*');`);
  await run(page);
  await expect(rendered(page).locator("#result")).toHaveText("</script> works");
  await expect(rendered(page).locator("#result")).toHaveCSS("color", "rgb(12, 34, 56)");
  await expect(rendered(page).locator("body")).toHaveAttribute("data-inline", "works");
  await expect(rendered(page).locator("body")).toHaveAttribute("data-blocked", "2");
  await expect(rendered(page).locator("body")).toHaveAttribute("data-extension-api", "undefined");
  await expect(page.locator("body")).not.toHaveAttribute("data-compromised");
  await expect(page.locator("#runtime-errors")).toBeHidden();
});

test("project edits survive reload, rename, switch and deletion", async ({ page }) => {
  await page.goto(url);
  await page.locator("#new-project").click();
  await page.locator("#project-name").fill("测试项目");
  await page.locator("#confirm-dialog").click();
  await code(page, "html", "<h1>Persisted</h1>");
  await page.reload();
  await expect(page.locator("#project-title")).toHaveText("测试项目");
  await expect(rendered(page).locator("h1")).toHaveText("Persisted");
  await page.locator("#rename-project").click();
  await page.locator("#project-name").fill("已重命名");
  await page.locator("#confirm-dialog").click();
  await page.locator(".project-item").first().click();
  await expect(rendered(page).locator("#grow")).toBeVisible();
  await page.getByRole("button", { name: "已重命名", exact: true }).click();
  await expect(rendered(page).locator("h1")).toHaveText("Persisted");
  page.once("dialog", dialog => dialog.dismiss());
  await page.locator("#delete-project").click();
  await expect(page.locator(".project-item")).toHaveCount(2);
  page.once("dialog", dialog => dialog.accept());
  await page.locator("#delete-project").click();
  await expect(page.locator(".project-item")).toHaveCount(1);
});

test("export and import round-trip creates copies; invalid input is atomic", async ({ page }) => {
  await page.goto(url);
  await code(page, "html", "<h1>备份</h1>");
  const downloadEvent = page.waitForEvent("download");
  await page.locator("#export-projects").click();
  const download = await downloadEvent;
  const exported = JSON.parse(await readFile(await download.path(), "utf8"));
  expect(exported.projects[0].html).toBe("<h1>备份</h1>");
  await page.locator("#import-file").setInputFiles({ name: "backup.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(exported)) });
  await expect(page.locator(".project-item")).toHaveCount(2);
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("web-renderer.workspace.v1")));
  expect(stored.projects[0].id).not.toBe(stored.projects[1].id);
  await expect(rendered(page).locator("h1")).toHaveText("备份");
  const invalid = { ...exported, projects: [...exported.projects, { name: "Broken", html: 42 }] };
  await page.locator("#import-file").setInputFiles({ name: "bad.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(invalid)) });
  await expect(page.locator("#toast")).toContainText("导入失败");
  await expect(page.locator(".project-item")).toHaveCount(2);
  await page.locator("#import-file").setInputFiles({ name: "big.json", mimeType: "application/json", buffer: Buffer.alloc(4 * 1024 * 1024 + 1, " ") });
  await expect(page.locator("#toast")).toContainText("文件过大");
  await page.reload();
  await expect(page.locator(".project-item")).toHaveCount(2);
});

test("manual run, automatic run, runtime errors, language and mobile view", async ({ page }) => {
  await page.goto(url);
  await page.locator("#auto-run").uncheck();
  await code(page, "html", '<h1 id="manual">Manual</h1>');
  await code(page, "js", "throw new Error('Test error');");
  await expect(page.locator("#preview-status")).toHaveText("代码已修改，待运行");
  await page.locator("#code-editor .cm-content").press("ControlOrMeta+Enter");
  await expect(page.locator("#error-message")).toContainText("Test error");
  await code(page, "js", "document.querySelector('h1').textContent = 'Auto';");
  await page.locator("#auto-run").check();
  await expect(rendered(page).locator("h1")).toHaveText("Auto");
  await expect(page.locator("#runtime-errors")).toBeHidden();
  await page.locator('[data-device="mobile"]').click();
  await expect(page.locator("#preview")).toHaveCSS("width", "375px");
  await page.locator("#language").click();
  await expect(page.locator("#new-project")).toHaveText("＋New project");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("corrupt storage stays untouched and is never reported as saved", async ({ page }) => {
  await page.goto(url);
  await page.evaluate(() => localStorage.setItem("web-renderer.workspace.v1", "broken-json"));
  await page.reload();
  await expect(page.locator("#save-status")).toContainText("保存失败");
  await code(page, "html", "<h1>Unsaved recovery</h1>");
  expect(await page.evaluate(() => localStorage.getItem("web-renderer.workspace.v1"))).toBe("broken-json");
  const downloadEvent = page.waitForEvent("download");
  await page.locator("#export-projects").click();
  const download = await downloadEvent;
  expect(JSON.parse(await readFile(await download.path(), "utf8")).projects[0].html).toContain("Unsaved recovery");
});

test("editor keeps independent undo histories, formats and replaces text", async ({ page }) => {
  await page.goto(url);
  await page.locator("#auto-run").uncheck();
  await code(page, "html", "<h1>History</h1>");
  await code(page, "css", "body{color:red}");
  await page.locator("#editor-format").click();
  await expect(page.locator("#code-editor .cm-content")).toContainText("color: red;");
  await page.locator('[data-tab="html"]').click();
  await page.locator("#editor-undo").click();
  await expect(page.locator("#code-editor .cm-content")).toContainText("一点小实验");
  await page.locator("#editor-redo").click();
  await expect(page.locator("#code-editor .cm-content")).toHaveText("<h1>History</h1>");
  await page.locator("#editor-search").click();
  await page.locator('.cm-search input[name="search"]').fill("History");
  await page.locator('.cm-search input[name="replace"]').fill("Replaced");
  await page.locator('.cm-search button[name="replaceAll"]').click();
  await expect(page.locator("#code-editor .cm-content")).toContainText("Replaced");
  await page.locator("#new-project").click();
  await page.locator("#project-name").fill("Second");
  await page.locator("#confirm-dialog").click();
  await code(page, "html", "<h1>Second project</h1>");
  await page.locator(".project-item").first().click();
  await page.locator("#editor-undo").click();
  await expect(page.locator("#code-editor .cm-content")).toContainText("History");
  await expect(page.locator("#code-editor .cm-content span").first()).toBeVisible();
});

test("console handles structured logs, filters, retention and runtime errors safely", async ({ page }) => {
  await page.goto(url);
  await page.locator("#auto-run").uncheck();
  await code(page, "js", `const circular = { answer: 42 }; circular.self = circular;
console.log('hello', circular, undefined, 12n);
console.warn('careful');
console.error('<img src=x onerror="top.compromised=true">');`);
  await run(page);
  await expect(page.locator("#console-panel")).toBeVisible();
  await expect(page.locator("#console-output")).toContainText("[Circular]");
  await expect(page.locator("#console-output")).toContainText("answer: 42");
  await expect(page.locator("#console-output img")).toHaveCount(0);
  await page.locator("#console-level").selectOption("warn");
  await expect(page.locator(".console-entry")).toHaveCount(1);
  await expect(page.locator(".console-entry")).toContainText("careful");
  await page.locator("#console-level").selectOption("all");
  await page.locator("#console-preserve").check();
  await run(page);
  await expect(page.locator("#console-count")).toHaveText("7");
  await page.locator("#console-clear").click();
  await expect(page.locator("#console-count")).toHaveText("0");
  await code(page, "js", "Promise.reject(new Error('Async failure'));");
  await page.locator("#run").click();
  await expect(page.locator("#console-output")).toContainText("Async failure");
  await code(page, "js", "for (let i = 0; i < 500; i++) console.log('row', i);");
  await run(page);
  await expect(page.locator("#console-count")).toHaveText("200");
  await expect(page.locator("#console-output")).toContainText("Console limit reached");
  await code(page, "js", "console.log('before clear'); console.clear(); console.info('after clear');");
  await run(page);
  await expect(page.locator("#console-output")).toHaveText("infoafter clear");
});

test("templates create new projects and search matches names or source", async ({ page }) => {
  await page.goto(url);
  await page.locator("#open-templates").click();
  await expect(page.locator(".template-card")).toHaveCount(9);
  await page.locator('[data-template="todo"]').click();
  await expect(page.locator("#project-title")).toHaveText("待办清单");
  await expect(page.locator(".project-item")).toHaveCount(2);
  await rendered(page).locator("#task").fill("Learning extensions");
  await rendered(page).locator("#add").click();
  await expect(rendered(page).locator("#list")).toContainText("Learning extensions");
  await rendered(page).locator('#list input[type="checkbox"]').check();
  await rendered(page).locator("#list button").click();
  await expect(rendered(page).locator("#list li")).toHaveCount(0);
  await page.locator("#project-search").fill("待办");
  await expect(page.locator(".project-item")).toHaveCount(1);
  await page.locator("#project-search").fill("a little experiment");
  await expect(page.locator(".project-item")).toHaveCount(1);
  await page.locator(".project-item").click();
  await expect(page.locator("#project-title")).toHaveText("第一颗灵感");
  await page.locator("#project-search").fill("no-such-project-123");
  await expect(page.locator("#project-search-empty")).toBeVisible();
  await expect(page.locator("#project-title")).toHaveText("第一颗灵感");
  await page.locator("#project-search").fill("");
  await expect(page.locator(".project-item")).toHaveCount(2);
});

test("preformatted defaults upgrade only untouched built-in project code", async ({ page }) => {
  await page.goto(url);
  await expect(page.locator('.project-header [data-i18n="intro"]')).toHaveCount(0);
  await page.evaluate(source => {
    const state = JSON.parse(localStorage.getItem('web-renderer.workspace.v1'));
    Object.assign(state.projects[0], source);
    state.projects.push({ ...state.projects[0], id: crypto.randomUUID(), name: 'My edits', html: source.html + '\n<!-- keep my spacing -->' });
    localStorage.setItem('web-renderer.workspace.v1', JSON.stringify(state));
  }, example);
  await page.reload();
  const projects = await page.evaluate(() => JSON.parse(localStorage.getItem('web-renderer.workspace.v1')).projects);
  for (const language of ['html', 'css', 'js']) expect(projects[0][language]).toBe(builtinCode.example[language]);
  expect(projects[1].html).toBe(example.html + '\n<!-- keep my spacing -->');
  expect(projects[1].css).toBe(example.css);
  expect(projects[1].js).toBe(example.js);
  await page.locator('#open-templates').click();
  await page.locator('[data-template="form"]').click();
  const code = await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('web-renderer.workspace.v1'));
    return state.projects.find(project => project.id === state.activeId);
  });
  for (const language of ['html', 'css', 'js']) expect(code[language]).toBe(builtinCode.templates.form.zh[language]);
});

test("console height supports dragging, keyboard, reset and persistence", async ({ page }) => {
  await page.goto(url);
  await page.locator('#console-toggle').click();
  const panel = page.locator('#console-panel');
  const resizer = page.locator('#console-resizer');
  const original = await panel.boundingBox();
  const handle = await resizer.boundingBox();
  await page.mouse.move(handle.x + handle.width / 2, handle.y + 5);
  await page.mouse.down();
  await page.mouse.move(handle.x + handle.width / 2, handle.y - 85, {steps: 5});
  await page.mouse.up();
  expect((await panel.boundingBox()).height).toBeGreaterThan(original.height + 60);
  const resized = Math.round((await panel.boundingBox()).height);
  await page.locator('#console-close').click();
  await page.locator('#console-toggle').click();
  await expect(panel).toHaveCSS('height', `${resized}px`);
  await page.reload();
  await page.locator('#console-toggle').click();
  await expect(panel).toHaveCSS('height', `${resized}px`);
  await resizer.focus();
  await page.keyboard.press('ArrowDown');
  await expect(panel).toHaveCSS('height', `${resized - 20}px`);
  await resizer.dblclick();
  await expect(panel).toHaveCSS('height', '190px');
  await page.locator('#preview-fullscreen').click();
  await expect.poll(() => page.evaluate(() => document.fullscreenElement?.className)).toBe('preview-panel');
  await resizer.focus();
  await page.keyboard.press('End');
  expect((await page.locator('#preview-stage').boundingBox()).height).toBeGreaterThanOrEqual(79);
  await page.locator('#preview-fullscreen').click();
  await page.setViewportSize({width: 570, height: 581});
  await expect(resizer).toBeVisible();
  expect((await page.locator('#preview-stage').boundingBox()).height).toBeGreaterThanOrEqual(79);
});

test("themes, split layout and custom viewport persist without resetting preview", async ({ page }) => {
  await page.goto(url);
  await expect(page.locator("#preview-status")).toHaveText("预览已更新");
  await previewPainted(page);
  await rendered(page).locator("#grow").click();
  await expect(rendered(page).locator("#message")).toContainText("1 个灵感");
  await page.locator("#theme-toggle").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator(".cm-editor")).toHaveCSS("background-color", "rgb(40, 44, 52)");
  await expect(rendered(page).locator("#message")).toContainText("1 个灵感");
  await page.locator("#panel-splitter").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#panel-splitter")).toHaveAttribute("aria-valuenow", "53");
  await page.locator("#layout-mode").selectOption("stacked");
  await expect(page.locator("#panel-splitter")).toHaveAttribute("aria-orientation", "horizontal");
  await page.locator('[data-device="custom"]').click();
  await page.locator("#viewport-width").fill("640");
  await page.locator("#viewport-width").press("Tab");
  await page.locator("#viewport-height").fill("480");
  await page.locator("#viewport-height").press("Tab");
  await expect(page.locator("#preview")).toHaveCSS("width", "640px");
  await expect(page.locator("#preview")).toHaveCSS("height", "480px");
  await page.locator("#rotate-viewport").click();
  await expect(page.locator("#preview")).toHaveCSS("width", "480px");
  await expect(rendered(page).locator("#message")).toContainText("1 个灵感");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("#layout-mode")).toHaveValue("stacked");
  await expect(page.locator("#preview")).toHaveCSS("width", "480px");
  await page.locator('[data-device="desktop"]').click();
  await page.locator("#preview-fullscreen").click();
  await expect.poll(() => page.evaluate(() => document.fullscreenElement?.className)).toBe("preview-panel");
  await page.locator("#preview-fullscreen").click();
  await expect.poll(() => page.evaluate(() => document.fullscreenElement)).toBe(null);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("v0.1 saved projects load intact and all templates execute without errors", async ({ page }) => {
  await page.goto(url);
  await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('web-renderer.workspace.v1'));
    delete saved.preferences;
    saved.projects[0].name = 'Legacy project';
    localStorage.setItem('web-renderer.workspace.v1', JSON.stringify(saved));
  });
  await page.reload();
  await expect(page.locator("#project-title")).toHaveText("Legacy project");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  for (const id of ["blank", "garden", "profile", "form", "landing", "todo", "resume", "website", "admin"]) {
    await page.locator("#open-templates").click();
    await page.locator(`[data-template="${id}"]`).click();
    await expect(page.locator("#preview-status")).toHaveText("预览已更新");
    await expect(page.locator("#runtime-errors")).toBeHidden();
  }
  await expect(page.locator(".project-item")).toHaveCount(10);
});

test("a real Manifest V3 extension loads and executes isolated preview JavaScript", async () => {
  const extensionPath = path.resolve(".");
  const context = await chromium.launchPersistentContext("", {
    channel: "chromium", headless: true, locale: "zh-CN",
    ...(process.env.PW_EXECUTABLE_PATH ? { executablePath: process.env.PW_EXECUTABLE_PATH } : {}),
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
  });
  try {
    const worker = context.serviceWorkers()[0] || await context.waitForEvent("serviceworker");
    const extensionId = new URL(worker.url()).host;
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/index.html`);
    await expect(rendered(page).locator("#grow")).toBeVisible();
    await previewPainted(page);
    await rendered(page).locator("#grow").click();
    await expect(rendered(page).locator("#message")).toContainText("1 个灵感");
    await page.locator("#auto-run").uncheck();
    await code(page, "js", `let isolated = false;
try { top.localStorage.getItem('web-renderer.workspace.v1'); } catch { isolated = true; }
document.querySelector('#message').textContent = String(isolated) + ':' + String(typeof chrome?.runtime);`);
    await run(page);
    await expect(rendered(page).locator("#message")).toHaveText("true:undefined");
    await code(page, "js", "console.log({sandbox:'works'});");
    await page.locator("#editor-format").click();
    await expect(page.locator("#code-editor .cm-content")).toContainText('sandbox: "works"');
    await run(page);
    await page.locator("#console-toggle").click();
    await expect(page.locator("#console-output")).toContainText("sandbox: works");
    await page.locator("#theme-toggle").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.locator("#preview-fullscreen").click();
    await expect.poll(() => page.evaluate(() => document.fullscreenElement?.className)).toBe("preview-panel");
    await page.locator("#preview-fullscreen").click();
    await code(page, "js", "document.querySelector('#message').textContent = 'true:undefined';");
    await page.reload();
    await expect(rendered(page).locator("#message")).toHaveText("true:undefined");
    await page.locator("#open-templates").click();
    await page.locator('[data-template-preview="admin"]').click();
    const templateDemo = page.frameLocator("#template-preview-frame").frameLocator("iframe");
    await expect(templateDemo.locator("#username")).toHaveValue("admin");
    await page.screenshot();
    await templateDemo.locator("#login-submit").click();
    await expect(templateDemo.locator("#page-overview")).toBeVisible();
    await page.locator("#use-template-preview").click();
    await expect(rendered(page).locator("#username")).toHaveValue("admin");
    await previewPainted(page);
    await rendered(page).locator('#login-submit').click();
    await expect(rendered(page).locator("#page-overview")).toBeVisible();
    await rendered(page).locator("#template-language-toggle").click();
    await expect(rendered(page).locator("#page-title")).toHaveText("Overview");
    await expect(rendered(page).locator("html")).toHaveAttribute("lang", "en");
    await rendered(page).locator('[data-page="users"]').click();
    await expect(rendered(page).locator("#user-list tr")).toHaveCount(4);
    expect(await worker.evaluate(() => chrome.action.onClicked.hasListeners())).toBe(true);
    const permissions = await worker.evaluate(() => chrome.runtime.getManifest().permissions || []);
    expect(permissions).toEqual([]);
  } finally { await context.close(); }
});
