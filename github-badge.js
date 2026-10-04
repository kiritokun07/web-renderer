const API = "https://api.github.com/repos/kiritokun07/web-renderer";
const CACHE_KEY = "web-renderer.github-stars.v1";
const CACHE_AGE = 6 * 60 * 60 * 1000;
const validCount = value => Number.isSafeInteger(value) && value >= 0;

export function createGithubBadge(link, t) {
  const count = link.querySelector(".github-stars");
  let stars = null;
  let cached = false;
  const refresh = () => {
    count.textContent = stars === null ? "Star" : stars.toLocaleString("en-US");
    const label = stars === null ? t("githubUnavailable") : t(cached ? "githubCached" : "githubStars", { count: count.textContent });
    link.title = label;
    link.setAttribute("aria-label", label);
  };
  const load = async () => {
    let saved;
    try { saved = JSON.parse(localStorage.getItem(CACHE_KEY)); } catch { /* Storage may be unavailable. */ }
    if (validCount(saved?.count) && Number.isFinite(saved?.at) && saved.at <= Date.now()) {
      stars = saved.count;
      cached = true;
      refresh();
      if (Date.now() - saved.at < CACHE_AGE) return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      // Public CORS API only: no token, cookies, project data or host permissions.
      const response = await fetch(API, { credentials: "omit", referrerPolicy: "no-referrer", signal: controller.signal });
      if (!response.ok) throw new Error("GitHub is unavailable");
      const data = await response.json();
      if (!validCount(data.stargazers_count)) throw new Error("Invalid star count");
      stars = data.stargazers_count;
      cached = false;
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ count: stars, at: Date.now() })); } catch { /* Keep the count in memory. */ }
    } catch { /* Keep cached data or a usable Star link; never block the editor. */ }
    finally { clearTimeout(timer); refresh(); }
  };
  refresh();
  void load();
  return { refresh };
}
