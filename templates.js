import { example } from "./example.js";
import { bilingualTemplate } from "./templates/i18n.js";
import { resumeTemplate } from "./templates/resume.js";
import { websiteTemplate } from "./templates/website.js";
import { adminTemplate } from "./templates/admin.js";

const commonCSS = `* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; background: #f0f3eb; color: #2d4034; font-family: system-ui, sans-serif; }
main { width: min(100%, 420px); padding: 32px; border-radius: 20px; background: white; box-shadow: 0 12px 40px #2433260a; }
h1 { margin: 0 0 12px; font-size: 28px; } p { color: #75826f; line-height: 1.8; }
button { padding: 12px 20px; border: 0; border-radius: 8px; background: #356448; color: white; cursor: pointer; font: inherit; }
button:hover { background: #294d37; }
input { width: 100%; padding: 12px; margin: 8px 0 18px; border: 1px solid #dce4d6; border-radius: 8px; font: inherit; }
label { font-size: 14px; } a { color: #356448; }`;

function bilingual(template) {
  return { ...template, code(language) {
    const { t, finish } = bilingualTemplate(language);
    return finish(template.code(t));
  } };
}

export const templates = [
  bilingual({ id: "blank", icon: "＋", name: { zh: "空白画布", en: "Blank canvas" }, description: { zh: "从最简单的 HTML 开始。", en: "Start with a little HTML." }, code: t => ({
    html: `<h1>${t("你好，世界！", "Hello, world!")}</h1><p>${t("开始创造新事物。", "Make something new.")}</p>`,
    css: "body { padding: 32px; font-family: system-ui, sans-serif; }",
    js: "// 在这里添加你的交互。 / Add your interactions here.",
  }) }),
  resumeTemplate,
  websiteTemplate,
  adminTemplate,
  bilingual({ id: "garden", icon: "✳", name: { zh: "灵感花园", en: "Idea garden" }, description: { zh: "带点击交互的入门示例。", en: "A first experiment with click events." }, code: t => ({
    html: `<main class="card">
  <span class="tag">${t("一点小实验", "A LITTLE EXPERIMENT")}</span>
  <div class="plant" aria-hidden="true">✳</div>
  <h1>${t("让想法，慢慢生长。", "Let your ideas grow.")}</h1>
  <p>${t("每一个有趣的网页，<br>都从第一行代码开始。", "Every interesting webpage<br>starts with a single line of code.")}</p>
  <button id="grow">${t("种下一点灵感", "Plant an idea")} <span>↗</span></button>
  <div id="message" aria-live="polite">${t("今天也是创造的好日子。", "A good day to make something.")}</div>
</main>`,
    css: example.css,
    js: `const button = document.querySelector("#grow");
const message = document.querySelector("#message");
let ideas = 0;
function renderMessage() {
  message.textContent = ideas ? languageUI.t("已种下 " + ideas + " 个灵感，继续生长吧。", "Planted " + ideas + (ideas === 1 ? " idea. Keep growing!" : " ideas. Keep growing!")) : ${t.js("今天也是创造的好日子。", "A good day to make something.")};
}
button.addEventListener("click", () => { ideas += 1; renderMessage(); });
languageUI.onChange(renderMessage);`,
  }) }),
  bilingual({ id: "profile", icon: "◉", name: { zh: "个人名片", en: "Profile card" }, description: { zh: "介绍自己与正在做的事情。", en: "Introduce yourself and your work." }, code: t => ({
    html: `<main><div class="avatar">K</div><p class="tag">${t("你好，世界", "HELLO, WORLD")}</p><h1>${t("你好，我是 Kirito", "Hi, I’m Kirito")}</h1><p>${t("开发者，也是生活的观察者。<br>喜欢把小小的想法，做成可以使用的东西。", "Developer and curious observer.<br>Turning small ideas into useful things.")}</p><button id="hello">${t("打个招呼", "Say hello")}</button><p id="reply" aria-live="polite"></p></main>`,
    css: commonCSS + "\n.avatar { width: 64px; height: 64px; display: grid; place-items: center; border-radius: 50%; background: #e7eddf; font-size: 30px; margin-bottom: 24px; }\n.tag { letter-spacing: 3px; font-size: 11px; }",
    js: `let greeted = false;
function renderReply() { document.querySelector("#reply").textContent = greeted ? ${t.js("很高兴认识你！", "Nice to meet you!")} : ""; }
document.querySelector("#hello").addEventListener("click", () => { greeted = true; renderReply(); });
languageUI.onChange(renderReply);`,
  }) }),
  bilingual({ id: "form", icon: "▤", name: { zh: "联系表单", en: "Contact form" }, description: { zh: "练习输入校验与 DOM 交互。", en: "Practice validation and DOM updates." }, code: t => ({
    html: `<main><h1>${t("留下一个想法", "Leave an idea")}</h1><label for="name">${t("你的名字", "Your name")}</label><input id="name" placeholder="Alex" maxlength="60"><label for="idea">${t("想法", "Idea")}</label><input id="idea" maxlength="200"><button id="submit">${t("本地预览", "Preview locally")}</button><p id="result" aria-live="polite"></p></main>`,
    css: commonCSS,
    js: `let invalid = false;
function renderValidation() { if (invalid) document.querySelector("#result").textContent = ${t.js("请填写名字和想法。", "Please enter a name and an idea.")}; }
document.querySelector("#submit").addEventListener("click", () => {
  const name = document.querySelector("#name").value.trim();
  const idea = document.querySelector("#idea").value.trim();
  invalid = !name || !idea;
  if (invalid) { renderValidation(); return; }
  document.querySelector("#result").textContent = name + ": " + idea;
  console.log({ name, idea });
});
languageUI.onChange(renderValidation);`,
  }) }),
  bilingual({ id: "landing", icon: "↗", name: { zh: "产品介绍页", en: "Landing page" }, description: { zh: "响应式布局与卡片排列。", en: "Explore responsive layouts and cards." }, code: t => ({
    html: `<main><p class="tag">${t("为小小的想法而生", "MADE FOR SMALL IDEAS")}</p><h1>${t("让每个想法，都有起点。", "Give every idea a beginning.")}</h1><p>${t("拖动预览尺寸，观察卡片如何重新排列。", "Resize the preview and watch the cards rearrange.")}</p><section class="features"><article><h2>01</h2><p>${t("写下想法", "Write it down")}</p></article><article><h2>02</h2><p>${t("动手尝试", "Try it out")}</p></article><article><h2>03</h2><p>${t("分享成果", "Share the result")}</p></article></section></main>`,
    css: commonCSS + "\nmain { width: min(100%, 900px); }\nh1 { font-size: clamp(28px, 5vw, 48px); }\n.tag { letter-spacing: 2px; font-size: 10px; }\n.features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 32px; }\narticle { padding: 16px; background: #f4f6ef; border-radius: 12px; }\n@media (max-width: 540px) { .features { grid-template-columns: 1fr; } }",
    js: "// 调整预览宽度，观察响应式布局。 / Resize the preview to explore the layout.",
  }) }),
  bilingual({ id: "todo", icon: "✓", name: { zh: "待办清单", en: "Todo list" }, description: { zh: "添加、完成与删除的小练习。", en: "Add, complete and remove tasks." }, code: t => ({
    html: `<main><h1>${t("今天的小目标", "Small goals for today")}</h1><input id="task" placeholder="${t("写下一个小目标", "Add a small goal")}" maxlength="120"><button id="add">${t("添加", "Add")}</button><ul id="list"></ul></main>`,
    css: commonCSS + "\nul { list-style: none; padding: 0; }\nli { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #edf0e8; }\nli input { width: auto; margin: 0; accent-color: #356448; }\nli span { flex: 1; overflow-wrap: anywhere; }\nli input:checked + span { text-decoration: line-through; opacity: .5; }\nli button { background: #edf2e8; color: #356448; padding: 5px 10px; }",
    js: `const input = document.querySelector("#task");
function translateTasks() {
  document.querySelectorAll("#list input").forEach(check => check.setAttribute("aria-label", ${t.js("完成", "Complete")}));
  document.querySelectorAll("#list button").forEach(remove => remove.setAttribute("aria-label", ${t.js("删除", "Remove")}));
}
function addTask() {
  if (!input.value.trim()) return;
  const row = document.createElement("li");
  const check = document.createElement("input");
  check.type = "checkbox";
  const text = document.createElement("span");
  text.textContent = input.value.trim();
  const remove = document.createElement("button");
  remove.textContent = "×";
  remove.addEventListener("click", () => row.remove());
  row.append(check, text, remove);
  document.querySelector("#list").append(row);
  translateTasks();
  console.log("Added:", input.value);
  input.value = "";
}
document.querySelector("#add").addEventListener("click", addTask);
input.addEventListener("keydown", event => { if (event.key === "Enter" && !event.isComposing) addTask(); });
languageUI.onChange(translateTasks);`,
  }) }),
];
