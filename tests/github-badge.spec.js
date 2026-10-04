import { test, expect } from "@playwright/test";
const url = "http://127.0.0.1:4173";
const api = "https://api.github.com/repos/kiritokun07/web-renderer";
const key = "web-renderer.github-stars.v1";

test("GitHub count is credential-free, cached, translated and usable on narrow screens", async ({ page }) => {
  let requests = 0;
  await page.route(api, async route => {
    requests++;
    expect(route.request().headers().cookie).toBeUndefined();
    expect(route.request().postData()).toBeNull();
    await route.fulfill({ json: { stargazers_count: 2051 } });
  });
  await page.goto(url);
  await expect(page.locator(".github-stars")).toHaveText("2,051");
  await expect(page.locator("#github-link")).toHaveAttribute("href", "https://github.com/kiritokun07/web-renderer");
  await expect(page.locator("#github-link")).toHaveAttribute("rel", "noopener noreferrer");
  await page.locator("#language").click();
  await expect(page.locator("#github-link")).toHaveAttribute("aria-label", /2,051 stars/);
  await page.reload();
  await expect(page.locator("#github-link")).toHaveAttribute("title", /cached/);
  expect(requests).toBe(1);
  await page.locator("#theme-toggle").click();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("#github-link")).toBeVisible();
  const box = await page.locator("#github-link").boundingBox();
  expect(box.x + box.width).toBeLessThanOrEqual(390);
});

test("zero is a valid star count; a failed refresh preserves stale cache", async ({ page }) => {
  await page.addInitScript(({key}) => localStorage.setItem(key, JSON.stringify({count: 0, at: Date.now() - 86400000})), { key });
  await page.route(api, route => route.fulfill({ status: 403, json: { message: "rate limited" } }));
  await page.goto(url);
  await expect(page.locator(".github-stars")).toHaveText("0");
  await expect(page.locator("#github-link")).toHaveAttribute("title", /缓存/);
  await expect(page.locator("#preview-status")).toHaveText("预览已更新");
});

test("offline or malformed data never invents a count or blocks editing", async ({ page }) => {
  await page.route(api, route => route.fulfill({ json: { stargazers_count: "invalid" } }));
  await page.goto(url);
  await expect(page.locator(".github-stars")).toHaveText("Star");
  await expect(page.locator("#preview-status")).toHaveText("预览已更新");
  await page.route(api, route => route.abort("internetdisconnected"));
  await page.reload();
  await expect(page.locator(".github-stars")).toHaveText("Star");
  await expect(page.locator("#preview-status")).toHaveText("预览已更新");
});
