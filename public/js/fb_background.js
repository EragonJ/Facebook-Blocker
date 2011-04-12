var badgeCount = 0;

// If the tab is updated / refreshed ( There are some problems when the page refreshed )
chrome.tabs.onUpdated.addListener(function(tabId, ChangeInfo, tab) {
  if (ChangeInfo.status == "complete") {
    badgeCount = 0;
  }
});

// Remove the badgeText when closing tabs
chrome.tabs.onRemoved.addListener(function(tabID, removeInfo) {
  badgeCount = 0;
  chrome.browserAction.setBadgeText({ text : '' });
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request.method == "get_fb_list") {
    sendResponse({
      fb_list : get_ls("fb_list")
    });
  }
  else if (request.method == "get_blocked_message") {
    chrome.browserAction.setBadgeText({ text : String(++badgeCount)});
  }
});

