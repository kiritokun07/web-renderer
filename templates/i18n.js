// 生成自包含的双语模板：静态文案绑定只建立一次，切换时不重建页面。
// t() 收集 HTML 的中英文，t.js() 为交互代码生成运行时翻译调用。
export function bilingualTemplate(language) {
  const initial = language === "en" ? "en" : "zh";
  const pairs = new Map();
  function t(zh, en) {
    pairs.set(JSON.stringify([zh, en]), [zh, en]);
    return initial === "zh" ? zh : en;
  }
  t.js = (zh, en) => `languageUI.t(${JSON.stringify(zh)}, ${JSON.stringify(en)})`;
  function finish(code) {
    return {
      html: `<div id="template-language-controls" role="group" aria-label="Language / 语言"><button id="template-language-toggle" type="button" aria-label="${initial === "zh" ? "Switch to English" : "切换为中文"}">${initial === "zh" ? "EN" : "中文"}</button></div>\n${code.html}`,
      css: `${code.css}\n/* 模板语言切换工具条，为内容预留空间。 */
body { border-top: 44px solid transparent; }
html { scroll-padding-top: 54px; }
#template-language-controls { box-sizing: border-box; position: fixed; z-index: 1000; top: 0; left: 0; right: 0; height: 44px; padding: 7px 16px; display: flex; justify-content: flex-end; align-items: center; background: #fafbf8; border-bottom: 1px solid #dce4d6; color: #356448; font: 12px/1.4 system-ui, sans-serif; }
#template-language-toggle { box-sizing: border-box; width: auto; margin: 0; padding: 4px 12px; min-width: 46px; border: 1px solid #cad8c5; border-radius: 5px; background: white; color: #356448; font: inherit; cursor: pointer; }
#template-language-toggle:hover { background: #edf3e8; }
#template-language-toggle:focus-visible { outline: 2px solid #356448; outline-offset: 2px; }`,
      js: `// 中英文切换：只更新文案，保留输入、事件和页面状态。\nconst languageUI = (${initTemplateLanguage.toString()})(${JSON.stringify(initial)}, ${JSON.stringify([...pairs.values()])});\n\n${code.js}`,
    };
  }
  return { t, finish };
}

function initTemplateLanguage(initial, translations) {
  let language = initial;
  const listeners = new Set();
  const button = document.querySelector("#template-language-toggle");
  const controls = document.querySelector("#template-language-controls");
  const bindings = [];
  const fragments = new Set();
  const column = initial === "zh" ? 0 : 1;
  const targetColumn = () => language === "zh" ? 0 : 1;
  const isConnected = node => node.isConnected;
  const isExcluded = element => !element || controls?.contains(element) || element.closest("script, style, textarea, code, pre");
  const inlinePairs = translations.filter(pair => pair.some(value => /<[a-z][\s\S]*>/i.test(value)));
  const normalize = html => {
    const content = document.createElement("template");
    content.innerHTML = html;
    return content.innerHTML.replace(/\s+/g, "");
  };
  const inline = new Map(inlinePairs.map(pair => [normalize(pair[column]), pair]));
  // 带 br/em 的翻译片段只包含模板内置标记，先绑定整个片段。
  // 页面输入绝不进入 innerHTML；其它文案按文本节点更新。
  for (const element of document.body.querySelectorAll("*")) {
    if (isExcluded(element) || [...fragments].some(parent => parent.contains(element))) continue;
    const pair = inline.get(element.innerHTML.replace(/\s+/g, ""));
    if (!pair) continue;
    fragments.add(element);
    bindings.push(() => { if (isConnected(element)) element.innerHTML = pair[targetColumn()]; });
  }
  const normalizeText = value => value.replace(/\s+/g, " ").trim();
  const plain = new Map(translations.filter(pair => !pair.some(value => /<[a-z][\s\S]*>/i.test(value))).map(pair => [normalizeText(pair[column]), pair]));
  const keys = [...plain.keys()].filter(Boolean).sort((a, b) => b.length - a.length);
  const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = keys.length ? new RegExp(keys.map(key => key.split(" ").map(escape).join("\\s+")).join("|"), "g") : null;
  const translate = value => pattern ? value.replace(pattern, match => plain.get(normalizeText(match))[targetColumn()]) : value;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const target = node;
    if (isExcluded(target.parentElement) || [...fragments].some(parent => parent.contains(target))) continue;
    const original = target.nodeValue;
    if (!keys.some(key => normalizeText(original).includes(key))) continue;
    bindings.push(() => { if (isConnected(target)) target.nodeValue = translate(original); });
  }
  for (const element of document.body.querySelectorAll("*")) {
    if (controls?.contains(element) || element.closest("script, style, code, pre")) continue;
    for (const attribute of ["placeholder", "title", "aria-label"]) {
      const original = element.getAttribute(attribute);
      if (original && keys.some(key => normalizeText(original).includes(key))) {
        bindings.push(() => { if (isConnected(element)) element.setAttribute(attribute, translate(original)); });
      }
    }
  }
  function update() {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    if (button) {
      button.textContent = language === "zh" ? "EN" : "中文";
      button.setAttribute("aria-label", language === "zh" ? "Switch to English" : "切换为中文");
    }
  }
  button?.addEventListener("click", () => {
    language = language === "zh" ? "en" : "zh";
    bindings.forEach(apply => apply());
    update();
    listeners.forEach(listener => listener());
  });
  update();
  return {
    t: (zh, en) => language === "zh" ? zh : en,
    onChange: listener => listeners.add(listener),
    get language() { return language; },
  };
}
