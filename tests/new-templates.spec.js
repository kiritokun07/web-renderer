import { test, expect } from "@playwright/test";

const preview = page => page.frameLocator("#preview").frameLocator("iframe");
async function openTemplate(page, id) {
  await page.locator("#open-templates").click();
  await page.locator(`[data-template="${id}"]`).click();
  await expect(page.locator("#preview-status")).toHaveText(/预览已更新|Preview updated/);
  await expect(page.locator("#runtime-errors")).toBeHidden();
  // Wait for the nested sandbox's first compositor frame before pointer events.
  await page.screenshot();
}
async function expectNoOverflow(frame) {
  expect(await frame.locator("body").evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

test("template previews are interactive, isolated, disposable and can create a project", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173");
  await expect(page.locator("#preview-status")).toHaveText("预览已更新");
  await page.screenshot();
  await preview(page).locator("#grow").click();
  await expect(preview(page).locator("#message")).toContainText("1 个灵感");
  const saved = await page.evaluate(() => localStorage.getItem("web-renderer.workspace.v1"));
  const source = await page.locator("#code-editor .cm-content").innerText();
  await page.locator("#open-templates").click();
  await expect(page.locator(".template-card").first().locator("[data-template]")).toHaveAttribute("data-template", "blank");
  await expect(page.locator("[data-template-preview]")).toHaveCount(9);
  await page.locator('[data-template-preview="admin"]').click();
  const dialog = page.locator("#template-preview-dialog");
  const demo = page.frameLocator("#template-preview-frame").frameLocator("iframe");
  await expect(dialog).toBeVisible();
  await expect(page.locator("#template-preview-title")).toHaveText("预览 · 管理后台");
  await expect(page.locator("#template-preview-status")).toHaveText("预览已更新");
  await expect(page.locator("#template-preview-frame")).toHaveAttribute("sandbox", "allow-scripts");
  await page.screenshot();
  await demo.locator("#login-submit").click();
  await expect(demo.locator("#page-overview")).toBeVisible();
  await demo.locator('[data-page="users"]').click();
  await expect(demo.locator("#user-list tr")).toHaveCount(4);
  await page.locator("#close-template-preview").click();
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("#template-preview-frame")).toHaveCount(0);
  await expect(page.locator("#templates-dialog")).toBeVisible();
  await expect(page.locator('[data-template-preview="admin"]')).toBeFocused();
  expect(await page.evaluate(() => localStorage.getItem("web-renderer.workspace.v1"))).toBe(saved);
  expect(await page.locator("#code-editor .cm-content").innerText()).toBe(source);
  await expect(preview(page).locator("#message")).toContainText("1 个灵感");
  await expect(page.locator("#console-count")).toHaveText("0");
  await page.locator('[data-template-preview="admin"]').click();
  await expect(demo.locator("#login-page")).toBeVisible();
  await expect(demo.locator("#admin-page")).toBeHidden();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("#template-preview-frame")).toHaveCount(0);
  await expect(page.locator("#templates-dialog")).toBeVisible();

  await page.locator('[data-template-preview="todo"]').click();
  await expect(page.locator("#template-preview-status")).toHaveText("预览已更新");
  await page.screenshot();
  await demo.locator("#task").fill("Preview only");
  await demo.locator("#add").click();
  await expect(demo.locator("#list")).toContainText("Preview only");
  await page.locator("#use-template-preview").click();
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("#templates-dialog")).not.toBeVisible();
  await expect(page.locator(".project-item")).toHaveCount(2);
  await expect(page.locator("#project-title")).toHaveText("待办清单");
  await expect(preview(page).locator("#list li")).toHaveCount(0);
});

test("template preview supports narrow screens, dark theme and English", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173");
  await page.locator("#language").click();
  await page.locator("#theme-toggle").click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#open-templates").click();
  await page.locator('[data-template-preview="website"]').focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#template-preview-title")).toHaveText("Preview · Company website");
  await expect(page.locator("#template-preview-status")).toHaveText("Preview updated");
  await expect(page.locator("#close-template-preview")).toBeInViewport();
  await expect(page.locator("#use-template-preview")).toBeInViewport();
  const demo = page.frameLocator("#template-preview-frame").frameLocator("iframe");
  await expect(demo.locator("h1")).toContainText("Your next chapter");
  const box = await page.locator("#template-preview-dialog").boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(390);
  expect(box.y + box.height).toBeLessThanOrEqual(844);
  expect(await page.locator("#template-preview-dialog").evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
  await expectNoOverflow(demo);
  await page.locator("#close-template-preview").click();
  await expect(page.locator("#templates-dialog")).toBeVisible();
});

for (const language of ["zh", "en"]) {
  test(`${language}: resume and company website offer responsive, local interactions`, async ({ page }) => {
    await page.goto("http://127.0.0.1:4173");
    if (language === "en") await page.locator("#language").click();
    await openTemplate(page, "resume");
    const frame = preview(page);
    await expect(frame.locator("h1")).toContainText(language === "zh" ? "林晨" : "Alex Lin");
    await expect(frame.locator("#experience .experience")).toHaveCount(2);
    await expect(frame.locator("#projects .project")).toHaveCount(2);
    await expect(frame.locator("#contact")).toBeHidden();
    await frame.locator("#contact-toggle").click();
    await expect(frame.locator("#contact")).toContainText("alex@example.com");
    await expect(frame.locator("#contact-toggle")).toHaveAttribute("aria-expanded", "true");
    await frame.locator("#contact-toggle").click();
    await expect(frame.locator("#contact")).toBeHidden();
    await page.locator('[data-device="mobile"]').click();
    await expectNoOverflow(frame);

    await openTemplate(page, "website");
    await expect(frame.locator(".service-grid article")).toHaveCount(3);
    await expect(frame.locator(".work-grid article")).toHaveCount(2);
    await expectNoOverflow(frame);
    await frame.locator('nav a[href="#contact"]').click();
    await expect(frame.locator("#contact-name")).toBeInViewport();
    await frame.locator("#contact-name").fill("Alex <img src=x>");
    await frame.locator("#contact-email").fill("alex@example.com");
    await frame.locator("#contact-message").fill("A new company website");
    await frame.locator('#contact-submit').click();
    await expect(frame.locator("#contact-result")).toContainText("Alex <img src=x>");
    await expect(frame.locator("#contact-result")).toContainText(language === "zh" ? "本页确认" : "confirmed in this preview");
    await expect(frame.locator("#contact-result img")).toHaveCount(0);
    await expect(page.locator(".project-item")).toHaveCount(3);
    await expect(page.locator("#runtime-errors")).toBeHidden();
  });

  test(`${language}: admin login validates credentials, menus work and sign-out resets access`, async ({ page }) => {
    await page.goto("http://127.0.0.1:4173");
    if (language === "en") await page.locator("#language").click();
    await openTemplate(page, "admin");
    const frame = preview(page);
    await expect(frame.locator("#username")).toHaveValue("admin");
    await expect(frame.locator("#password")).toHaveValue("admin123");
    await expect(frame.locator("#admin-page")).toBeHidden();
    await frame.locator("#password").fill("wrong-password");
    await frame.locator('#login-submit').click();
    await expect(frame.locator("#login-error")).toBeVisible();
    await expect(frame.locator("#admin-page")).toBeHidden();
    await frame.locator("#password").fill("admin123");
    await frame.locator("#username").fill("guest");
    await frame.locator("#password").press("Enter");
    await expect(frame.locator("#login-error")).toBeVisible();
    await expect(frame.locator("#admin-page")).toBeHidden();
    await frame.locator("#username").fill("admin");
    await frame.locator("#password").press("Enter");
    await expect(frame.locator("#login-page")).toBeHidden();
    await expect(frame.locator("#page-overview")).toBeVisible();
    await expect(frame.locator(".stat-card")).toHaveCount(4);
    await expect(frame.locator('[data-page="overview"]')).toHaveAttribute("aria-current", "page");
    await frame.locator("#view-orders").click();
    await expect(frame.locator("#page-orders")).toBeVisible();
    await expect(frame.locator("#page-overview")).toBeHidden();
    await expect(frame.locator("#page-orders tbody tr")).toHaveCount(4);
    await frame.locator('[data-page="users"]').click();
    await frame.locator("#user-search").fill("SAM@EXAMPLE.COM");
    await expect(frame.locator("#user-list tr:visible")).toHaveCount(1);
    await frame.locator("#user-search").fill("no-such-user");
    await expect(frame.locator("#users-empty")).toBeVisible();
    await frame.locator("#user-search").fill("");
    await expect(frame.locator("#user-list tr:visible")).toHaveCount(4);

    await frame.locator('[data-page="settings"]').click();
    await frame.locator("#workspace-name").fill("My Workspace");
    await frame.locator("#notifications").uncheck();
    await frame.locator('#settings-save').click();
    await expect(frame.locator("#settings-result")).toContainText(language === "zh" ? "已保存" : "saved");
    await expect(frame.locator("[data-workspace-name]").first()).toHaveText("My Workspace");
    await frame.locator('[data-page="overview"]').click();
    await expect(frame.locator(".activity-panel")).toBeHidden();
    await page.locator('[data-device="mobile"]').click();
    await expectNoOverflow(frame);
    await frame.locator('[data-page="users"]').click();
    await expect(frame.locator("#page-users")).toBeVisible();
    await expectNoOverflow(frame);
    await frame.locator("#logout").click();
    await expect(frame.locator("#login-page")).toBeVisible();
    await expect(frame.locator("#admin-page")).toBeHidden();
    await expect(frame.locator("#username")).toHaveValue("admin");
    await expectNoOverflow(frame);
    await frame.locator('#login-submit').click();
    await expect(frame.locator("#page-overview")).toBeVisible();
    await page.locator("#run").click();
    await expect(frame.locator("#login-page")).toBeVisible();
    await expect(frame.locator("#admin-page")).toBeHidden();
    await expect(page.locator("#runtime-errors")).toBeHidden();
  });
}
