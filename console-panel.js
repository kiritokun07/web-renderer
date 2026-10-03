// 只接收沙箱转发的字符串快照；日志通过 textContent 展示，绝不执行 HTML。
export function createConsolePanel(t, getPreferences, save) {
  const $ = selector => document.querySelector(selector);
  let entries = [];
  let open = false;
  const limit = 200;
  const panel = $("#console-panel");
  const resizer = $("#console-resizer");
  const previewPanel = $(".preview-panel");
  let drag = null;
  function maximumHeight() {
    const controlsHeight = [".preview-panel > .panel-toolbar", "#viewport-settings", ".preview-footer"]
      .reduce((total, selector) => total + $(selector).offsetHeight, 0);
    // 保留至少 80px 的预览空间；全屏、上下布局和窄屏时重新计算。
    return Math.max(80, Math.min(1400, previewPanel.clientHeight - controlsHeight - 80));
  }
  function applyHeight() {
    const maximum = maximumHeight();
    const height = Math.round(Math.min(maximum, Math.max(80, getPreferences().consoleHeight)));
    panel.style.height = `${height}px`;
    resizer.setAttribute("aria-valuemax", maximum);
    resizer.setAttribute("aria-valuenow", height);
    resizer.setAttribute("aria-valuetext", `${height}px`);
    resizer.setAttribute("aria-label", t("resizeConsole"));
    resizer.title = t("resizeConsoleHint");
  }
  function setHeight(value) {
    getPreferences().consoleHeight = Math.round(Math.min(maximumHeight(), Math.max(80, value)));
    applyHeight();
  }
  resizer.addEventListener("pointerdown", event => {
    if (event.button !== 0) return;
    drag = { y: event.clientY, height: panel.getBoundingClientRect().height };
    resizer.setPointerCapture(event.pointerId);
    previewPanel.classList.add("console-resizing");
    event.preventDefault();
  });
  resizer.addEventListener("pointermove", event => {
    if (drag) setHeight(drag.height + drag.y - event.clientY);
  });
  function finishResize() {
    if (!drag) return;
    drag = null;
    previewPanel.classList.remove("console-resizing");
    save();
  }
  for (const event of ["pointerup", "pointercancel", "lostpointercapture"]) resizer.addEventListener(event, finishResize);
  resizer.addEventListener("keydown", event => {
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const height = panel.getBoundingClientRect().height;
    setHeight(event.key === "Home" ? 80 : event.key === "End" ? maximumHeight() : height + (event.key === "ArrowUp" ? 20 : -20));
    save();
  });
  resizer.addEventListener("dblclick", () => { setHeight(190); save(); });
  const observer = new ResizeObserver(applyHeight);
  for (const selector of [".preview-panel", ".preview-panel > .panel-toolbar", "#viewport-settings", ".preview-footer"]) observer.observe($(selector));
  function render() {
    entries = entries.slice(-limit);
    const level = $("#console-level").value;
    const visible = entries.filter(entry => level === "all" || entry.level === level || (level === "log" && ["info", "debug"].includes(entry.level)));
    $("#console-output").replaceChildren(...visible.map(entry => {
      const row = document.createElement("div");
      row.className = `console-entry ${entry.level}`;
      const badge = document.createElement("span");
      badge.className = "console-badge";
      badge.textContent = entry.level;
      const text = document.createElement("pre");
      text.textContent = entry.message;
      row.append(badge, text);
      return row;
    }));
    $("#console-empty").hidden = visible.length > 0;
    $("#console-count").textContent = entries.length;
    $("#console-toggle").classList.toggle("has-errors", entries.some(entry => entry.level === "error"));
    panel.hidden = !open;
    applyHeight();
    $("#console-toggle").setAttribute("aria-expanded", String(open));
    $("#console-output").scrollTop = $("#console-output").scrollHeight;
  }
  $("#console-toggle").addEventListener("click", () => { open = !open; render(); });
  $("#console-close").addEventListener("click", () => { open = false; render(); });
  $("#console-clear").addEventListener("click", () => { entries = []; render(); });
  $("#console-level").addEventListener("change", render);
  return {
    add(level, message) {
      if (!["log", "info", "debug", "warn", "error"].includes(level) || typeof message !== "string") return;
      entries.push({ level, message: message.slice(0, 8000) });
      if (level === "error") open = true;
      render();
    },
    clear() { entries = []; render(); },
    startRun(projectChanged) {
      if (projectChanged || !$("#console-preserve").checked) entries = [];
      else if (entries.length) entries.push({ level: "info", message: t("consoleNewRun") });
      render();
    },
    refresh: render,
  };
}
