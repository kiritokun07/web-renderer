export function createPreviewLayout(getPreferences, save, t) {
  const $ = selector => document.querySelector(selector);
  const workbench = $(".workbench"), splitter = $("#panel-splitter"), preview = $("#preview");
  let dragging = false;
  function apply() {
    const preferences = getPreferences();
    workbench.classList.toggle("stacked", preferences.layout === "stacked");
    workbench.style.setProperty("--editor-share", `${preferences.split}fr`);
    workbench.style.setProperty("--preview-share", `${100 - preferences.split}fr`);
    splitter.setAttribute("aria-orientation", preferences.layout === "stacked" ? "horizontal" : "vertical");
    splitter.setAttribute("aria-valuenow", preferences.split);
    splitter.setAttribute("aria-label", t("resizePanels"));
    $("#layout-mode").value = preferences.layout;
    const fixed = preferences.device !== "desktop";
    $("#viewport-settings").hidden = !fixed;
    $("#preview-stage").classList.toggle("fixed-size", fixed);
    preview.style.width = fixed ? `${preferences.width}px` : "100%";
    preview.style.height = fixed ? `${preferences.height}px` : "100%";
    $("#viewport-width").value = preferences.width;
    $("#viewport-height").value = preferences.height;
    document.querySelectorAll("[data-device]").forEach(button => {
      const selected = button.dataset.device === preferences.device;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }
  $("#layout-mode").addEventListener("change", event => { getPreferences().layout = event.target.value; apply(); save(); });
  document.querySelectorAll("[data-device]").forEach(button => button.addEventListener("click", () => {
    const preferences = getPreferences();
    preferences.device = button.dataset.device;
    if (preferences.device === "mobile") { preferences.width = 375; preferences.height = 667; }
    apply(); save();
  }));
  for (const side of ["width", "height"]) {
    $(`#viewport-${side}`).addEventListener("change", event => {
      if (!event.target.reportValidity()) { apply(); return; }
      getPreferences()[side] = Math.round(Number(event.target.value));
      getPreferences().device = "custom";
      apply(); save();
    });
  }
  $("#rotate-viewport").addEventListener("click", () => {
    const preferences = getPreferences();
    [preferences.width, preferences.height] = [preferences.height, preferences.width];
    preferences.device = "custom";
    apply(); save();
  });
  function setSplit(value) { getPreferences().split = Math.round(Math.min(75, Math.max(25, value))); apply(); }
  splitter.addEventListener("pointerdown", event => {
    if (event.button !== 0) return;
    dragging = true;
    splitter.setPointerCapture(event.pointerId);
    workbench.classList.add("resizing");
    event.preventDefault();
  });
  splitter.addEventListener("pointermove", event => {
    if (!dragging) return;
    const box = workbench.getBoundingClientRect();
    setSplit(getPreferences().layout === "stacked" ? 100 * (event.clientY - box.top) / box.height : 100 * (event.clientX - box.left) / box.width);
  });
  function finish() {
    if (!dragging) return;
    dragging = false;
    workbench.classList.remove("resizing");
    save();
  }
  splitter.addEventListener("pointerup", finish);
  splitter.addEventListener("pointercancel", finish);
  splitter.addEventListener("lostpointercapture", finish);
  splitter.addEventListener("keydown", event => {
    const moves = getPreferences().layout === "stacked" ? { ArrowUp: -5, ArrowDown: 5 } : { ArrowLeft: -5, ArrowRight: 5 };
    if (!(event.key in moves) && !["Home", "End"].includes(event.key)) return;
    event.preventDefault();
    setSplit(event.key === "Home" ? 25 : event.key === "End" ? 75 : getPreferences().split + moves[event.key]);
    save();
  });
  splitter.addEventListener("dblclick", () => { setSplit(50); save(); });
  new ResizeObserver(() => {
    $("#viewport-size").textContent = `${Math.round(preview.clientWidth)} × ${Math.round(preview.clientHeight)}`;
  }).observe(preview);
  return { apply };
}
