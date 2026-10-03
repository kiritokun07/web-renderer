// 该文件只在 manifest 声明的 sandbox 页面运行，无法访问扩展 API。
// 每次渲染都替换内层 iframe，清理上次代码创建的定时器和事件。
(() => {
  let frame;
  let currentRunId;
  const send = data => parent.postMessage({ channel: "web-renderer", ...data }, "*");

  function reportErrors(runId) {
    let sent = 0;
    const send = data => {
      if (sent++ >= 300) return;
      parent.postMessage({ channel: "web-renderer", runId, ...data }, "*");
      if (sent === 300) parent.postMessage({ channel: "web-renderer", runId, type: "console", level: "warn", message: "Console limit reached (300 messages per run)." }, "*");
    };
    const stringify = (value, depth = 0, seen = new WeakSet()) => {
      try {
        if (typeof value === "string") return value.slice(0, 2000);
        if (typeof value === "function") return `[Function ${value.name || "anonymous"}]`;
        if (value === null || typeof value !== "object") return String(value);
        if (value instanceof Error) return `${value.name}: ${value.message}`;
        if (value instanceof Element) return `<${value.tagName.toLowerCase()}${value.id ? ` id="${value.id}"` : ""}>`;
        if (seen.has(value)) return "[Circular]";
        if (depth >= 3) return Array.isArray(value) ? "[…]" : "{…}";
        seen.add(value);
        const descriptors = Object.getOwnPropertyDescriptors(value);
        const keys = Object.keys(descriptors).filter(key => descriptors[key].enumerable).slice(0, 20);
        const parts = keys.map(key => {
          const item = descriptors[key];
          const text = "value" in item ? stringify(item.value, depth + 1, seen) : "[Getter]";
          return Array.isArray(value) ? text : `${key}: ${text}`;
        });
        seen.delete(value);
        return Array.isArray(value) ? `[${parts.join(", ")}]` : `{${parts.join(", ")}}`;
      } catch { return "[Unserializable]"; }
    };
    for (const level of ["log", "info", "debug", "warn", "error"]) {
      const original = console[level].bind(console);
      console[level] = (...args) => {
        original(...args);
        if (sent < 300) send({ type: "console", level, message: args.slice(0, 20).map(value => stringify(value)).join(" ").slice(0, 8000) });
      };
    }
    const originalClear = console.clear.bind(console);
    console.clear = () => { originalClear(); send({ type: "console-clear" }); };
    const originalAssert = console.assert.bind(console);
    console.assert = (condition, ...args) => {
      originalAssert(condition, ...args);
      if (!condition) send({ type: "console", level: "error", message: `Assertion failed: ${args.map(value => stringify(value)).join(" ")}`.slice(0, 8000) });
    };
    // 运行异常不受普通日志数量限制，仍可提示错误。
    const report = message => parent.postMessage({ channel: "web-renderer", type: "error", runId, message: String(message).slice(0, 2000) }, "*");
    window.addEventListener("error", event => report(`${event.message} (line ${event.lineno})`));
    window.addEventListener("unhandledrejection", event => report(event.reason?.message ?? event.reason));
    document.addEventListener("DOMContentLoaded", () => {
      parent.postMessage({ channel: "web-renderer", type: "rendered", runId }, "*");
    }, { once: true });
  }

  function buildDocument(code, runId) {
    const doc = new DOMParser().parseFromString(code.html, "text/html");
    // 用 textContent 组装用户输入；绝不写入工作台的 DOM。
    const charset = doc.createElement("meta");
    charset.setAttribute("charset", "utf-8");
    const bridge = doc.createElement("script");
    bridge.textContent = `(${reportErrors.toString()})(${JSON.stringify(runId)});`;
    doc.head.prepend(charset, bridge);
    if (!doc.querySelector('meta[name="viewport"]')) {
      const viewport = doc.createElement("meta");
      viewport.name = "viewport";
      viewport.content = "width=device-width, initial-scale=1";
      doc.head.append(viewport);
    }
    const style = doc.createElement("style");
    style.textContent = code.css.replace(/<\/style/gi, "<\\/style");
    doc.head.append(style);
    const script = doc.createElement("script");
    script.textContent = code.js.replace(/<\/script/gi, "<\\/script");
    doc.body.append(script);
    return `<!doctype html>\n${doc.documentElement.outerHTML}`;
  }

  window.addEventListener("message", event => {
    const data = event.data;
    if (data?.channel !== "web-renderer") return;
    if (event.source === parent && data.type === "render" && Number.isSafeInteger(data.runId)) {
      if (!data.code || !["html", "css", "js"].every(key => typeof data.code[key] === "string")) return;
      currentRunId = data.runId;
      const next = document.createElement("iframe");
      next.title = "Rendered page";
      next.setAttribute("sandbox", "allow-scripts");
      next.referrerPolicy = "no-referrer";
      next.srcdoc = buildDocument(data.code, currentRunId);
      frame = next;
      document.body.replaceChildren(next);
    } else if (frame && event.source === frame.contentWindow && data.runId === currentRunId) {
      if (data.type === "error" && typeof data.message === "string") send({ type: "error", runId: currentRunId, message: data.message.slice(0, 2000) });
      if (data.type === "rendered") send({ type: "rendered", runId: currentRunId });
      if (data.type === "console" && ["log", "info", "debug", "warn", "error"].includes(data.level) && typeof data.message === "string") send({ type: "console", runId: currentRunId, level: data.level, message: data.message.slice(0, 8000) });
      if (data.type === "console-clear") send({ type: "console-clear", runId: currentRunId });
    }
  });
  send({ type: "ready" });
})();
