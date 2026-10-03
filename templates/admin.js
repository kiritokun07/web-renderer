import { bilingualTemplate } from "./i18n.js";

export const adminTemplate = {
  id: "admin",
  icon: "▦",
  name: { zh: "管理后台", en: "Admin dashboard" },
  description: { zh: "带登录页、侧边菜单与业务主页面。", en: "Login, navigation and working dashboard pages." },
  code(language) {
    const { t, finish } = bilingualTemplate(language);
    const orders = [
      ["#2026100301", t("林晨", "Alex Lin"), t("专业版订阅", "Pro subscription"), "¥299.00", t("已完成", "Completed"), "success"],
      ["#2026100302", t("陈晓", "Sam Chen"), t("团队版订阅", "Team subscription"), "¥899.00", t("处理中", "Processing"), "pending"],
      ["#2026100303", t("王宁", "Robin Wang"), t("专业版订阅", "Pro subscription"), "¥299.00", t("已完成", "Completed"), "success"],
      ["#2026100304", t("周雨", "Jamie Zhou"), t("入门版订阅", "Starter subscription"), "¥99.00", t("已关闭", "Closed"), "neutral"],
    ];
    const orderTable = `<div class="table-scroll"><table><thead><tr><th>${t("订单编号", "Order")}</th><th>${t("客户", "Customer")}</th><th>${t("商品", "Product")}</th><th>${t("金额", "Amount")}</th><th>${t("状态", "Status")}</th></tr></thead><tbody>${orders.map(([id, name, product, amount, status, style]) => `<tr><td>${id}</td><td>${name}</td><td>${product}</td><td>${amount}</td><td><span class="badge ${style}">${status}</span></td></tr>`).join("")}</tbody></table></div>`;
    const users = [
      ["AL", t("林晨", "Alex Lin"), "alex@example.com", t("管理员", "Administrator"), t("正常", "Active")],
      ["SC", t("陈晓", "Sam Chen"), "sam@example.com", t("编辑", "Editor"), t("正常", "Active")],
      ["RW", t("王宁", "Robin Wang"), "robin@example.com", t("成员", "Member"), t("正常", "Active")],
      ["JZ", t("周雨", "Jamie Zhou"), "jamie@example.com", t("成员", "Member"), t("待激活", "Invited")],
    ];
    return finish({
      html: `<main id="login-page" class="login-page">
  <section class="login-story"><div class="brand"><span class="brand-mark">n</span>NORTH ADMIN</div><div><p class="eyebrow">${t("业务全貌，清晰可见", "A CLEAR VIEW OF YOUR BUSINESS")}</p><h1>${t("每一天，<br>从掌握全局开始。", "A clearer view.<br>A better workday.")}</h1><p>${t("数据、团队与业务，在一个清晰的工作空间里有序运转。", "Keep your data, team and business moving in one thoughtful workspace.")}</p><div class="story-lines" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div><small>${t("管理后台 · 交互模板", "An interactive dashboard template")}</small></section>
  <section class="login-content"><div class="login-card"><span class="login-tag">${t("欢迎回来", "WELCOME BACK")}</span><h2>${t("登录工作台", "Sign in to your workspace")}</h2><p class="muted">${t("欢迎回来，开始今天的工作。", "Welcome back. Let’s get to work.")}</p><form id="login-form"><label for="username">${t("账号", "Username")}</label><input id="username" name="username" autocomplete="username" value="admin" required><label for="password">${t("密码", "Password")}</label><input id="password" name="password" type="password" autocomplete="current-password" value="admin123" required><p id="login-error" class="form-error" role="alert" hidden></p><button id="login-submit" class="primary-button login-button" type="button">${t("登录后台", "Sign in")} →</button></form><div class="demo-account"><span>${t("演示账号", "Demo account")}</span><code>admin / admin123</code></div><p class="login-note">${t("本地交互演示，重新运行预览后回到登录页。", "A local interactive demo. Running the preview again returns to this page.")}</p></div></section>
</main>
<div id="admin-page" class="admin-shell" hidden>
  <aside class="sidebar"><div class="brand"><span class="brand-mark">n</span><span data-workspace-name>NORTH ADMIN</span></div><p class="menu-label">${t("工作空间", "WORKSPACE")}</p><nav aria-label="${t("后台菜单", "Admin navigation")}"><button class="menu-item active" data-page="overview" aria-current="page"><span aria-hidden="true">▦</span>${t("工作台概览", "Overview")}</button><button class="menu-item" data-page="users"><span aria-hidden="true">◉</span>${t("用户管理", "Users")}</button><button class="menu-item" data-page="orders"><span aria-hidden="true">▤</span>${t("订单管理", "Orders")}</button><button class="menu-item" data-page="settings"><span aria-hidden="true">⚙</span>${t("系统设置", "Settings")}</button></nav><div class="sidebar-footer"><span class="online-dot"></span>${t("本地演示工作空间", "Local demo workspace")}<small>${t("版本 1.0", "VERSION 1.0")}</small></div></aside>
  <div class="workspace"><header class="workspace-header"><div class="breadcrumb"><span data-workspace-name>NORTH ADMIN</span><span>/</span><span id="breadcrumb-page">${t("工作台概览", "Overview")}</span></div><div class="account"><span class="avatar">A</span><span>admin</span><button id="logout" type="button">${t("退出登录", "Sign out")}</button></div></header>
    <main class="workspace-main"><div class="page-heading"><div><p class="eyebrow">${t("工作全貌，一目了然", "YOUR WORKSPACE, AT A GLANCE")}</p><h1 id="page-title" tabindex="-1">${t("工作台概览", "Overview")}</h1><p id="page-description" class="muted">${t("欢迎回来，admin。这是你的业务概况。", "Welcome back, admin. Here is your business at a glance.")}</p></div><span class="demo-badge">${t("演示数据", "SAMPLE DATA")}</span></div>
      <section id="page-overview" class="view" aria-label="${t("工作台概览", "Overview")}">
        <div class="stats-grid"><article class="stat-card"><span>${t("总用户数", "Total users")}</span><strong>2,846</strong><small>↗ 12.8% <span>${t("较上月", "vs. last month")}</span></small></article><article class="stat-card"><span>${t("本月订单", "Monthly orders")}</span><strong>1,024</strong><small>↗ 8.2% <span>${t("较上月", "vs. last month")}</span></small></article><article class="stat-card"><span>${t("本月收入", "Monthly revenue")}</span><strong>¥48,620</strong><small>↗ 16.4% <span>${t("较上月", "vs. last month")}</span></small></article><article class="stat-card"><span>${t("转化率", "Conversion rate")}</span><strong>6.82<em>%</em></strong><small>↗ 2.1% <span>${t("较上月", "vs. last month")}</span></small></article></div>
        <div class="dashboard-grid"><article class="panel"><div class="panel-heading"><h2>${t("近 7 天访问趋势", "Visits this week")}</h2><span class="muted">${t("单位：次", "Visits")}</span></div><div class="chart" role="img" aria-label="${t("周一至周日访问量：120、180、150、240、210、320、280", "Monday through Sunday visits: 120, 180, 150, 240, 210, 320, 280")}">${[120, 180, 150, 240, 210, 320, 280].map((value, index) => `<div class="chart-column"><span>${value}</span><i style="height: ${value / 2}px"></i><small>${t(["一", "二", "三", "四", "五", "六", "日"][index], ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"][index])}</small></div>`).join("")}</div></article><article class="panel activity-panel"><div class="panel-heading"><h2>${t("最近动态", "Recent activity")}</h2><span class="activity-tag">${t("动态", "LATEST")}</span></div><ol class="activity"><li><span class="activity-dot"></span><div><strong>${t("新用户完成注册", "A new member joined")}</strong><p>${t("林晨加入了工作空间", "Alex joined the workspace")}</p><small>${t("5 分钟前", "5 minutes ago")}</small></div></li><li><span class="activity-dot"></span><div><strong>${t("专业版订单已完成", "Pro order completed")}</strong><p>#2026100301 · ¥299.00</p><small>${t("18 分钟前", "18 minutes ago")}</small></div></li><li><span class="activity-dot"></span><div><strong>${t("本周数据已更新", "Weekly report updated")}</strong><p>${t("查看最新访问趋势", "The latest traffic data is ready")}</p><small>${t("1 小时前", "1 hour ago")}</small></div></li></ol></article></div>
        <article class="panel"><div class="panel-heading"><h2>${t("最近订单", "Recent orders")}</h2><button id="view-orders" class="text-button" type="button">${t("查看全部", "View all")} →</button></div>${orderTable}</article>
      </section>
      <section id="page-users" class="view" aria-label="${t("用户管理", "Users")}" hidden><article class="panel"><div class="panel-heading"><h2>${t("用户列表", "Team members")}</h2><label class="search-label" for="user-search"><span>${t("搜索", "Search")}</span><input id="user-search" type="search" placeholder="${t("姓名或邮箱", "Name or email")}"></label></div><div class="table-scroll"><table><thead><tr><th>${t("用户", "User")}</th><th>${t("邮箱", "Email")}</th><th>${t("角色", "Role")}</th><th>${t("状态", "Status")}</th></tr></thead><tbody id="user-list">${users.map(([initials, name, email, role, status], index) => `<tr><td><div class="user-name"><span class="avatar">${initials}</span><strong>${name}</strong></div></td><td>${email}</td><td>${role}</td><td><span class="badge ${index === 3 ? "pending" : "success"}">${status}</span></td></tr>`).join("")}</tbody></table></div><p id="users-empty" class="empty-state" role="status" hidden>${t("没有找到匹配的用户。", "No matching users found.")}</p><p id="users-count" class="table-note" role="status">${t("共 4 位用户", "4 users")}</p></article></section>
      <section id="page-orders" class="view" aria-label="${t("订单管理", "Orders")}" hidden><div class="order-summary"><span>${t("本页共 4 笔订单", "4 sample orders")}</span><span>${t("已完成 2 笔 · 处理中 1 笔 · 已关闭 1 笔", "2 completed · 1 processing · 1 closed")}</span></div><article class="panel"><div class="panel-heading"><h2>${t("全部订单", "All orders")}</h2><span class="muted">${t("示例订单明细", "Sample order details")}</span></div>${orderTable}</article></section>
      <section id="page-settings" class="view" aria-label="${t("系统设置", "Settings")}" hidden><article class="panel settings-panel"><div class="panel-heading"><h2>${t("工作空间设置", "Workspace settings")}</h2></div><form id="settings-form" class="settings-form"><label for="workspace-name">${t("工作空间名称", "Workspace name")}</label><input id="workspace-name" value="NORTH ADMIN" maxlength="40" required><p class="field-hint">${t("名称将显示在菜单顶部和页面导航中。", "Shown in the sidebar and page navigation.")}</p><label class="checkbox-label"><input id="notifications" type="checkbox" checked><span>${t("在概览中显示最近动态", "Show recent activity on the overview")}</span></label><button id="settings-save" class="primary-button" type="button">${t("保存设置", "Save settings")}</button><p id="settings-result" role="status"></p></form></article></section>
      <footer class="workspace-footer">NORTH ADMIN · ${t("让工作井井有条", "Make room for good work")}<span>${t("前端演示模板", "Frontend demo template")}</span></footer>
    </main>
  </div>
</div>`,
      css: `* { box-sizing: border-box; }
body { margin: 0; color: #273831; background: #f3f5f3; font: 13px/1.6 system-ui, sans-serif; }
[hidden] { display: none !important; }
button, input { font: inherit; }
button { cursor: pointer; }
a { color: inherit; text-decoration: none; }
button:focus-visible, input:focus-visible { outline: 2px solid #53886b; outline-offset: 3px; }
.muted { color: #87918b; font-size: 12px; }
.eyebrow { font-size: 9px; letter-spacing: 1.7px; color: #83998b; margin: 0 0 10px; }
.brand { display: flex; align-items: center; gap: 10px; font-size: 12px; font-weight: 700; letter-spacing: .7px; overflow-wrap: anywhere; }
.brand-mark { width: 30px; height: 30px; border-radius: 8px; background: #a9c79c; color: #203c30; display: grid; place-items: center; flex-shrink: 0; font: italic 27px Georgia, serif; }
.login-page { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; }
.login-story { display: flex; flex-direction: column; justify-content: space-between; padding: 44px; background: #203c30; color: #f1f5ef; gap: 50px; overflow: hidden; }
.login-story h1 { font-size: clamp(28px, 3.5vw, 46px); line-height: 1.4; letter-spacing: -1px; margin: 14px 0 20px; }
.login-story p:not(.eyebrow) { max-width: 360px; color: #a3b8a9; font-size: 13px; }
.login-story small { color: #91a798; font-size: 10px; }
.story-lines { display: flex; gap: 12px; height: 100px; margin-top: 40px; align-items: end; transform: skewY(-8deg); }
.story-lines i { flex: 1; background: #3e5c43; border-radius: 6px 6px 0 0; height: 35%; }
.story-lines i:nth-child(2n) { height: 55%; background: #6b8963; }.story-lines i:nth-child(3n) { height: 75%; }.story-lines i:last-child { height: 100%; background: #a9c79c; }
.login-content { display: grid; place-items: center; padding: 40px; background: #fafbf8; }
.login-card { width: min(100%, 350px); }
.login-tag { font-size: 9px; letter-spacing: 2px; color: #91a08f; }
.login-card h2 { font-size: 28px; letter-spacing: -.8px; line-height: 1.3; margin: 14px 0 8px; }
#login-form { margin-top: 28px; }
form label:not(.checkbox-label) { display: block; margin: 0 0 7px; font-size: 12px; font-weight: 550; }
input:not([type="checkbox"]) { width: 100%; border: 1px solid #dce4dd; background: white; border-radius: 7px; padding: 11px 13px; color: #273831; }
#login-form input { margin-bottom: 18px; }
.primary-button { background: #356448; border: 1px solid #356448; color: white; padding: 10px 18px; border-radius: 7px; }
.primary-button:hover { background: #284f38; }
.login-button { width: 100%; margin-top: 6px; }
.demo-account { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 10px; margin-top: 24px; padding: 12px; border: 1px dashed #d4dfd2; border-radius: 7px; color: #688363; font-size: 11px; }
.demo-account code { font-size: 12px; }
.login-note { color: #929c93; font-size: 10px; text-align: center; margin-top: 18px; }
.form-error { color: #b5473e; background: #fcf0ed; border-radius: 5px; padding: 9px; margin: 0 0 12px; font-size: 12px; }
.admin-shell { display: flex; min-height: 100vh; }
.sidebar { width: 208px; flex-shrink: 0; background: #203a2f; color: #eaf1e8; padding: 28px 18px; display: flex; flex-direction: column; }
.sidebar .brand { padding: 0 8px; }
.menu-label { color: #91a799; font-size: 9px; letter-spacing: 1.5px; margin: 42px 12px 14px; }
.sidebar nav { display: flex; flex-direction: column; gap: 6px; }
.menu-item { text-align: left; display: flex; gap: 12px; align-items: center; width: 100%; border: 0; border-radius: 7px; background: transparent; color: #a8bdb0; padding: 12px; font-size: 12px; }
.menu-item > span { font-size: 16px; width: 18px; text-align: center; }
.menu-item:hover { background: #2a4638; color: #f5f8f0; }
.menu-item.active { background: #3b5540; color: #e3eec9; }
.sidebar-footer { color: #91a799; font-size: 10px; margin-top: auto; padding: 36px 12px 0; }
.sidebar-footer small { display: block; font-size: 8px; letter-spacing: 1px; margin-top: 8px; }
.online-dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: #a9c79c; margin-right: 6px; }
.workspace { flex: 1; min-width: 0; }
.workspace-header { min-height: 70px; background: white; border-bottom: 1px solid #e3e9e2; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; padding: 16px 30px; }
.breadcrumb { display: flex; flex-wrap: wrap; gap: 12px; font-size: 10px; color: #7b8b80; overflow-wrap: anywhere; }
.breadcrumb > :last-child { color: #3b5344; }
.account { display: flex; align-items: center; gap: 10px; font-size: 11px; }
.avatar { display: inline-grid; place-items: center; flex-shrink: 0; width: 30px; height: 30px; background: #eaf0e5; color: #668055; border-radius: 50%; font-size: 10px; }
#logout, .text-button { border: 0; background: transparent; color: #5b795a; padding: 4px; font-size: 11px; }
.workspace-main { padding: 30px; max-width: 1420px; margin: auto; }
.page-heading { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 26px; }
.page-heading h1 { font-size: 27px; letter-spacing: -.8px; margin: 0; }
.page-heading p:last-child { margin: 7px 0 0; }
.demo-badge { font-size: 9px; color: #87927f; border: 1px solid #dfe5d9; padding: 5px 9px; border-radius: 5px; white-space: nowrap; }
.stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin-bottom: 20px; }
.stat-card { background: white; border: 1px solid #e3e9e2; border-radius: 10px; padding: 20px; }
.stat-card > span { color: #87918b; font-size: 11px; }
.stat-card strong { display: block; font-size: clamp(21px, 2.5vw, 29px); font-weight: 600; letter-spacing: -.5px; margin: 10px 0 8px; }
.stat-card em { font-style: normal; font-size: 16px; }
.stat-card small { color: #598661; font-size: 9px; }
.stat-card small span { color: #929c93; display: inline-block; }
.dashboard-grid { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 20px; }
.dashboard-grid.activity-hidden { grid-template-columns: minmax(0, 1fr); }
.panel { background: white; border: 1px solid #e3e9e2; border-radius: 10px; margin-bottom: 20px; overflow: hidden; min-width: 0; }
.panel-heading { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 14px; padding: 20px; border-bottom: 1px solid #eef1ec; }
.panel-heading h2 { font-size: 13px; font-weight: 600; margin: 0; }
.panel-heading .muted { font-size: 10px; }
.chart { display: flex; align-items: end; justify-content: space-around; gap: 10px; min-height: 244px; padding: 26px 20px 16px; background: repeating-linear-gradient(to top, transparent 0 49px, #f5f7f3 50px 51px); }
.chart-column { display: flex; flex: 1; max-width: 45px; flex-direction: column; align-items: center; gap: 8px; }
.chart-column span, .chart-column small { font-size: 9px; color: #9ca799; }
.chart-column i { width: 100%; background: #a4bc94; border-radius: 4px 4px 0 0; }
.chart-column:nth-child(6) i { background: #547959; }
.activity-tag { color: #7d976e; font-size: 8px; letter-spacing: 1px; }
.activity { margin: 0; padding: 20px; list-style: none; }
.activity li { display: flex; gap: 12px; align-items: start; margin-bottom: 22px; }
.activity li:last-child { margin-bottom: 0; }
.activity-dot { width: 7px; height: 7px; border-radius: 50%; background: #a4bc94; margin-top: 6px; flex-shrink: 0; }
.activity strong { font-weight: 500; font-size: 11px; }
.activity p { font-size: 10px; color: #87918b; margin: 2px 0; }
.activity small { font-size: 9px; color: #a2aba2; }
.table-scroll { overflow-x: auto; }
table { border-collapse: collapse; width: 100%; text-align: left; white-space: nowrap; font-size: 11px; }
th { background: #fafbf8; color: #94a08f; font-weight: 500; font-size: 10px; }
th, td { padding: 15px 20px; border-bottom: 1px solid #eef1ec; }
tr:last-child td { border-bottom: 0; }
.badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 9px; }
.success { background: #edf4e8; color: #6b8955; }.pending { background: #fbf3df; color: #a98b42; }.neutral { background: #eff1f0; color: #929a96; }
.search-label { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #87918b; }
.search-label input { max-width: 220px; padding: 7px 10px; font-size: 11px; min-width: 0; }
.user-name { display: flex; align-items: center; gap: 10px; }.user-name strong { font-weight: 500; }
.empty-state { padding: 28px 20px; text-align: center; color: #94a08f; }
.table-note { margin: 0; padding: 12px 20px; background: #fafbf8; font-size: 10px; color: #94a08f; }
.order-summary { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 18px; font-size: 11px; color: #87918b; }
.settings-panel { max-width: 680px; }
.settings-form { padding: 24px; }
.field-hint { font-size: 10px; color: #94a08f; margin: 8px 0 22px; }
.checkbox-label { display: flex; gap: 8px; align-items: center; margin: 22px 0; font-size: 12px; }
input[type="checkbox"] { accent-color: #356448; }
#settings-result { font-size: 11px; color: #598661; margin-bottom: 0; overflow-wrap: anywhere; }
.workspace-footer { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; padding: 12px 0; font-size: 9px; color: #a0aa9f; }
@media (max-width: 1050px) { .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }.dashboard-grid { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 700px) {
  .login-page { grid-template-columns: minmax(0, 1fr); }
  .login-story { padding: 24px; gap: 20px; }
  .login-story > div, .login-story > small { display: none; }
  .login-content { padding: 36px 24px; }
  .admin-shell { flex-direction: column; }
  .sidebar { width: 100%; padding: 18px 16px; }
  .sidebar nav { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 4px; margin-top: 16px; }
  .menu-item { flex-direction: column; justify-content: center; gap: 3px; padding: 8px 4px; font-size: 10px; text-align: center; }
  .menu-label, .sidebar-footer { display: none; }
  .workspace-header { padding: 14px 18px; gap: 12px; }
  .workspace-main { padding: 24px 16px; }
  .stats-grid { gap: 12px; }
  .stat-card { padding: 16px; }
  .account { margin-left: auto; }
  .page-heading h1 { font-size: 25px; }
}`,
      js: `// 纯前端交互示例：账号校验用于演示页面流程，不是真实身份认证。
// 不使用 localStorage，兼容 Web Renderer 的隔离预览环境。
const loginPage = document.querySelector("#login-page");
const adminPage = document.querySelector("#admin-page");
const loginForm = document.querySelector("#login-form");
const loginError = document.querySelector("#login-error");
let signedIn = false;
let activePage = "overview";
let settingsState = null;
function renderPageCopy() {
  const pages = {
    overview: [${t.js("工作台概览", "Overview")}, ${t.js("欢迎回来，admin。这是你的业务概况。", "Welcome back, admin. Here is your business at a glance.")}],
    users: [${t.js("用户管理", "Users")}, ${t.js("在这里查看团队成员与账号状态。", "Review your team members and account status.")}],
    orders: [${t.js("订单管理", "Orders")}, ${t.js("查看最近订单及处理进度。", "Review recent orders and their progress.")}],
    settings: [${t.js("系统设置", "Settings")}, ${t.js("让工作空间更符合你的使用习惯。", "Make this workspace your own.")}],
  };
  document.querySelector("#page-title").textContent = pages[activePage][0];
  document.querySelector("#breadcrumb-page").textContent = pages[activePage][0];
  document.querySelector("#page-description").textContent = pages[activePage][1];
}
function renderLoginError() {
  loginError.textContent = ${t.js("账号或密码错误，请使用演示账号 admin / admin123。", "Incorrect username or password. Use the demo account admin / admin123.")};
}
function renderSettingsResult() {
  document.querySelector("#settings-result").textContent = settingsState === "invalid" ? ${t.js("请输入工作空间名称。", "Enter a workspace name.")} : settingsState === "saved" ? ${t.js("设置已保存，在本次预览中生效。", "Settings saved for this preview session.")} : "";
}

function showPage(name) {
  if (!signedIn || !["overview", "users", "orders", "settings"].includes(name)) return;
  activePage = name;
  document.querySelectorAll(".view").forEach(view => {
    view.hidden = view.id !== "page-" + name;
  });
  document.querySelectorAll("[data-page]").forEach(button => {
    const active = button.dataset.page === name;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  renderPageCopy();
  document.querySelector("#page-title").focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

// 沙箱不允许原生表单跳转；点击或 Enter 在本地校验并执行交互。
function bindLocalForm(form, button, onSubmit) {
  const submit = () => { if (form.reportValidity()) onSubmit(); };
  button.addEventListener("click", submit);
  form.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.isComposing) {
      event.preventDefault();
      submit();
    }
  });
  form.addEventListener("submit", event => { event.preventDefault(); submit(); });
}

bindLocalForm(loginForm, document.querySelector("#login-submit"), () => {
  const username = document.querySelector("#username").value.trim();
  const password = document.querySelector("#password").value;
  if (username !== "admin" || password !== "admin123") {
    renderLoginError();
    loginError.hidden = false;
    return;
  }
  signedIn = true;
  loginError.hidden = true;
  loginPage.hidden = true;
  adminPage.hidden = false;
  showPage("overview");
});
loginForm.addEventListener("input", () => { loginError.hidden = true; });
document.querySelector("#logout").addEventListener("click", () => {
  signedIn = false;
  adminPage.hidden = true;
  loginPage.hidden = false;
  loginForm.reset();
  loginError.hidden = true;
  document.querySelector("#username").focus();
  window.scrollTo(0, 0);
});
document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.page));
});
document.querySelector("#view-orders").addEventListener("click", () => showPage("orders"));

// 用户列表支持按姓名、邮箱或角色即时搜索。
function filterUsers() {
  const keyword = document.querySelector("#user-search").value.trim().toLowerCase();
  let count = 0;
  document.querySelectorAll("#user-list tr").forEach(row => {
    row.hidden = !row.textContent.toLowerCase().includes(keyword);
    if (!row.hidden) count += 1;
  });
  document.querySelector("#users-empty").hidden = count > 0;
  document.querySelector("#users-count").textContent = languageUI.t("共 " + count + " 位用户", count + (count === 1 ? " user" : " users"));
}
document.querySelector("#user-search").addEventListener("input", filterUsers);

// 设置仅在本次预览中生效，重新运行将恢复模板默认值。
bindLocalForm(document.querySelector("#settings-form"), document.querySelector("#settings-save"), () => {
  const name = document.querySelector("#workspace-name").value.trim();
  if (!name) {
    settingsState = "invalid";
    renderSettingsResult();
    return;
  }
  document.querySelectorAll("[data-workspace-name]").forEach(label => { label.textContent = name; });
  const showActivity = document.querySelector("#notifications").checked;
  document.querySelector(".activity-panel").hidden = !showActivity;
  document.querySelector(".dashboard-grid").classList.toggle("activity-hidden", !showActivity);
  settingsState = "saved";
  renderSettingsResult();
});
languageUI.onChange(() => {
  renderPageCopy();
  if (!loginError.hidden) renderLoginError();
  renderSettingsResult();
  filterUsers();
});`,
    });
  },
};
