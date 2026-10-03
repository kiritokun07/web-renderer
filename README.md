# Web Renderer · 网页渲染工具

一个用来学习浏览器扩展开发的最小原型：粘贴 HTML / CSS / JavaScript，在右侧运行网页，把不同实验保存为项目。

原生 HTML、CSS、JavaScript 工作台，使用本地打包的 CodeMirror 编辑器和 Prettier 格式化器。Chrome / Edge 扩展和本地网页版使用同一套页面。已包含 `vendor/` 构建产物，可直接加载使用，不依赖 CDN。

## 获取代码

```bash
git clone https://github.com/kiritokun07/web-renderer.git
cd web-renderer
```

也可以在仓库页面选择 **Code → Download ZIP**，解压后使用项目文件夹。

## 先安装到浏览器（不需要 npm）

1. Chrome 地址栏输入 `chrome://extensions`；Edge 输入 `edge://extensions`。
2. 打开右上角的「开发者模式」。
3. 点击「加载已解压的扩展程序」，选择刚下载的项目根目录（包含 `manifest.json` 的 `web-renderer` 文件夹）。
4. 从工具栏的拼图图标找到 **Web Renderer**，固定后点击它，工作台会在新标签页打开。原型使用浏览器默认扩展图标。
5. 点击示例里的「种下一点灵感」，确认 JavaScript 生效。切到 HTML 修改标题，停顿约半秒，右侧自动更新。

修改 `manifest.json` 或 `background.js` 后，回扩展管理页点刷新，再重新打开工作台。只修改工作台页面时，刷新工作台即可。

安装流程参考：[Chrome 官方入门](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world)、[Edge 本地加载扩展](https://learn.microsoft.com/en-us/microsoft-edge/extensions/getting-started/extension-sideloading)。

## 也可以先体验本地网页版

安装 Node.js 20 或更新版本，然后在项目目录运行：

```bash
npm start
```

打开 <http://127.0.0.1:4173>。这一项不需要 `npm install`，只使用 Node 自带的静态服务器。不要双击 `index.html`；直接使用 `file://` 会影响模块加载。

本地地址、未来线上域名、Chrome 扩展和 Edge 扩展的存储相互独立。用「导出全部 → 导入 JSON」迁移。

## 可以做什么

- 编辑 HTML、CSS、JavaScript；HTML 支持片段和带内联样式、脚本的完整文档。
- CodeMirror 编辑器提供语法高亮、补全、括号配对、自动缩进、代码折叠、查找替换和撤销/重做。项目与 HTML/CSS/JS 标签分别保留本次会话的编辑记录；「格式化」使用本地 Prettier。
- 自动运行（停顿 550 毫秒），或关闭自动运行后点按钮 / 按 `⌘ Enter`、`Ctrl Enter`。
- 新建、重命名、切换、删除项目；输入后立即保存到 `localStorage`。
- 左侧搜索同时匹配项目名称与代码内容，不区分大小写；搜索不会改变当前项目。
- 模板库将空白画布放在第一位，随后提供个人简历、企业官网、管理后台、灵感花园、个人名片、联系表单、产品介绍页和待办清单。点击卡片创建新项目，不覆盖已有内容。
- 每张模板卡片右上角有「预览」按钮，可在独立弹窗中体验交互；预览不创建项目，也不改变当前代码或工作台的运行状态。点击「使用此模板」后才创建项目；返回模板库或按 Esc 关闭预览后，临时运行状态会清理。
- 全部九个模板都自带右上角 `EN / 中文` 切换按钮，预览弹窗、创建后的项目和导出的代码均可使用。初始语言跟随创建时的工作台语言；切换会翻译页面、菜单、占位提示与交互反馈，保留输入、待办状态和后台登录/菜单状态。重新运行预览会恢复代码中设定的初始语言。
- 完全未改动的旧内置模板会自动升级为双语版本；已编辑过的项目保留原样，需要时可从模板库重新创建双语副本。
- 个人简历提供经历、项目、技能与联系方式；企业官网提供服务、案例、关于与本地联系表单。三个新增模板均支持中英文与窄屏布局。
- 管理后台默认预填演示账号 `admin / admin123`，点击登录或按 Enter 后进入概览。包含用户管理（姓名、邮箱、角色搜索）、订单管理、系统设置和退出登录；设置可修改工作空间名称及概览动态的显示。登录和数据均为前端演示，重新运行预览会恢复默认，不连接真实认证服务。
- 初始示例、新建项目和模板的 HTML/CSS/JS 已在构建时预先格式化；旧内置项目只有在全部代码仍与原始示例一致时才会同步格式化，用户修改过的项目保持原样。
- 导出全部项目为 JSON；导入时追加为副本，保留原有项目。
- 工作台中英切换并记住偏好；模板内部的语言按钮单独控制该预览，用户的代码和项目名称保持原样。
- 预览支持桌面、375 × 667 手机和自定义尺寸（宽高各 240–2560 px）；「旋转」交换宽高。超出预览区域时可滚动，尺寸表示真实 CSS 像素，不自动压缩。
- 布局支持左右或上下分栏；拖动中间分隔线调整比例，双击恢复均分。分隔线聚焦后可用方向键调整，Home/End 调整到边界。窄屏自动改为上下排列。
- 预览底部「控制台」显示 `console.log/info/debug/warn/error/assert` 和未捕获异常；支持级别筛选、清空及保留日志。错误会自动展开控制台。只保留最新 200 条，单次运行最多转发 300 条普通日志；对象以有限深度的字符串快照展示，不是可展开的实时对象。
- 拖动控制台顶部分隔条调整高度，双击恢复默认；聚焦分隔条后也可用上下方向键调整。高度会在刷新后恢复，并随预览空间自动限制，保留可见的预览区域。
- 右上角切换日间 / 夜间模式，仅调整工作台与编辑器配色；预览保留用户代码的样式。主题、布局、分栏比例和预览尺寸会在刷新后恢复。
- 右上角「工作台全屏」放大整个工作台；预览工具栏的「全屏预览」只放大预览区域。点击「退出全屏」或按 `Esc` 返回，代码与运行中的预览保持不变。采用浏览器原生 [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)；若嵌入窗口不支持，请在 Chrome / Edge 标签页中打开。

默认示例完全离线运行。项目存储在当前浏览器，清除浏览器数据、删除扩展可能丢失数据，请用 JSON 文件备份。最多 100 个项目，单次 JSON 备份和已保存数据不超过 4 MB；浏览器自己的存储配额可能更早耗尽，失败时页面会明确显示「保存失败」。此时内存中的修改仍可导出。

## 按这个顺序读代码

| 文件 | 你会学到什么 |
| --- | --- |
| `manifest.json` | 扩展入口、Manifest V3、工具栏按钮、后台脚本和沙箱声明 |
| `background.js` | 监听工具栏点击，用 `chrome.tabs.create` 打开自己的页面 |
| `index.html` / `styles.css` / `theme.css` | 普通网页就是扩展的工作台；布局、表单和代码输入框 |
| `app.js` | DOM 事件、当前项目状态、自动保存、导入导出和运行预览 |
| `editor-source.js` / `formatter-source.js` | CodeMirror 会话状态、主题切换、查找替换与 Prettier 格式化 |
| `console-panel.js` | 沙箱日志展示、级别筛选、保留与清空 |
| `layout.js` | 可拖动分栏、键盘调整、自定义预览尺寸 |
| `templates.js` / `templates/` | 九个可编辑的项目模板，以及简历、官网、后台的独立模板文件 |
| `template-preview.js` | 独立模板预览弹窗、沙箱生命周期及使用模板入口 |
| `templates/i18n.js` | 双语模板生成、文案绑定与语言切换；生成的项目代码无外部依赖 |
| `legacy-template-code.js` | 旧内置代码快照，用于精确识别并升级未修改的模板 |
| `builtin-code.js` / `scripts/format-builtins.mjs` | 预先格式化的内置代码，以及构建时生成它的脚本 |
| `model.js` | 项目数据结构、校验、导入版本和持久化格式 |
| `sandbox.html` / `sandbox.js` | iframe 隔离、`postMessage` 通信、拼装可执行网页 |
| `i18n.js` / `_locales/` | 工作台语言切换，以及浏览器中的扩展名称翻译 |
| `example.js` | 原始入门示例与花园样式；新版双语示例由 `templates.js` 生成 |
| `scripts/build.mjs` / `vendor/` | 将编辑器依赖打包为本地脚本，保留第三方许可证 |

一次点击的调用链：

```text
浏览器工具栏图标
  → background.js
  → index.html + app.js
  → postMessage({ html, css, js })
  → sandbox.html + sandbox.js
  → 创建新的 iframe.srcdoc
  → 显示网页 / 返回脚本错误
```

扩展页面的默认安全策略禁止直接执行粘贴的内联脚本，所以将预览放进 Manifest 声明的独立沙箱。沙箱没有扩展 API，也不能读取工作台的 DOM 或本地项目；消息接收端核对 `event.source`。网页版另外通过 iframe 的 `sandbox="allow-scripts"` 保留隔离。参考：[Chrome 沙箱文档](https://developer.chrome.com/docs/extensions/reference/manifest/sandbox)、[内容安全策略](https://developer.chrome.com/docs/extensions/reference/manifest/content-security-policy)。

## 第一个学习练习（约 10 分钟）

1. 改示例 HTML 的标题，观察预览更新。
2. 在 CSS 页把按钮的 `background` 改成喜欢的颜色。
3. 在 JS 页把 `ideas += 1` 改成 `ideas += 2`，再点击预览里的按钮。
4. 刷新工作台，确认改动还在；新建第二个项目，再切回第一个。
5. 导出 JSON，打开看看项目结构，然后导入验证出现副本。
6. 打开 `background.js`，对照上面的调用链理解：插件只是多了浏览器提供的入口和 API。

## 原型边界

当前用于本地开发和学习，尚未发布在线站点或商店，也未创建 GitHub 远程仓库。

- 用户的预览项目不支持 npm 安装、JSX/TypeScript 编译、多文件路径或远程 JavaScript/CDN 库。
- 沙箱中的用户代码不能访问 `localStorage`、扩展 API、顶层页面，不能弹窗、下载或提交表单；普通按钮和 DOM 交互可运行。手机模式只模拟视口尺寸，不模拟触摸、设备像素比或真实手机设备。
- 预览中引用的 HTTPS 图片或样式可能联网；工具本身不提供云端同步。
- 不可信代码仍可能包含死循环或消耗大量资源；当前没有执行超时终止能力。仅运行理解的代码，必要时关闭预览标签页。
- 撤销记录保留在当前标签页的内存里；刷新后恢复代码内容，但不恢复撤销历史。来自其他工作台的代码变更会重建对应文件的编辑记录。
- 控制台暂不提供断点、变量展开、源码映射或点击错误跳转；错误行号可能包含预览包装代码。
- 多标签页会接收已保存的变更，但不提供同时编辑的冲突合并；建议一个工作台编辑。

先学会修改、安装、调试这一版，再逐步补图标、隐私说明、商店截图与发布流程。

## 验证开发改动

直接加载扩展无需安装依赖。要修改编辑器源码或重新构建依赖，运行：

```bash
npm ci
npm run build
```

`app.js`、样式等普通文件可直接修改并刷新；修改 `editor-source.js`、`formatter-source.js`、`example.js`、`templates.js`、`templates/` 或 `model.js` 中的新项目默认代码后，需要运行 `npm run build`，更新编辑器资源与预格式化的 `builtin-code.js`。编辑器依赖来自 [CodeMirror](https://codemirror.net/docs/ref/)，格式化器采用 [Prettier 的浏览器用法](https://prettier.io/docs/browser)；许可证汇总在 `vendor/THIRD-PARTY-LICENSES.txt`。

运行自动化测试：

```bash
npm install
npx playwright install chromium
npm run build
npm run check
npm test
```

浏览器测试覆盖原有预览和数据保存流程，以及编辑器撤销/格式化/替换、控制台筛选和日志上限、模板和搜索、日夜主题、预览布局、全屏与旧版数据读取。另在真实 Chromium 扩展环境中验证本地编辑器、动态加载的格式化器、控制台和全屏功能。

测试使用独立临时浏览器配置，不修改你日常浏览器的扩展或数据。Chrome / Edge 桌面版仍建议按上方步骤手动安装确认。

如果本地保存内容损坏，应用会保留原始内容并停止覆盖。先导出当前可见内容；需要恢复原始数据时，在开发者工具的 Application → Local Storage 中复制 `web-renderer.workspace.v1` 的原始值，再决定是否清除该键。

## English

A local-first HTML/CSS/JavaScript playground and Manifest V3 browser extension with bundled CodeMirror and Prettier. Load this folder as an unpacked extension in Chrome or Edge, then click its toolbar icon. Or run `npm start` and open <http://127.0.0.1:4173>. The included `vendor/` assets work offline without installing dependencies; run `npm ci && npm run build` when changing the editor source.

Includes syntax highlighting, completion, formatting, per-file undo history, find/replace, a filtered console, project search, nine templates, resizable layouts, custom viewport sizes and light/dark themes. New templates include a resume, a company website and an admin dashboard. The dashboard prefills `admin / admin123` for a local demo login, with overview, users, orders, settings and sign-out. Workspace preferences persist; project content remains compatible with v0.1 backups.

Projects are stored locally in each browser/origin. Export JSON backups to move them; importing appends copies. Switch the UI language with the top-right button. Preview code runs in an isolated sandbox without extension APIs or workspace storage. This prototype does not include remote JavaScript libraries, npm/JSX/TypeScript compilation, hosting, or store publication.
