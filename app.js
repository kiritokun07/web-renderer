import { STORAGE_KEY, MAX_IMPORT_BYTES, MAX_PROJECTS, createProject, parseImport, parseWorkspace, serializeExport, normalizePreferences } from "./model.js";
import { example } from "./example.js";
import { messages } from "./i18n.js";
import { createCodeEditor } from "./vendor/editor.js";
import { createConsolePanel } from "./console-panel.js";
import { createPreviewLayout } from "./layout.js";
import { templates } from "./templates.js";
import { builtinCode } from "./builtin-code.js";
import { createTemplatePreview } from "./template-preview.js";
import { legacyTemplateCode } from "./legacy-template-code.js";

const $ = selector => document.querySelector(selector);
const preview = $("#preview");
const defaultLanguage = navigator.language.startsWith("zh") ? "zh" : "en";
const firstProject = createProject(messages[defaultLanguage].exampleName, builtinCode.templates.garden[defaultLanguage]);
let state = { version: 1, projects: [firstProject], activeId: firstProject.id, language: defaultLanguage, autoRun: true, preferences: normalizePreferences() };
let activeTab = "html";
let saveOkay = true;
let storageBlocked = false;
let runTimer, toastTimer, previewTimer;
let runId = 0;
let previewStatus = "running";
let dialogMode = "new";
let sandboxReady = false;
let fullscreenPending = false;
let lastRunProjectId = null;

const t = (key, values = {}) => Object.entries(values).reduce((text, [name, value]) => text.replace(`{${name}}`, value), messages[state.language][key] ?? key);
const current = () => state.projects.find(project => project.id === state.activeId);

try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) state = parseWorkspace(saved);
  // 仅升级代码完全未改动的旧内置项目；名称、ID 与用户编辑过的内容保留。
  const originals = [[example, builtinCode.example], [createProject("Untitled"), builtinCode.blank], [legacyTemplateCode.example, builtinCode.templates.garden[state.language]], [legacyTemplateCode.blank, builtinCode.templates.blank[state.language]]];
  for (const template of templates) for (const language of ["zh", "en"]) {
    const replacement = builtinCode.templates[template.id][language];
    originals.push([template.code(language), replacement], [legacyTemplateCode.templates[template.id][language], replacement]);
  }
  for (const project of state.projects) {
    const match = originals.find(([source]) => ["html", "css", "js"].every(key => project[key] === source[key]));
    if (match) Object.assign(project, match[1]);
  }
} catch {
  storageBlocked = true;
  saveOkay = false;
}

const editor = createCodeEditor($("#code-editor"), handleCodeChange);
const debugConsole = createConsolePanel(t, () => state.preferences, save);
const previewLayout = createPreviewLayout(() => state.preferences, save, t);
const templatePreview = createTemplatePreview(t);

function toast(message) {
  clearTimeout(toastTimer);
  $("#toast").textContent = message;
  $("#toast").hidden = false;
  toastTimer = setTimeout(() => { $("#toast").hidden = true; }, 6000);
}

function updateSaveStatus() {
  $("#save-status").textContent = t(saveOkay ? "saved" : "saveFailed");
  $("#save-status").classList.toggle("failed", !saveOkay);
}

function updateFullscreenControls() {
  const fullscreenElement = document.fullscreenElement;
  document.querySelectorAll("[data-fullscreen]").forEach(button => {
    const target = button.dataset.fullscreen === "preview" ? $(".preview-panel") : document.documentElement;
    const active = fullscreenElement === target;
    button.textContent = t(active ? "exitFullscreen" : button.dataset.fullscreen === "preview" ? "previewFullscreen" : "workspaceFullscreen");
    button.setAttribute("aria-pressed", String(active));
    button.title = t(active ? "exitFullscreenHint" : "enterFullscreenHint");
    button.disabled = fullscreenPending;
  });
}

document.querySelectorAll("[data-fullscreen]").forEach(button => {
  button.addEventListener("click", async () => {
    if (fullscreenPending) return;
    const target = button.dataset.fullscreen === "preview" ? $(".preview-panel") : document.documentElement;
    const exiting = document.fullscreenElement === target;
    if (!document.fullscreenEnabled || !target.requestFullscreen || !document.exitFullscreen) {
      toast(t("fullscreenUnavailable"));
      return;
    }
    fullscreenPending = true;
    updateFullscreenControls();
    try {
      if (exiting) await document.exitFullscreen();
      else await target.requestFullscreen();
    } catch {
      toast(t("fullscreenFailed"));
    } finally {
      fullscreenPending = false;
      updateFullscreenControls();
    }
  });
});
// Esc、浏览器主动退出等情况也以真实状态更新按钮，不持久化全屏状态。
document.addEventListener("fullscreenchange", () => {
  updateFullscreenControls();
  // 让预览全屏期间的提示也出现在全屏元素内。
  const toastHost = document.fullscreenElement === $(".preview-panel") ? $(".preview-panel") : document.body;
  toastHost.append($("#toast"));
});

function save() {
  try {
    if (storageBlocked) throw new Error("storageBlocked");
    // 与导入限制保持一致，确保成功保存的数据可以完整导入。
    if (new Blob([serializeExport(state.projects)]).size > MAX_IMPORT_BYTES) throw new Error("backupTooLarge");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    saveOkay = true;
  } catch (error) {
    if (saveOkay) toast(t(error.message === "backupTooLarge" ? "backupTooLarge" : "saveFailed"));
    saveOkay = false;
  }
  updateSaveStatus();
}

function updateEditorMeta() {
  const lines = editor.value.split("\n").length;
  $("#editor-meta").textContent = `${lines} ${t("lines")} · ${editor.value.length} ${t("chars")}`;
}

function updateProjects() {
  const list = $("#project-list");
  list.replaceChildren();
  const query = $("#project-search").value.trim().toLocaleLowerCase();
  const matches = state.projects.filter(project => !query || [project.name, project.html, project.css, project.js].some(value => value.toLocaleLowerCase().includes(query)));
  $("#project-search-empty").hidden = matches.length > 0;
  for (const project of matches) {
    const button = document.createElement("button");
    button.className = "project-item";
    button.classList.toggle("active", project.id === state.activeId);
    button.setAttribute("aria-current", String(project.id === state.activeId));
    button.setAttribute("aria-label", project.name);
    button.title = project.name;
    const label = document.createElement("span");
    label.textContent = project.name;
    button.append(label);
    button.addEventListener("click", () => {
      state.activeId = project.id;
      save();
      showProject();
    });
    list.append(button);
  }
  $("#project-count").textContent = state.projects.length;
  $("#project-title").textContent = current().name;
  $("#breadcrumb-name").textContent = current().name;
  document.title = `${current().name} · Web Renderer`;
}

function setPreviewStatus(key) {
  previewStatus = key;
  $("#preview-status").textContent = t(key);
  $("#preview-stage").setAttribute("aria-busy", String(key === "running"));
}

function run() {
  clearTimeout(runTimer);
  clearTimeout(previewTimer);
  $("#runtime-errors").hidden = true;
  $("#error-message").textContent = "";
  setPreviewStatus("running");
  if (!sandboxReady) return;
  debugConsole.startRun(lastRunProjectId !== state.activeId);
  lastRunProjectId = state.activeId;
  runId += 1;
  // 沙箱具有不透明源，只能用 * 发送；接收端会校验 event.source。
  const { html, css, js } = current();
  preview.contentWindow.postMessage({ channel: "web-renderer", type: "render", runId, code: { html, css, js } }, "*");
  previewTimer = setTimeout(() => { if (previewStatus === "running") setPreviewStatus("previewFailed"); }, 8000);
}

function showProject() {
  updateProjects();
  editor.open(current(), activeTab);
  editor.prune(state.projects);
  updateEditorMeta();
  run();
}

function translate() {
  document.documentElement.lang = state.language === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach(element => { element.textContent = t(element.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => { element.placeholder = t(element.dataset.i18nPlaceholder); element.setAttribute("aria-label", element.placeholder); });
  $("#language").textContent = state.language === "zh" ? "EN" : "中文";
  $("#language").setAttribute("aria-label", state.language === "zh" ? "Switch to English" : "切换为中文");
  preview.title = t("previewTitle");
  $("#auto-run").checked = state.autoRun;
  updateSaveStatus();
  updateEditorMeta();
  setPreviewStatus(previewStatus);
  updateFullscreenControls();
  applyTheme();
  previewLayout.apply();
  debugConsole.refresh();
  renderTemplates();
}

function applyTheme() {
  const dark = state.preferences.theme === "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  $("#theme-toggle").textContent = t(dark ? "dayMode" : "nightMode");
  $("#theme-toggle").setAttribute("aria-pressed", String(dark));
  editor.setAppearance(state.preferences.theme, state.language);
}

function createFromTemplate(template) {
  if (state.projects.length >= MAX_PROJECTS) { $("#templates-dialog").close(); toast(t("projectLimit")); return; }
  const project = createProject(template.name[state.language], builtinCode.templates[template.id][state.language]);
  state.projects.push(project);
  state.activeId = project.id;
  $("#project-search").value = "";
  $("#templates-dialog").close();
  selectTab("html");
  save();
  showProject();
}

function renderTemplates() {
  $("#template-list").replaceChildren(...templates.map(template => {
    const card = document.createElement("article");
    card.className = "template-card";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "template-use";
    button.dataset.template = template.id;
    const icon = document.createElement("span"), name = document.createElement("strong"), description = document.createElement("span");
    icon.className = "template-icon";
    icon.textContent = template.icon;
    icon.setAttribute("aria-hidden", "true");
    name.textContent = template.name[state.language];
    description.className = "template-description";
    description.textContent = template.description[state.language];
    button.append(icon, name, description);
    button.addEventListener("click", () => createFromTemplate(template));
    const previewButton = document.createElement("button");
    previewButton.type = "button";
    previewButton.className = "template-preview-button";
    previewButton.dataset.templatePreview = template.id;
    previewButton.textContent = t("previewTemplate");
    const label = t("templatePreviewTitle", { name: template.name[state.language] });
    previewButton.setAttribute("aria-label", label);
    previewButton.setAttribute("aria-haspopup", "dialog");
    previewButton.setAttribute("aria-controls", "template-preview-dialog");
    previewButton.title = label;
    previewButton.addEventListener("click", () => templatePreview.open({
      name: template.name[state.language],
      code: builtinCode.templates[template.id][state.language],
      use: () => createFromTemplate(template),
    }));
    card.append(button, previewButton);
    return card;
  }));
}

function selectTab(tab) {
  activeTab = tab;
  document.querySelectorAll("[data-tab]").forEach(button => {
    const selected = button.dataset.tab === tab;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  $("#editor-area").setAttribute("aria-labelledby", `tab-${tab}`);
  editor.open(current(), tab);
  updateEditorMeta();
}

function handleCodeChange(value) {
  current()[activeTab] = value;
  current().updatedAt = new Date().toISOString();
  updateEditorMeta();
  save();
  clearTimeout(runTimer);
  clearTimeout(previewTimer);
  // 使上一次运行的延迟消息失效。
  runId += 1;
  setPreviewStatus("pending");
  if (state.autoRun) runTimer = setTimeout(run, 550);
  if ($("#project-search").value.trim()) updateProjects();
}
$("#editor-search").addEventListener("click", () => editor.search());
$("#editor-undo").addEventListener("click", () => editor.undo());
$("#editor-redo").addEventListener("click", () => editor.redo());
$("#editor-format").addEventListener("click", async () => {
  $("#editor-format").disabled = true;
  try { if (!await editor.format()) toast(t("formatCancelled")); }
  catch (error) { toast(`${t("formatFailed")} ${String(error.message).slice(0, 180)}`); }
  finally { $("#editor-format").disabled = false; }
});
$("#project-search").addEventListener("input", updateProjects);
$("#theme-toggle").addEventListener("click", () => { state.preferences.theme = state.preferences.theme === "dark" ? "light" : "dark"; applyTheme(); save(); });
$("#open-templates").addEventListener("click", () => $("#templates-dialog").showModal());
$("#close-templates").addEventListener("click", () => $("#templates-dialog").close());
document.querySelectorAll("[data-tab]").forEach(button => {
  button.addEventListener("click", () => selectTab(button.dataset.tab));
  button.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const tabs = ["html", "css", "js"];
    const index = event.key === "Home" ? 0 : event.key === "End" ? 2 : (tabs.indexOf(activeTab) + (event.key === "ArrowRight" ? 1 : 2)) % 3;
    selectTab(tabs[index]);
    $(`#tab-${activeTab}`).focus();
  });
});

$("#run").addEventListener("click", run);
$("#run-shortcut").textContent = /Mac/.test(navigator.platform) ? "⌘ ↵" : "Ctrl ↵";
document.addEventListener("keydown", event => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && !document.querySelector("dialog[open]")) { event.preventDefault(); run(); }
});
$("#auto-run").addEventListener("change", event => {
  state.autoRun = event.target.checked;
  clearTimeout(runTimer);
  save();
  if (state.autoRun) run();
});
$("#language").addEventListener("click", () => { state.language = state.language === "zh" ? "en" : "zh"; translate(); save(); });

function openProjectDialog(mode) {
  if (mode === "new" && state.projects.length >= MAX_PROJECTS) return toast(t("projectLimit"));
  dialogMode = mode;
  $("#dialog-title").textContent = t(mode === "new" ? "newProject" : "rename");
  $("#project-name").value = mode === "new" ? t("untitled") : current().name;
  $("#project-name").setCustomValidity("");
  $("#project-dialog").showModal();
  $("#project-name").select();
}
$("#new-project").addEventListener("click", () => openProjectDialog("new"));
$("#rename-project").addEventListener("click", () => openProjectDialog("rename"));
$("#cancel-dialog").addEventListener("click", () => $("#project-dialog").close());
$("#project-name").addEventListener("input", event => event.target.setCustomValidity(""));
$("#project-form").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("#project-name").value.trim();
  if (!name) { $("#project-name").setCustomValidity(t("emptyName")); $("#project-name").reportValidity(); return; }
  if (dialogMode === "new") {
    if (state.projects.length >= MAX_PROJECTS) return toast(t("projectLimit"));
    const project = createProject(name, builtinCode.templates.blank[state.language]);
    state.projects.push(project);
    state.activeId = project.id;
    $("#project-search").value = "";
  } else {
    current().name = name;
    current().updatedAt = new Date().toISOString();
  }
  $("#project-dialog").close();
  save();
  showProject();
});
$("#delete-project").addEventListener("click", () => {
  if (!confirm(t("confirmDelete", { name: current().name }))) return;
  state.projects = state.projects.filter(project => project.id !== state.activeId);
  editor.prune(state.projects);
  if (!state.projects.length) state.projects.push(createProject(t("untitled"), builtinCode.templates.blank[state.language]));
  state.activeId = state.projects[0].id;
  save();
  showProject();
  toast(t("deleted"));
});

$("#export-projects").addEventListener("click", () => {
  try {
    const url = URL.createObjectURL(new Blob([serializeExport(state.projects)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `web-renderer-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    toast(t("exported"));
  } catch { toast(t("exportFailed")); }
});
$("#import-projects").addEventListener("click", () => $("#import-file").click());
$("#import-file").addEventListener("change", async event => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    if (file.size > MAX_IMPORT_BYTES) throw new Error("tooLarge");
    const projects = parseImport(await file.text());
    if (state.projects.length + projects.length > MAX_PROJECTS) throw new Error("projectLimit");
    const combined = [...state.projects, ...projects];
    if (new Blob([serializeExport(combined)]).size > MAX_IMPORT_BYTES) throw new Error("backupTooLarge");
    state.projects = combined;
    state.activeId = projects[0].id;
    $("#project-search").value = "";
    save();
    showProject();
    toast(t("imported", { count: projects.length }));
  } catch (error) { toast(t(["tooLarge", "projectLimit", "backupTooLarge"].includes(error.message) ? error.message : "importFailed")); }
  finally { event.target.value = ""; }
});

window.addEventListener("message", event => {
  if (event.source !== preview.contentWindow || event.data?.channel !== "web-renderer") return;
  if (event.data.type === "ready") { sandboxReady = true; run(); return; }
  if (event.data.runId !== runId) return;
  if (event.data.type === "console") debugConsole.add(event.data.level, event.data.message);
  if (event.data.type === "console-clear") debugConsole.clear();
  if (event.data.type === "rendered") { clearTimeout(previewTimer); if ($("#runtime-errors").hidden) setPreviewStatus("rendered"); }
  if (event.data.type === "error" && typeof event.data.message === "string") {
    clearTimeout(previewTimer);
    $("#runtime-errors").hidden = false;
    $("#error-message").textContent = event.data.message.slice(0, 2000);
    setPreviewStatus("errorStatus");
    debugConsole.add("error", event.data.message);
  }
});
window.addEventListener("storage", event => {
  if (event.key !== STORAGE_KEY || !event.newValue) return;
  // 未保存的内存数据优先保留，避免另一标签页覆盖恢复机会。
  if (!saveOkay || storageBlocked) return;
  try {
    const incoming = parseWorkspace(event.newValue);
    if (incoming.projects.some(project => project.id === state.activeId)) incoming.activeId = state.activeId;
    state = incoming;
    editor.prune(state.projects);
    translate();
    showProject();
  } catch { /* 忽略其他标签页写入的无效结构。 */ }
});

translate();
showProject();
if (!storageBlocked) save();
else toast(t("loadFailed"));
// 先安装 message 监听器，再加载沙箱，避免丢失 ready 消息。
preview.src = "sandbox.html";
