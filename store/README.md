# Edge Add-ons 发布

当前已准备商店候选版本 0.2.0，尚未提交审核或上架。代码仓库公开不等于扩展已在商店发布。

## 1. 注册账号（发布者本人完成）

打开 [Edge 开发者入口](https://partner.microsoft.com/dashboard/microsoftedge/public/login)，使用个人 Microsoft 账号登录；没有账号时先创建。也可按微软指引使用 GitHub 登录。若未自动进入 Edge 注册表单，在 **Account settings → Programs → Microsoft Edge → Get started** 开始注册。

个人学习和独立发布可选择 **Individual**；代表已注册公司发布则选择 **Company**。填写真实国家/地区、可用的发布者显示名称和联系信息，阅读协议后自行确认，完成页面要求的验证。**国家/地区和账号类型注册后不可更改**。Edge 扩展计划没有注册费用；不要误选 Windows 应用商店的其他开发者计划。

依据：[微软开发者账号注册说明](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/create-dev-account)（核对日期：2026-10-03）。

如果注册时出现 “Microsoft runs on trust / request was blocked”，保留错误页截图、参考编号、相关 ID、事务 ID（没有显示则注明未显示）和发生时间。该提示不包含具体触发原因，应请微软支持核查。注册未完成、没有工作区时，可使用微软提供的 [无需登录的支持入口](https://partner.microsoft.com/en-us/support?stage=2&topicid=6b52f3cf-3b36-df07-f75b-27aa68bf8a01)，选择对应问题后点击 **Provide issue details**。如果入口仍不可用，可通过 [Edge 扩展官方 Issues](https://github.com/microsoft/MicrosoftEdge-Extensions/issues) 请求账号支持渠道，账号邮箱、联系方式及验证材料只通过私密支持渠道提供。

依据：[Partner Center 账号访问支持](https://learn.microsoft.com/en-us/partner-center/account-settings/unable-to-sign-in)、[Edge 扩展团队联系方式](https://learn.microsoft.com/en-us/microsoft-edge/extensions/contact)。

## 2. 生成并验证安装包

首次准备开发环境：

```bash
npm ci
npx playwright install chromium
```

图标 PNG 和商店宣传图已提交到仓库；修改 `icons/icon.svg` 后用 `npm run assets:store` 重新生成。打包和测试：

```bash
npm run check
npm run package:edge
npm run verify:edge
```

`verify:edge` 要求本机安装 Microsoft Edge，会从 ZIP 解压到临时目录并使用独立临时浏览器配置测试，不访问日常浏览器数据。测试中英文工作台、全部九个模板的双语切换、演示登录、格式化器、控制台、保存恢复、全屏及沙箱隔离。没有 Edge 时可用 `EDGE_TEST_CHANNEL=chromium npm run verify:edge` 验证 Chromium，但该结果不代表 Edge 实测。

产物：

- `dist/web-renderer-edge-0.2.0.zip`：上传给商店的安装包，`manifest.json` 在 ZIP 根目录。
- `dist/web-renderer-edge-0.2.0.zip.sha256`：安装包校验值。
- `dist/edge-unpacked/`：同一 ZIP 的解压内容，可在 `edge://extensions` 加载测试。
- `dist/edge-verification.json`：通过测试后生成的版本、浏览器和 SHA-256 记录。

打包使用运行文件白名单，不包含 Git、测试、开发依赖、商店图片或个人配置。商店资料必须另行上传，不能把 GitHub 的 **Download ZIP** 源码压缩包当成扩展包。

使用实际 Edge 扩展生成中英文截图：

```bash
npm run screenshots:store
```

图片输出到 `store/assets/zh/` 与 `store/assets/en/`。每种语言包含工作台、模板库、后台演示与夜间控制台，均为真实运行截图，无后期添加的功能。

## 3. 填写并提交

账号注册完成后，进入 **Edge → Create new extension**，上传上面的扩展 ZIP。按后台字段填写，文案可直接复制自 [`listing.json`](listing.json)：

| 项目 | 当前资料 |
| --- | --- |
| 可见性 | Public；市场范围由发布者选择 |
| 类别 | 选择后台实际提供的开发工具相关类别 |
| 网站 / 支持 | `website` / `supportUrl` |
| 单一用途 | `singlePurpose` |
| 权限说明 | 无额外浏览器权限、无网站权限；解释见 `permissionJustification` |
| 远程代码 | No；本地沙箱执行用户编写的代码，详细说明见 `remoteCodeExplanation` |
| 用户数据 | 维护者不收集用户数据；根据当前后台定义逐项确认，说明见 `dataUsage` |
| 隐私政策 | `privacyPolicyUrl`，提交前确认未登录也能打开 |
| 中英文长描述 | `locales.zh_CN.description` / `locales.en.description` |
| 商店 Logo | `assets/logo-300.png`，300 × 300 |
| 小宣传图 | `assets/tile-zh-440x280.png` / `assets/tile-en-440x280.png` |
| 截图 | 对应语言目录下的四张 1280 × 800 PNG |
| 审核测试说明 | `certificationNotes`（已解释 admin/admin123 为本地演示） |

两个语言条目都需要完成；名称和短描述来自 `_locales` 和 manifest，修改后需要重新打包。检查商店预览、隐私声明与实际功能一致后，点击后台的 **Publish / Submit** 送审。提交并不代表审核通过，后续状态、补充材料和审核结果以 Partner Center 为准。

依据：[微软发布流程及素材规格](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension)、[开发者政策](https://learn.microsoft.com/en-us/legal/microsoft-edge/extensions/developer-policies)（核对日期：2026-10-03）。

## 后续更新

更新 `manifest.json` 与 `package.json` 中的版本号，并同步锁文件、此指南、商店文案及隐私说明的适用版本。执行构建、验证；界面改变时重新截图。保持同一商店产品上传新包，不重复创建产品。

从本地开发版切到商店版时，扩展 ID 和存储空间可能不同。先在旧版导出 JSON，再在商店版导入；不要依赖本地开发版数据自动迁移。
