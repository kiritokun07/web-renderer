import { bilingualTemplate } from "./i18n.js";

export const resumeTemplate = {
  id: "resume",
  icon: "▧",
  name: { zh: "个人简历", en: "Resume" },
  description: { zh: "工作经历、项目作品与技能清单。", en: "Experience, selected projects and skills." },
  code(language) {
    const { t, finish } = bilingualTemplate(language);
    return finish({
      html: `<div class="resume">
  <header class="topbar">
    <a class="wordmark" href="#top">LC<span> / ${t("个人简历", "PORTFOLIO")}</span></a>
    <nav aria-label="${t("简历导航", "Resume navigation")}">
      <a href="#experience">${t("经历", "Experience")}</a>
      <a href="#projects">${t("项目", "Projects")}</a>
      <button id="contact-toggle" type="button" aria-expanded="false" aria-controls="contact">${t("联系我", "Contact")}</button>
    </nav>
  </header>
  <main id="top">
    <section class="intro">
      <div>
        <p class="eyebrow">${t("用设计思考，以细节打磨。", "DESIGN MINDED. DETAIL DRIVEN.")}</p>
        <h1>${t("林晨", "Alex Lin")}<span>${t("把想法，做成好用的产品。", "Making ideas work beautifully.")}</span></h1>
        <p class="summary">${t("前端工程师，专注于清晰的界面与流畅的交互。擅长将复杂需求拆解为简单、可靠的网页体验。", "Frontend engineer focused on clear interfaces and thoughtful interactions. I turn complex requirements into simple, reliable web experiences.")}</p>
        <div class="intro-meta"><span>${t("杭州 · 中国", "Hangzhou, China")}</span><span>${t("3 年开发经验", "3 years of experience")}</span><span class="available">${t("开放工作机会", "Open to opportunities")}</span></div>
      </div>
      <div class="portrait" aria-hidden="true"><span>LC</span><small>${t("用心创造。", "BUILD WITH CARE.")}</small></div>
    </section>
    <section id="contact" class="contact" aria-label="${t("联系方式", "Contact details")}" hidden>
      <strong>${t("期待一起做点有意思的事。", "Let’s build something thoughtful.")}</strong>
      <p>alex@example.com · ${t("可远程协作", "Available for remote work")}</p>
    </section>
    <div class="resume-grid">
      <aside class="details">
        <section><p class="eyebrow">01 / ${t("专业技能", "SKILLS")}</p><div class="skills"><span>HTML / CSS</span><span>JavaScript</span><span>TypeScript</span><span>React</span><span>Vue</span><span>Git</span></div></section>
        <section><p class="eyebrow">02 / ${t("教育背景", "EDUCATION")}</p><h2>${t("计算机科学与技术", "Computer Science")}</h2><p>${t("示例大学 · 本科", "Example University · BSc")}</p><small>2019 — 2023</small></section>
        <section><p class="eyebrow">03 / ${t("工作方式", "HOW I WORK")}</p><p>${t("重视沟通与细节，喜欢持续迭代。相信好的代码，也应该容易被下一个人读懂。", "Clear communication, careful details and steady iteration. Good code should be easy for the next person to understand.")}</p></section>
      </aside>
      <div class="career">
        <section id="experience">
          <div class="section-heading"><h2>${t("工作经历", "Experience")}</h2><span>2023 — ${t("至今", "PRESENT")}</span></div>
          <article class="experience"><div class="job-heading"><h3>${t("前端开发工程师", "Frontend Engineer")}</h3><small>2024 — ${t("至今", "Present")}</small></div><p class="company">${t("某某科技 · 产品研发团队", "Example Technology · Product Team")}</p><ul><li>${t("负责业务工作台与组件库，统一 12 个业务页面的交互与视觉规范。", "Built a business workspace and shared components across 12 product screens.")}</li><li>${t("通过代码拆分与资源优化，将核心页面首屏加载时间缩短 35%。", "Reduced initial page load time by 35% through code splitting and asset optimization.")}</li><li>${t("与设计、后端协作完成从需求评审到上线的完整交付。", "Collaborated with designers and backend engineers from discovery to release.")}</li></ul></article>
          <article class="experience"><div class="job-heading"><h3>${t("前端开发实习生", "Frontend Intern")}</h3><small>2023 — 2024</small></div><p class="company">${t("创意数字工作室", "Creative Digital Studio")}</p><ul><li>${t("参与企业官网开发，适配桌面、平板与手机端。", "Developed company websites for desktop, tablet and mobile.")}</li><li>${t("维护页面组件与自动化测试，持续改善无障碍体验。", "Maintained UI components and automated tests, improving accessibility.")}</li></ul></article>
        </section>
        <section id="projects">
          <div class="section-heading"><h2>${t("精选项目", "Selected projects")}</h2><span>${t("精选作品", "SELECTED WORK")}</span></div>
          <article class="project"><span class="project-number">01</span><div><h3>${t("轻量任务协作平台", "A lightweight team workspace")}</h3><p>${t("从零搭建任务看板、筛选与成员管理，让团队进度一目了然。", "A task board with filters and member management that makes team progress easy to follow.")}</p><small>React · TypeScript · CSS Grid</small></div></article>
          <article class="project"><span class="project-number">02</span><div><h3>${t("网页代码实验室", "A browser code playground")}</h3><p>${t("支持实时预览、代码编辑与本地项目管理的学习工具。", "A learning tool for live previews, code editing and local project management.")}</p><small>JavaScript · Web APIs · Chrome Extension</small></div></article>
        </section>
      </div>
    </div>
  </main>
  <footer>${t("示例简历 · 替换为你的真实经历", "Sample resume · Replace with your own experience")}<a href="#top">${t("回到顶部", "Back to top")} ↑</a></footer>
</div>`,
      css: `* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; background: #f4f3ef; color: #222c36; font: 14px/1.75 system-ui, sans-serif; }
[hidden] { display: none !important; }
a { color: inherit; text-decoration: none; }
button { font: inherit; cursor: pointer; }
a:focus-visible, button:focus-visible { outline: 2px solid #956a25; outline-offset: 5px; }
.resume { max-width: 1080px; margin: auto; padding: 0 48px; }
.topbar { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 28px 0; border-bottom: 1px solid #dadbd5; }
.wordmark { font-weight: 800; letter-spacing: -1px; font-size: 22px; }
.wordmark span { font-size: 10px; letter-spacing: 2px; font-weight: 500; margin-left: 10px; }
nav { display: flex; align-items: center; gap: 24px; font-size: 12px; }
nav button { border: 1px solid #222c36; background: #222c36; color: white; padding: 8px 15px; border-radius: 5px; }
.intro { padding: 64px 0 44px; display: grid; grid-template-columns: minmax(0, 1fr) 170px; gap: 40px; align-items: center; }
.eyebrow { color: #91682d; font-size: 10px; letter-spacing: 1.5px; font-weight: 650; margin: 0 0 16px; }
h1 { font-size: clamp(36px, 6vw, 60px); letter-spacing: -2px; line-height: 1.2; margin: 0 0 20px; }
h1 span { display: block; font-size: clamp(18px, 2.5vw, 24px); letter-spacing: -.5px; font-weight: 450; margin-top: 16px; }
.summary { max-width: 600px; color: #667078; }
.intro-meta { display: flex; flex-wrap: wrap; gap: 8px 20px; font-size: 11px; color: #667078; margin-top: 24px; }
.available { color: #3f7154; }
.available::before { content: "●"; margin-right: 6px; }
.portrait { aspect-ratio: 4 / 5; border-radius: 80px 80px 12px 12px; background: #e6e2d7; display: flex; flex-direction: column; justify-content: center; align-items: center; border: 8px solid #eeece4; }
.portrait span { font: italic 62px Georgia, serif; color: #7a725e; }
.portrait small { font-size: 7px; letter-spacing: 1px; margin-top: 14px; }
.contact { border-left: 3px solid #91682d; background: #eae6dc; padding: 18px 24px; margin-bottom: 28px; overflow-wrap: anywhere; }
.contact p { margin: 4px 0 0; }
.resume-grid { display: grid; grid-template-columns: 210px minmax(0, 1fr); gap: 48px; border-top: 1px solid #dadbd5; padding-top: 36px; }
.details section { margin-bottom: 32px; }
.details h2 { font-size: 14px; margin-bottom: 3px; }
.details p:not(.eyebrow) { font-size: 12px; color: #667078; margin: 4px 0; }
.skills { display: flex; gap: 7px; flex-wrap: wrap; }
.skills span { border: 1px solid #d8dad3; border-radius: 4px; padding: 4px 9px; font-size: 11px; }
.section-heading { display: flex; justify-content: space-between; align-items: center; gap: 16px; border-bottom: 1px solid #dadbd5; padding-bottom: 12px; }
.section-heading h2 { margin: 0; font-size: 20px; }
.section-heading span, small { color: #7c8589; font-size: 10px; }
.job-heading { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; align-items: center; }
h3 { margin: 0; font-size: 15px; }
.experience { padding: 22px 0; }
.company { font-size: 12px; color: #91682d; margin: 3px 0 10px; }
ul { padding-left: 18px; margin: 0; color: #667078; font-size: 12px; }
li + li { margin-top: 6px; }
#projects { margin-top: 20px; }
.project { display: flex; gap: 20px; padding: 24px 0; border-bottom: 1px solid #e0e1db; }
.project-number { color: #91682d; font: 22px Georgia, serif; }
.project p { color: #667078; font-size: 12px; margin: 7px 0; }
footer { display: flex; justify-content: space-between; gap: 20px; padding: 36px 0; margin-top: 24px; color: #7c8589; font-size: 10px; }
@media (max-width: 640px) {
  .resume { padding: 0 24px; }
  .topbar { flex-wrap: wrap; padding: 20px 0; }
  nav { gap: 20px; }
  .intro { grid-template-columns: minmax(0, 1fr); padding: 36px 0; }
  .portrait { display: none; }
  .resume-grid { grid-template-columns: minmax(0, 1fr); gap: 12px; }
  .details { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
  .details section:last-child { grid-column: 1 / -1; }
  .details section { margin-bottom: 12px; }
  footer { flex-wrap: wrap; }
}
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }`,
      js: `// 显示联系方式；导航只滚动当前预览，不打开新页面。
const contactButton = document.querySelector("#contact-toggle");
const contact = document.querySelector("#contact");
contactButton.addEventListener("click", () => {
  contact.hidden = !contact.hidden;
  contactButton.setAttribute("aria-expanded", String(!contact.hidden));
  if (!contact.hidden) contact.scrollIntoView({ block: "center" });
});
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    document.querySelector(link.getAttribute("href")).scrollIntoView({ block: "start" });
  });
});`,
    });
  },
};
