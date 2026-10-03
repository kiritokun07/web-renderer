// 修改此文件后运行 npm run build；扩展只加载本地 vendor/editor.js。
import { basicSetup } from "codemirror";
import { EditorState, Compartment, Transaction } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { indentWithTab, undo, redo } from "@codemirror/commands";
import { openSearchPanel } from "@codemirror/search";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

const phrases = {
  "Find": "查找", "Replace": "替换", "next": "下一个", "previous": "上一个",
  "all": "全选", "match case": "区分大小写", "regexp": "正则", "by word": "整词",
  "replace": "替换", "replace all": "全部替换", "close": "关闭", "Go to line": "跳转到行",
};

export function createCodeEditor(parent, onChange) {
  const sessions = new Map();
  const appearance = new Compartment();
  const locale = new Compartment();
  let activeKey = null;
  let activeTab = "html";
  let theme = "light", language = "zh";
  const baseTheme = EditorView.theme({
    "&": { height: "100%", fontSize: "13px" },
    ".cm-scroller": { overflow: "auto", fontFamily: '"SFMono-Regular", Consolas, monospace', lineHeight: "1.8" },
    ".cm-content": { padding: "16px 0" },
    ".cm-gutters": { border: "none", backgroundColor: "var(--panel)", color: "var(--muted)" },
    "&.cm-focused": { outline: "none" },
    ".cm-panels": { backgroundColor: "var(--surface)", color: "var(--ink)" },
    ".cm-textfield, .cm-button": { background: "var(--panel)", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: "4px" },
    ".cm-search": { fontSize: "11px" },
  });
  const view = new EditorView({ parent });

  function makeState(doc, tab) {
    return EditorState.create({ doc, extensions: [
      basicSetup, keymap.of([indentWithTab]),
      ({ html, css, js: javascript })[tab](),
      baseTheme,
      appearance.of(theme === "dark" ? oneDark : []),
      locale.of(EditorState.phrases.of(language === "zh" ? phrases : {})),
      EditorView.contentAttributes.of({ "aria-label": `${tab.toUpperCase()} code`, spellcheck: "false" }),
      EditorView.updateListener.of(update => {
        if (activeKey) sessions.set(activeKey, { state: update.state, scroll: view.scrollDOM.scrollTop });
        if (update.docChanged) onChange(update.state.doc.toString());
      }),
    ] });
  }

  return {
    get value() { return view.state.doc.toString(); },
    open(project, tab) {
      if (activeKey) sessions.set(activeKey, { state: view.state, scroll: view.scrollDOM.scrollTop });
      activeKey = `${project.id}:${tab}`;
      activeTab = tab;
      const saved = sessions.get(activeKey);
      const reusable = saved?.state.doc.toString() === project[tab];
      view.setState(reusable ? saved.state : makeState(project[tab], tab));
      this.setAppearance(theme, language);
      view.scrollDOM.scrollTop = reusable ? saved.scroll : 0;
    },
    setAppearance(nextTheme, nextLanguage) {
      theme = nextTheme;
      language = nextLanguage;
      if (!activeKey) return;
      view.dispatch({ effects: [appearance.reconfigure(theme === "dark" ? oneDark : []), locale.reconfigure(EditorState.phrases.of(language === "zh" ? phrases : {}))] });
    },
    prune(projects) {
      const ids = new Set(projects.map(project => project.id));
      for (const key of sessions.keys()) if (!ids.has(key.slice(0, key.lastIndexOf(":")))) sessions.delete(key);
    },
    search() { openSearchPanel(view); },
    undo() { undo(view); view.focus(); },
    redo() { redo(view); view.focus(); },
    async format() {
      const key = activeKey, doc = view.state.doc, tab = activeTab;
      const { formatCode } = await import("./formatter-source.js");
      const formatted = await formatCode(doc.toString(), tab);
      // 异步加载/格式化期间切换文件或继续输入，不覆盖新内容。
      if (key !== activeKey || doc !== view.state.doc) return false;
      if (formatted !== doc.toString()) view.dispatch({ changes: { from: 0, to: doc.length, insert: formatted }, annotations: Transaction.userEvent.of("input.format") });
      view.focus();
      return true;
    },
  };
}
