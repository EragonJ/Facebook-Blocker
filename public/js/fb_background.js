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
    if ( request.method === 'updateBadgeText' ) {
        chrome.browserAction.setBadgeText({ text : String(++badgeCount)});
    }
});

var src = get_ls('userOptions', true);

if ( isUserOptioned('enableUnseen', src) ) {

    chrome.webRequest.onBeforeRequest.addListener(function( detail ) { 
        return {
            cancel : true
        };
    }
    , { urls : ["*://*.facebook.com/*change_read_status*"] }
    , ["blocking"]
    );

}
