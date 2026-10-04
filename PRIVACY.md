# Web Renderer 隐私说明 / Privacy Policy

生效日期 / Effective date: 2026-10-04

Web Renderer 由 GitHub 用户 [kiritokun07](https://github.com/kiritokun07) 维护，是用于编辑和预览 HTML、CSS、JavaScript 的浏览器扩展。此说明适用于仓库发布的 0.2.1 版本。

## 中文

### 本地保存的数据

扩展在当前浏览器的本地存储中保存项目名称、HTML/CSS/JavaScript 代码、工作台语言和显示偏好，以便下次打开时继续编辑。代码可能包含你自行输入的个人信息，请只在项目中放入需要处理的内容。运行日志只在当前页面内存中保留。

维护者不接收、不上传、不出售这些项目或日志。扩展不包含分析统计、广告、遥测、账户注册或云端同步，也不读取其他标签页、浏览历史或 Cookie。扩展未申请网站访问权限或额外浏览器权限。

### 预览和网络请求

编辑器、格式化器和内置模板全部随扩展安装，默认示例可离线运行。用户代码在独立沙箱中预览，不能访问工作台数据、其他项目或扩展 API。远程 JavaScript 脚本受内容安全策略限制，未作为功能提供。

如果你在自己的代码中引用外部图片、样式、字体、链接或发起网络请求，浏览器仍可能连接这些第三方服务，并向其发送 IP 地址以及请求中包含的数据。网络是否成功取决于浏览器的安全策略和跨域限制。这些请求由你运行的代码决定，不会经过维护者的服务器；第三方如何处理数据适用其自身隐私政策。

GitHub 入口会向 `api.github.com` 请求此公开仓库的 Star 数，并将计数及获取时间缓存 6 小时。请求不包含项目、代码或日志，不发送登录凭据或 Cookie；GitHub 仍会收到连接所需的 IP 地址等网络信息。网络不可用时使用缓存或显示 Star 入口，编辑功能不受影响。点击仓库链接会在新标签页打开 GitHub，其数据处理适用 [GitHub 隐私政策](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)。

### 导入、导出和删除

只有你选择导入的 JSON 文件会被读取，并在本地处理。导出会将项目保存成设备上的 JSON 文件，不会自动上传。删除项目会移除应用中保存的相应项目；清除扩展数据或卸载扩展可能移除全部项目和偏好。你自行导出的备份文件需要自行删除。建议卸载、重装或切换安装方式前先导出备份。

### 联系和更新

可通过 [GitHub Issues](https://github.com/kiritokun07/web-renderer/issues) 联系维护者。Issues 是公开渠道，请勿提交密码、密钥或含个人信息的项目；你在那里主动发送的内容由 GitHub 按其政策处理。功能或数据处理方式变化时，会更新本说明及生效日期。

## English

Web Renderer is maintained by [kiritokun07](https://github.com/kiritokun07). This policy covers version 0.2.1 distributed from this repository.

### Local data

Project names, HTML/CSS/JavaScript code, language and display preferences are stored in the current browser's local storage so you can continue editing later. Your code may contain personal information that you choose to enter. Console logs are retained only in the current page's memory.

The maintainer does not receive, upload or sell projects or logs. The extension includes no analytics, advertising, telemetry, account registration or cloud sync. It does not read other tabs, browsing history or cookies, and requests no host or additional browser permissions.

### Previews and network access

The editor, formatter and built-in templates are bundled locally. Default examples work offline. User code runs in a separate sandbox without access to workspace data, other projects or extension APIs. Remote JavaScript loading is restricted by Content Security Policy and is not a supported feature.

If your code references external images, styles, fonts or links, or initiates network requests, your browser may contact third parties and send your IP address and data included in those requests. Browser security and cross-origin restrictions determine which requests succeed. Such requests originate from the code you run and do not pass through the maintainer's servers. Third parties' own privacy policies apply to their handling of that data.

The GitHub link requests this public repository's star count from `api.github.com` and caches the count and retrieval time for six hours. Requests contain no projects, code or logs and send no login credentials or cookies. GitHub receives network information such as your IP address needed for the connection. Offline, the badge shows cached data or a Star link without affecting editing. Clicking the link opens GitHub in a new tab, subject to [GitHub's privacy policy](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).

### Import, export and deletion

Only JSON files you select for import are read, and they are processed locally. Export saves a JSON backup on your device; it does not automatically upload it. Deleting a project removes its stored entry in the app. Clearing extension data or uninstalling may remove all projects and preferences. You must delete exported backup files separately. Export a backup before uninstalling, reinstalling or changing installation methods.

### Contact and changes

Contact the maintainer through [GitHub Issues](https://github.com/kiritokun07/web-renderer/issues). Issues are public: do not post passwords, keys or projects containing personal information. Information you voluntarily send there is handled by GitHub under its policies. This policy and its effective date will be updated when functionality or data handling changes.
