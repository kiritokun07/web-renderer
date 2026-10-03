// 数据模型没有 DOM 依赖，方便单独阅读，也方便以后换成 chrome.storage。
export const STORAGE_KEY = "web-renderer.workspace.v1";
export const MAX_IMPORT_BYTES = 4 * 1024 * 1024;
export const MAX_PROJECTS = 100;

export function normalizePreferences(value = {}) {
  const data = value && typeof value === "object" ? value : {};
  const bounded = (number, fallback, min, max) => Number.isFinite(number) ? Math.round(Math.min(max, Math.max(min, number))) : fallback;
  return {
    theme: data.theme === "dark" ? "dark" : "light",
    layout: data.layout === "stacked" ? "stacked" : "side",
    split: bounded(data.split, 48, 25, 75),
    device: ["desktop", "mobile", "custom"].includes(data.device) ? data.device : "desktop",
    width: bounded(data.width, 375, 240, 2560),
    height: bounded(data.height, 667, 240, 2560),
    consoleHeight: bounded(data.consoleHeight, 190, 80, 1400),
  };
}

export function createProject(name, code = {}) {
  return {
    id: crypto.randomUUID(), name: name.trim().slice(0, 80),
    html: code.html ?? "<h1>Hello, world!</h1>\n<p>Start something small.</p>",
    css: code.css ?? "body {\n  padding: 32px;\n  font-family: system-ui, sans-serif;\n  color: #356448;\n}",
    js: code.js ?? "// Your JavaScript goes here.\n",
    updatedAt: new Date().toISOString(),
  };
}

export function validateProjects(projects) {
  if (!Array.isArray(projects) || !projects.length || projects.length > MAX_PROJECTS) throw new Error("invalidProjects");
  return projects.map(project => {
    if (!project || typeof project.name !== "string" || !project.name.trim() || project.name.length > 80) throw new Error("invalidProject");
    if (!["html", "css", "js"].every(key => typeof project[key] === "string")) throw new Error("invalidCode");
    return { ...createProject(project.name, project), updatedAt: typeof project.updatedAt === "string" && Number.isFinite(Date.parse(project.updatedAt)) ? project.updatedAt : new Date().toISOString() };
  });
}

export function parseImport(text) {
  if (new TextEncoder().encode(text).length > MAX_IMPORT_BYTES) throw new Error("tooLarge");
  const data = JSON.parse(text);
  if (data?.format !== "web-renderer" || data.version !== 1) throw new Error("invalidFormat");
  // 每次导入都生成新 ID，作为副本追加，不覆盖已有项目。
  return validateProjects(data.projects);
}

export function parseWorkspace(text) {
  const data = JSON.parse(text);
  if (data?.version !== 1) throw new Error("invalidWorkspace");
  const projects = validateProjects(data.projects);
  const ids = new Set();
  projects.forEach((project, index) => {
    const id = data.projects[index].id;
    if (typeof id !== "string" || !id || ids.has(id)) throw new Error("invalidId");
    project.id = id;
    ids.add(id);
  });
  return { version: 1, projects, activeId: ids.has(data.activeId) ? data.activeId : projects[0].id, language: data.language === "en" ? "en" : "zh", autoRun: data.autoRun !== false, preferences: normalizePreferences(data.preferences) };
}

export function serializeExport(projects) {
  return JSON.stringify({ format: "web-renderer", version: 1, exportedAt: new Date().toISOString(), projects }, null, 2);
}
