import { bilingualTemplate } from "./i18n.js";

export const websiteTemplate = {
  id: "website",
  icon: "◎",
  name: { zh: "企业官网", en: "Company website" },
  description: { zh: "品牌首页、服务案例与联系表单。", en: "A brand home, services, work and contact form." },
  code(language) {
    const { t, finish } = bilingualTemplate(language);
    return finish({
      html: `<header id="top" class="site-header">
  <a class="brand" href="#top"><span class="brand-symbol">n.</span> NORTH STUDIO</a>
  <nav aria-label="${t("网站导航", "Site navigation")}"><a href="#services">${t("服务", "Services")}</a><a href="#work">${t("案例", "Work")}</a><a href="#about">${t("关于", "About")}</a><a class="nav-contact" href="#contact">${t("开始合作", "Let’s talk")} ↗</a></nav>
</header>
<main>
  <section class="hero section">
    <div class="hero-copy"><p class="eyebrow">${t("独立数字工作室", "INDEPENDENT DIGITAL STUDIO")}</p><h1>${t("让品牌的下一步，<em>清晰可见。</em>", "Your next chapter,<br><em>beautifully clear.</em>")}</h1><p class="lead">${t("我们融合策略、设计与技术，为有想法的团队打造有温度的数字体验。", "We bring strategy, design and technology together to create thoughtful digital experiences for ambitious teams.")}</p><div class="hero-actions"><a class="button" href="#work">${t("探索我们的作品", "Explore our work")} ↗</a><span>${t("从一个好问题开始", "It starts with a good question")}</span></div><div class="hero-note"><span class="dot"></span>${t("正在接受新项目合作", "Available for new collaborations")}</div></div>
    <div class="hero-art" aria-hidden="true"><span class="art-label">${t("让想法产生影响 / 01", "IDEAS INTO IMPACT / 01")}</span><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="art-center">n.</div><div class="art-card"><span>${t("策略 + 设计 + 技术", "STRATEGY + DESIGN + CODE")}</span><strong>${t("为你而做，<br>向前一步。", "Made to<br>move you.")}</strong><span>↗</span></div></div>
  </section>
  <section id="services" class="section">
    <div class="section-title"><div><p class="eyebrow">01 / ${t("我们的服务", "WHAT WE DO")}</p><h2>${t("好体验，从全局出发。", "Good experiences start with the whole picture.")}</h2></div><p>${t("从想法到上线，和你一起把每一步做好。", "From the first idea to launch, we make every step count.")}</p></div>
    <div class="service-grid"><article><span class="number">01 / ↗</span><h3>${t("品牌与视觉", "Brand & identity")}</h3><p>${t("明确品牌表达，建立一致且有辨识度的视觉语言。", "A clear point of view and a visual identity people remember.")}</p><small>${t("策略 · 视觉 · 系统", "STRATEGY · IDENTITY · SYSTEM")}</small></article><article><span class="number">02 / ◇</span><h3>${t("网站与体验", "Web & experience")}</h3><p>${t("兼顾美感、易用性与性能，让每一次访问都有价值。", "Thoughtful websites that balance beauty, usability and performance.")}</p><small>${t("体验 · 界面 · 开发", "UX · UI · DEVELOPMENT")}</small></article><article><span class="number">03 / ▤</span><h3>${t("数字化产品", "Digital products")}</h3><p>${t("围绕真实业务，打造更清晰、更高效的产品和工作台。", "Useful products and workspaces built around real business needs.")}</p><small>${t("产品 · 工作台 · 工具", "PRODUCT · DASHBOARD · TOOLS")}</small></article></div>
  </section>
  <section id="work" class="section">
    <div class="section-title"><div><p class="eyebrow">02 / ${t("精选案例", "SELECTED WORK")}</p><h2>${t("用作品，把想法说清楚。", "Let the work tell the story.")}</h2></div><span class="caption">2024 — 2026</span></div>
    <div class="work-grid"><article><div class="work-visual visual-one" aria-hidden="true"><div class="mock-site"><div class="mock-nav">FORMA<span>${t("关于 / 商店", "ABOUT / SHOP")}</span></div><strong>${t("少一点，<br>好一点。", "Less, but<br>better.")}</strong><div class="mock-shape"></div><small>${t("为日常生活而设计", "OBJECTS FOR EVERYDAY LIVING")}</small></div></div><div class="work-caption"><h3>${t("Forma 生活方式品牌", "Forma — everyday objects")}</h3><span>${t("品牌官网 / 设计与开发", "Brand website / Design & development")}</span></div></article><article><div class="work-visual visual-two" aria-hidden="true"><div class="product-card"><span class="mini-label">${t("FLOW / 工作空间", "FLOW / WORKSPACE")}</span><h4>${t("为好工作，<br>留一点空间。", "Make room<br>for great work.")}</h4><div class="mini-chart"><i></i><i></i><i></i><i></i><i></i></div><small>${t("少一点干扰，多一点进展。", "LESS NOISE. MORE PROGRESS.")}</small></div></div><div class="work-caption"><h3>${t("Flow 团队协作平台", "Flow — a calmer workspace")}</h3><span>${t("数字产品 / 体验设计", "Digital product / Experience design")}</span></div></article></div>
  </section>
  <section id="about" class="about section"><div><p class="eyebrow">03 / ${t("关于我们", "ABOUT US")}</p><h2>${t("小团队，<br>认真做每一件事。", "A small team.<br>A careful approach.")}</h2><p>${t("我们相信，好的合作来自坦诚的沟通与共同的目标。以精简的团队、透明的流程，成为你值得信任的数字伙伴。", "The best work starts with open conversations and a shared goal. We are a close-knit team with a transparent process, built to be your digital partner.")}</p></div><div class="about-facts"><div><strong>30+</strong><span>${t("项目交付", "Projects delivered")}</span></div><div><strong>5</strong><span>${t("合作领域", "Industries served")}</span></div><div><strong>100%</strong><span>${t("专注与投入", "Care and commitment")}</span></div></div></section>
  <section id="contact" class="section contact-section"><div><p class="eyebrow">04 / ${t("开始对话", "START A CONVERSATION")}</p><h2>${t("你的下一个想法，<br>值得被认真对待。", "Your next idea<br>deserves a good start.")}</h2><p>hello@example.com</p><p class="caption">${t("这是一个可交互的官网示例，表单提交后会在本页展示确认。", "An interactive website example. The form shows a local confirmation.")}</p></div><form id="contact-form"><label for="contact-name">${t("你的称呼", "Your name")}</label><input id="contact-name" name="name" autocomplete="name" placeholder="${t("怎么称呼你？", "What should we call you?")}" maxlength="60" required><label for="contact-email">${t("联系邮箱", "Email address")}</label><input id="contact-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required><label for="contact-message">${t("聊聊你的想法", "Tell us about your idea")}</label><textarea id="contact-message" name="message" rows="3" maxlength="1000" placeholder="${t("你想做一个怎样的项目？", "What would you like to create?")}" required></textarea><button id="contact-submit" class="button" type="button">${t("提交合作意向", "Preview enquiry")} ↗</button><p id="contact-result" role="status"></p></form></section>
</main>
<footer class="site-footer"><a class="brand" href="#top">NORTH STUDIO</a><span>${t("示例企业官网 · 为好想法而设计", "Sample company website · Designed for good ideas")}</span><a href="#top">${t("回到顶部", "Back to top")} ↑</a></footer>`,
      css: `* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; background: #fafaf6; color: #182f2b; font: 14px/1.75 system-ui, sans-serif; }
a { color: inherit; text-decoration: none; }
button, input, textarea { font: inherit; }
button { cursor: pointer; }
a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible { outline: 2px solid #527a4a; outline-offset: 4px; }
.site-header, .section, .site-footer { width: min(1120px, calc(100% - 80px)); margin: auto; }
.site-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px; padding: 24px 0; border-bottom: 1px solid #dfe5db; }
.brand { display: flex; align-items: center; gap: 10px; font-size: 12px; font-weight: 750; letter-spacing: 1px; }
.brand-symbol { display: grid; place-items: center; width: 34px; height: 34px; background: #24493d; color: #dbed9a; font: italic 28px Georgia, serif; border-radius: 9px; }
nav { display: flex; align-items: center; flex-wrap: wrap; gap: 24px; font-size: 12px; }
.nav-contact { border-bottom: 1px solid #24493d; padding-bottom: 4px; }
.section { padding: 72px 0; }
.hero { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); align-items: center; gap: 50px; }
.eyebrow { font-size: 10px; font-weight: 650; letter-spacing: 2px; color: #678065; margin: 0 0 20px; }
h1 { font-size: clamp(34px, 4.5vw, 58px); line-height: 1.22; letter-spacing: -2px; margin: 0 0 24px; }
h1 em { display: block; font-style: normal; color: #64814f; }
.lead { max-width: 430px; color: #6c7970; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 18px; align-items: center; margin-top: 30px; }
.hero-actions > span { font-size: 10px; color: #768278; }
.button { display: inline-block; background: #24493d; color: white; border: 0; border-radius: 6px; padding: 12px 22px; font-size: 12px; }
.button:hover { background: #33614e; }
.hero-note { display: flex; align-items: center; gap: 8px; color: #768278; font-size: 10px; margin-top: 28px; }
.dot { width: 6px; height: 6px; background: #7e9e5e; border-radius: 50%; }
.hero-art { position: relative; min-height: 370px; overflow: hidden; background: #e6ecdf; border-radius: 100px 12px 12px 12px; }
.art-label { position: absolute; top: 30px; right: 24px; font-size: 8px; letter-spacing: 1.5px; color: #74846e; }
.orbit { position: absolute; width: 260px; height: 260px; border: 1px solid #b7c7a5; border-radius: 50%; left: 50%; top: 40%; transform: translate(-50%, -50%); }
.orbit-two { width: 190px; height: 190px; }
.art-center { position: absolute; top: 35px; width: 100%; text-align: center; font: italic 155px Georgia, serif; color: #55724a; }
.art-card { position: absolute; right: 24px; bottom: 24px; left: 24px; border-radius: 9px; background: #fbfcf5e8; padding: 20px; box-shadow: 0 8px 30px #24493d10; }
.art-card span { display: block; font-size: 8px; letter-spacing: 1.5px; }
.art-card strong { display: block; font-size: 25px; line-height: 1.2; margin-top: 12px; }
.art-card span:last-child { position: absolute; right: 24px; bottom: 20px; font-size: 30px; }
.section-title { display: flex; justify-content: space-between; align-items: end; gap: 40px; margin-bottom: 32px; }
h2 { font-size: clamp(25px, 3vw, 34px); line-height: 1.4; letter-spacing: -.8px; margin: 0; }
.section-title p:last-child:not(.eyebrow) { max-width: 280px; font-size: 12px; color: #6c7970; }
.service-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid #dfe5db; gap: 32px; }
.service-grid article { padding: 30px 0 10px; }
.number { font-size: 11px; color: #81937d; }
h3 { font-size: 18px; margin: 20px 0 10px; }
.service-grid p { color: #6c7970; font-size: 12px; }
.service-grid small { font-size: 8px; letter-spacing: 1px; color: #81937d; }
.work-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px; }
.work-visual { height: 310px; display: grid; place-items: center; padding: 34px; border-radius: 10px; overflow: hidden; }
.visual-one { background: #e6dfd1; }
.visual-two { background: #dce5df; }
.mock-site { width: 100%; height: 100%; background: #f8f6ef; padding: 20px; position: relative; box-shadow: 0 10px 25px #4b473215; overflow: hidden; }
.mock-nav { display: flex; justify-content: space-between; font: bold 9px Georgia, serif; }
.mock-nav span { font: 5px system-ui; }
.mock-site strong { display: block; font: 34px/1.1 Georgia, serif; margin-top: 34px; position: relative; z-index: 1; }
.mock-site small { display: block; font-size: 5px; margin-top: 16px; }
.mock-shape { position: absolute; right: 20px; bottom: 22px; width: 85px; height: 120px; background: #b2ab84; border-radius: 50px 50px 15px 15px; }
.product-card { width: min(100%, 280px); border-radius: 12px; background: #f8fcf9; padding: 24px; box-shadow: 0 10px 25px #24493d15; }
.mini-label { font-size: 7px; color: #70867b; }
h4 { font-size: 24px; line-height: 1.25; margin: 12px 0; }
.mini-chart { display: flex; align-items: end; gap: 10px; height: 54px; }
.mini-chart i { flex: 1; background: #7b9c81; height: 35%; border-radius: 3px 3px 0 0; }
.mini-chart i:nth-child(2) { height: 60%; }.mini-chart i:nth-child(3) { height: 45%; }.mini-chart i:nth-child(4) { height: 80%; }.mini-chart i:nth-child(5) { height: 100%; }
.product-card small { font-size: 6px; color: #70867b; }
.work-caption h3 { font-size: 15px; margin: 14px 0 3px; }
.work-caption span, .caption { font-size: 11px; color: #7e8b80; }
.about { border-top: 1px solid #dfe5db; border-bottom: 1px solid #dfe5db; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
.about p:not(.eyebrow) { color: #6c7970; font-size: 12px; max-width: 470px; }
.about-facts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.about-facts strong { display: block; font-size: 34px; font-weight: 500; }
.about-facts span { font-size: 10px; color: #6c7970; }
.contact-section { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
form { display: flex; flex-direction: column; align-items: start; }
label { font-size: 11px; margin-bottom: 6px; }
input, textarea { width: 100%; border: 1px solid #dfe5db; border-radius: 6px; background: white; padding: 11px; margin-bottom: 18px; color: #24493d; font-size: 12px; }
textarea { resize: vertical; }
#contact-result { color: #3a714b; font-size: 12px; overflow-wrap: anywhere; }
.site-footer { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 20px; padding: 28px 0; border-top: 1px solid #dfe5db; font-size: 10px; color: #7e8b80; }
@media (max-width: 760px) {
  .site-header, .section, .site-footer { width: calc(100% - 40px); }
  .section { padding: 42px 0; }
  .hero, .about, .contact-section { grid-template-columns: minmax(0, 1fr); gap: 32px; }
  .hero-art { min-height: 300px; }
  .service-grid { grid-template-columns: minmax(0, 1fr); gap: 0; }
  .service-grid article { border-bottom: 1px solid #dfe5db; padding-bottom: 24px; }
  .section-title { display: block; }
  .work-grid { grid-template-columns: minmax(0, 1fr); }
  nav { gap: 20px; }
}
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }`,
      js: `// 本地演示：提交后显示确认信息，不发送网络请求。
const form = document.querySelector("#contact-form");
let enquiryState = null;
let enquiryName = "";
function renderEnquiry() {
  const result = document.querySelector("#contact-result");
  result.textContent = enquiryState === "invalid" ? ${t.js("请填写称呼和项目想法。", "Please enter your name and a project idea.")} : enquiryState === "confirmed" ? enquiryName + ${t.js("，你的合作意向已在本页确认。此示例不会发送邮件。", ", your enquiry is confirmed in this preview. This example does not send email.")} : "";
}
function previewEnquiry() {
  if (!form.reportValidity()) return;
  const name = document.querySelector("#contact-name").value.trim();
  const message = document.querySelector("#contact-message").value.trim();
  if (!name || !message) {
    enquiryState = "invalid";
    renderEnquiry();
    return;
  }
  enquiryState = "confirmed";
  enquiryName = name;
  renderEnquiry();
}
languageUI.onChange(renderEnquiry);
// 沙箱不允许原生表单跳转，使用按钮与 Enter 保留本地表单交互。
document.querySelector("#contact-submit").addEventListener("click", previewEnquiry);
form.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.isComposing && event.target.tagName !== "TEXTAREA") {
    event.preventDefault();
    previewEnquiry();
  }
});
form.addEventListener("submit", event => { event.preventDefault(); previewEnquiry(); });
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    document.querySelector(link.getAttribute("href")).scrollIntoView({ block: "start" });
  });
});`,
    });
  },
};
