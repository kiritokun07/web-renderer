// 模板预览使用独立沙箱，不替换正在编辑的项目或工作台的预览。
export function createTemplatePreview(t) {
  const dialog = document.querySelector("#template-preview-dialog");
  const stage = document.querySelector("#template-preview-stage");
  const status = document.querySelector("#template-preview-status");
  const error = document.querySelector("#template-preview-error");
  let selected = null;
  let frame = null;
  let runId = 0;
  let timer;

  function dispose() {
    clearTimeout(timer);
    // 移除 iframe，结束预览里创建的定时器、事件和临时登录状态。
    stage.replaceChildren();
    frame = null;
    selected = null;
  }
  function close() {
    dialog.close();
    dispose();
  }
  document.querySelector("#close-template-preview").addEventListener("click", close);
  dialog.addEventListener("close", () => { if (!dialog.open) dispose(); });
  document.querySelector("#use-template-preview").addEventListener("click", () => {
    const use = selected?.use;
    close();
    use?.();
  });
  window.addEventListener("message", event => {
    const data = event.data;
    if (!dialog.open || !frame || event.source !== frame.contentWindow || data?.channel !== "web-renderer") return;
    if (data.type === "ready") {
      frame.contentWindow.postMessage({ channel: "web-renderer", type: "render", runId, code: selected.code }, "*");
      return;
    }
    if (data.runId !== runId) return;
    if (data.type === "rendered") {
      clearTimeout(timer);
      stage.setAttribute("aria-busy", "false");
      if (error.hidden) status.textContent = t("rendered");
    }
    if (data.type === "error" && typeof data.message === "string") {
      clearTimeout(timer);
      stage.setAttribute("aria-busy", "false");
      error.textContent = data.message.slice(0, 2000);
      error.hidden = false;
      status.textContent = t("errorStatus");
    }
  });
  return {
    open(template) {
      dispose();
      selected = template;
      runId += 1;
      document.querySelector("#template-preview-title").textContent = t("templatePreviewTitle", { name: template.name });
      status.textContent = t("running");
      error.hidden = true;
      error.textContent = "";
      stage.setAttribute("aria-busy", "true");
      frame = document.createElement("iframe");
      frame.id = "template-preview-frame";
      frame.title = t("templatePreviewTitle", { name: template.name });
      frame.setAttribute("sandbox", "allow-scripts");
      frame.referrerPolicy = "no-referrer";
      frame.src = "sandbox.html";
      if (!dialog.open) dialog.showModal();
      stage.append(frame);
      timer = setTimeout(() => {
        stage.setAttribute("aria-busy", "false");
        status.textContent = t("previewFailed");
      }, 8000);
    },
  };
}
