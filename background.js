// 点击工具栏图标，打开完整工作台。创建标签页不需要 tabs 权限。
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});
