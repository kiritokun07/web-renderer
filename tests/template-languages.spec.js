import { test, expect } from "@playwright/test";
import { legacyTemplateCode } from "../legacy-template-code.js";
import { builtinCode } from "../builtin-code.js";

const rendered = page => page.frameLocator("#preview").frameLocator("iframe");
const demo = page => page.frameLocator("#template-preview-frame").frameLocator("iframe");
async function create(page, id) {
  await page.locator("#open-templates").click();
  await page.locator(`[data-template="${id}"]`).click();
  await expect(page.locator("#preview-status")).toHaveText("预览已更新");
  await page.screenshot();
}

for (const initial of ["zh", "en"]) {
  test(`all nine ${initial} templates can switch languages in place and back`, async ({ page }) => {
    await page.goto("http://127.0.0.1:4173");
    if (initial === "en") await page.locator("#language").click();
    await page.locator("#open-templates").click();
    const cases = [
      ["blank", "h1", "你好，世界！", "Hello, world!"],
      ["resume", "h1", "林晨", "Alex Lin"],
      ["website", "h1", "让品牌的下一步", "Your next chapter"],
      ["admin", ".login-card h2", "登录工作台", "Sign in to your workspace"],
      ["garden", "h1", "让想法，慢慢生长。", "Let your ideas grow."],
      ["profile", "h1", "你好，我是 Kirito", "Hi, I’m Kirito"],
      ["form", "h1", "留下一个想法", "Leave an idea"],
      ["landing", "h1", "让每个想法，都有起点。", "Give every idea a beginning."],
      ["todo", "h1", "今天的小目标", "Small goals for today"],
    ];
    for (const [id, selector, zh, en] of cases) {
      await page.locator(`[data-template-preview="${id}"]`).click();
      const frame = demo(page);
      await expect(frame.locator("html")).toHaveAttribute("lang", initial === "zh" ? "zh-CN" : "en");
      await expect(frame.locator(selector)).toContainText(initial === "zh" ? zh : en);
      const original = (await frame.locator("body").innerText()).replace(/\s+/g, " ");
      await page.screenshot();
      await frame.locator("#template-language-toggle").click();
      await expect(frame.locator("html")).toHaveAttribute("lang", initial === "zh" ? "en" : "zh-CN");
      await expect(frame.locator(selector)).toContainText(initial === "zh" ? en : zh);
      if (initial === "zh") expect((await frame.locator("body").innerText()).replace("中文", "")).not.toMatch(/[\u4e00-\u9fff]/);
      await frame.locator("#template-language-toggle").click();
      await expect(frame.locator(selector)).toContainText(initial === "zh" ? zh : en);
      expect((await frame.locator("body").innerText()).replace(/\s+/g, " ")).toBe(original);
      await expect(page.locator("#template-preview-error")).toBeHidden();
      await page.locator("#close-template-preview").click();
    }
    await expect(page.locator(".project-item")).toHaveCount(1);
  });
}

test("language switches preserve todo state, inputs and dynamic replies in created projects", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173");
  await create(page, "todo");
  const frame = rendered(page);
  await frame.locator("#task").fill("保留我的文字 <img src=x>");
  await frame.locator("#add").click();
  await frame.locator("#list input").check();
  await frame.locator("#task").fill("还没提交");
  await frame.locator("#template-language-toggle").click();
  await expect(frame.locator("#task")).toHaveAttribute("placeholder", "Add a small goal");
  await expect(frame.locator("#task")).toHaveValue("还没提交");
  await expect(frame.locator("#list input")).toBeChecked();
  await expect(frame.locator("#list input")).toHaveAttribute("aria-label", "Complete");
  await expect(frame.locator("#list span")).toHaveText("保留我的文字 <img src=x>");
  await expect(frame.locator("#list img")).toHaveCount(0);
  await frame.locator("#list button").click();
  await expect(frame.locator("#list li")).toHaveCount(0);

  await create(page, "profile");
  await frame.locator("#hello").click();
  await frame.locator("#template-language-toggle").click();
  await expect(frame.locator("#reply")).toHaveText("Nice to meet you!");
  await create(page, "garden");
  await frame.locator("#grow").click();
  await frame.locator("#template-language-toggle").click();
  await expect(frame.locator("#message")).toContainText("Planted 1 idea");
  await frame.locator("#grow").click();
  await expect(frame.locator("#message")).toContainText("Planted 2 ideas");
  await create(page, "form");
  await frame.locator("#submit").click();
  await frame.locator("#template-language-toggle").click();
  await expect(frame.locator("#result")).toHaveText("Please enter a name and an idea.");
  await expect(page.locator("#runtime-errors")).toBeHidden();
});

test("admin retains login, active menu, settings and search while translating", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173");
  await create(page, "admin");
  const frame = rendered(page);
  await frame.locator("#password").fill("wrong-password");
  await frame.locator("#login-submit").click();
  await frame.locator("#template-language-toggle").click();
  await expect(frame.locator("#login-error")).toContainText("Incorrect username or password");
  await expect(frame.locator("#password")).toHaveValue("wrong-password");
  await frame.locator("#password").fill("admin123");
  await frame.locator("#login-submit").click();
  await frame.locator('[data-page="settings"]').click();
  await frame.locator("#workspace-name").fill("自己的工作台");
  await frame.locator("#notifications").uncheck();
  await frame.locator("#settings-save").click();
  await frame.locator("#template-language-toggle").click();
  await expect(frame.locator("#login-page")).toBeHidden();
  await expect(frame.locator("#page-settings")).toBeVisible();
  await expect(frame.locator("#page-title")).toHaveText("系统设置");
  await expect(frame.locator("#settings-result")).toContainText("设置已保存");
  await expect(frame.locator("[data-workspace-name]").first()).toHaveText("自己的工作台");
  await expect(frame.locator("#notifications")).not.toBeChecked();
  await frame.locator('[data-page="users"]').click();
  await frame.locator("#user-search").fill("sam@example.com");
  await frame.locator("#template-language-toggle").click();
  await expect(frame.locator("#page-title")).toHaveText("Users");
  await expect(frame.locator("#user-list tr:visible")).toHaveCount(1);
  await expect(frame.locator("#user-list tr:visible")).toContainText("Sam Chen");
  await expect(frame.locator("#users-count")).toHaveText("1 user");
  await frame.locator("#logout").click();
  await expect(frame.locator("#login-page")).toBeVisible();
  await expect(frame.locator("#login-submit")).toContainText("Sign in");
});

test("website translates confirmation and textarea placeholder without clearing the enquiry", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173");
  await create(page, "website");
  const frame = rendered(page);
  await frame.locator("#contact-name").fill("小林");
  await frame.locator("#contact-email").fill("alex@example.com");
  await frame.locator("#contact-message").fill("这是我输入的想法。");
  await frame.locator("#contact-submit").click();
  await frame.locator("#template-language-toggle").click();
  await expect(frame.locator("#contact-message")).toHaveAttribute("placeholder", "What would you like to create?");
  await expect(frame.locator("#contact-message")).toHaveValue("这是我输入的想法。");
  await expect(frame.locator("#contact-result")).toContainText("小林, your enquiry is confirmed");
  await page.locator('[data-device="mobile"]').click();
  await expect(frame.locator("#template-language-toggle")).toBeInViewport();
  expect(await frame.locator("body").evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("only untouched older templates are upgraded with language controls", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173");
  await page.evaluate(code => {
    const state = JSON.parse(localStorage.getItem("web-renderer.workspace.v1"));
    Object.assign(state.projects[0], code);
    state.projects.push({ ...state.projects[0], id: crypto.randomUUID(), name: "My changes", html: code.html + "<!-- preserve this -->" });
    localStorage.setItem("web-renderer.workspace.v1", JSON.stringify(state));
  }, legacyTemplateCode.templates.admin.en);
  await page.reload();
  await expect(rendered(page).locator("#template-language-toggle")).toBeVisible();
  await expect(rendered(page).locator("html")).toHaveAttribute("lang", "en");
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem("web-renderer.workspace.v1")));
  expect(state.projects[0].js).toBe(builtinCode.templates.admin.en.js);
  expect(state.projects[1].html).toBe(legacyTemplateCode.templates.admin.en.html + "<!-- preserve this -->");
  expect(state.projects[1].js).toBe(legacyTemplateCode.templates.admin.en.js);
});
