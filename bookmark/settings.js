// 设置页面的JavaScript逻辑
const SETTINGS_KEYS = {
  SEARCH_ENABLED: "MAPLE_SEARCH_ENABLED",
  TIPS_ENABLED: "MAPLE_TIPS_ENABLED",
};

// 获取DOM元素
const searchEnabledCheckbox = document.getElementById("searchEnabled");
const tipsEnabledCheckbox = document.getElementById("tipsEnabled");
const backBtn = document.getElementById("backBtn");

// 国际化支持
const browserLanguage = navigator.language.startsWith("zh") ? "zh" : "en";
const isZh = browserLanguage === "zh";

// 设置页面文本
const texts = {
  title: isZh ? "设置" : "Settings",
  backBtn: isZh ? "← 返回" : "← Back",
  searchFeatureTitle: isZh ? "启用搜索功能" : "Search Functionality",
  searchFeatureDesc: isZh
    ? "开启后可以使用搜索框搜索书签，关闭后将隐藏搜索相关功能"
    : "Enable search box to quickly find bookmarks. When disabled, all search features will be hidden.",
  tipsFeatureTitle: isZh ? "显示悬停提示" : "Hover Tooltips",
  tipsFeatureDesc: isZh
    ? "鼠标悬停在书签上时显示完整标题，关闭后将不显示悬停提示"
    : "Display full bookmark titles when hovering. Turn off to disable all tooltip notifications.",
  versionText: "Maple Bookmarks v1.10",
};

// 应用国际化文本
function applyI18n() {
  document.getElementById("title").textContent = texts.title;
  document.getElementById("backBtn").textContent = texts.backBtn;
  document.getElementById("searchFeatureTitle").textContent = texts.searchFeatureTitle;
  document.getElementById("searchFeatureDesc").textContent = texts.searchFeatureDesc;
  document.getElementById("tipsFeatureTitle").textContent = texts.tipsFeatureTitle;
  document.getElementById("tipsFeatureDesc").textContent = texts.tipsFeatureDesc;
  document.getElementById("versionText").textContent = texts.versionText;
}

// 立即应用国际化，避免文本闪烁
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applyI18n);
} else {
  applyI18n();
}

// 加载设置
function loadSettings() {
  // 默认搜索功能是关闭的
  const searchEnabled = localStorage.getItem(SETTINGS_KEYS.SEARCH_ENABLED) === "true";
  searchEnabledCheckbox.checked = searchEnabled;

  // 默认 tips 功能是开启的
  const tipsEnabled = localStorage.getItem(SETTINGS_KEYS.TIPS_ENABLED) !== "false";
  tipsEnabledCheckbox.checked = tipsEnabled;
}

// 保存设置
function saveSettings() {
  localStorage.setItem(SETTINGS_KEYS.SEARCH_ENABLED, searchEnabledCheckbox.checked.toString());
  localStorage.setItem(SETTINGS_KEYS.TIPS_ENABLED, tipsEnabledCheckbox.checked.toString());

  // 发送消息给popup页面，通知设置已更改
  if (typeof chrome !== "undefined" && chrome.runtime) {
    chrome.runtime
      .sendMessage({
        action: "settingsChanged",
        searchEnabled: searchEnabledCheckbox.checked,
        tipsEnabled: tipsEnabledCheckbox.checked,
      })
      .catch(() => {
        // 忽略错误，可能popup没有打开
      });
  }
}

// 返回到主页面
function goBack() {
  window.close();
}

// 初始化设置
function initializeSettings() {
  applyI18n();
  loadSettings();
}

// 事件监听器
searchEnabledCheckbox.addEventListener("change", saveSettings);
tipsEnabledCheckbox.addEventListener("change", saveSettings);
backBtn.addEventListener("click", goBack);

// 初始化
document.addEventListener("DOMContentLoaded", initializeSettings);

// 为了兼容直接打开设置页面的情况
window.addEventListener("load", initializeSettings);
