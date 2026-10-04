# Web Renderer · 网页渲染工具

[English](README.md) | **简体中文**

在浏览器中编辑 HTML、CSS 和 JavaScript，实时预览网页效果，快速制作页面原型。支持 Chrome / Edge 扩展和本地网页版，项目保存在当前浏览器中。

[**从 Microsoft Edge 商店安装 →**](https://microsoftedge.microsoft.com/addons/detail/jmlcddodoomgbdkflcclldioiphngaaa) · [下载安装包](https://github.com/kiritokun07/web-renderer/releases/latest)

## 功能介绍

- **代码编辑**：语法高亮、自动补全、格式化、查找替换和撤销重做。
- **实时预览**：自动或手动运行，支持桌面、手机及自定义尺寸，可调整分栏布局并进入全屏。
- **调试控制台**：查看日志和运行错误，支持筛选、清空及拖动调整高度。
- **模板库**：内置空白画布、个人简历、企业官网、管理后台等九个模板，支持先预览再使用，所有模板均可切换中英文。
- **项目管理**：新建、重命名、搜索和自动保存，支持 JSON 导入导出。
- **界面设置**：中英文切换、日间 / 夜间模式，提供 GitHub 仓库入口及 Star 数显示。

## 安装

### 从 Edge 商店安装

打开 [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/jmlcddodoomgbdkflcclldioiphngaaa)，点击「获取」并完成安装。在浏览器工具栏中找到并固定 **Web Renderer**，点击图标即可打开工作台。

### 手动安装到 Chrome / Edge

1. 从 [Releases](https://github.com/kiritokun07/web-renderer/releases/latest) 下载扩展运行包（`web-renderer-edge-*.zip`）并解压。该运行包也可在 Chrome 中手动加载。
2. 打开扩展管理页面：Chrome 使用 `chrome://extensions`，Edge 使用 `edge://extensions`。
3. 开启「开发者模式」或「开发人员模式」，点击「加载已解压的扩展程序」。
4. 选择解压后包含 `manifest.json` 的文件夹，安装后点击扩展图标打开工作台。

手动安装无需安装 Node.js 或 npm 依赖。

## 本地运行

安装 Node.js 20 或更新版本，然后执行：

```bash
git clone https://github.com/kiritokun07/web-renderer.git
cd web-renderer
npm start
```

浏览器打开 <http://127.0.0.1:4173> 即可使用。仓库已包含运行所需资源，无需先执行 `npm install`。请通过本地服务访问，不要直接双击 `index.html`。

## 使用方法

1. 点击「新建项目」，或打开「模板库」，预览并选择需要的模板。
2. 在 HTML、CSS、JS 标签中编辑或粘贴代码，预览区域会自动更新。也可关闭自动运行，点击「运行预览」或按 `⌘ Enter` / `Ctrl Enter` 手动运行。
3. 按需切换预览尺寸、拖动分隔线调整布局，或进入全屏查看效果；点击退出按钮或按 `Esc` 退出全屏。
4. 打开预览下方的控制台查看日志与错误，使用「格式化」及「查找 / 替换」整理代码。
5. 项目会自动保存到当前浏览器。使用「导出全部」备份 JSON，或通过「导入 JSON」迁移到其他浏览器；导入会追加副本。

管理后台模板自带演示账号 `admin / admin123`，点击登录后可体验菜单和后台页面，仅用于前端演示。

项目不会自动同步到其他浏览器或设备；本地网页版与扩展的数据也相互独立。清除浏览器数据或卸载扩展前，请先导出备份。预览支持原生 HTML、CSS 和 JavaScript，暂不支持 npm 依赖、JSX / TypeScript 编译及远程 JavaScript 库。

隐私说明见 [PRIVACY.md](PRIVACY.md)。
