chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request.method == "get_fb_list") {
    sendResponse({
      fb_list : get_ls("fb_list")
    });
  }
});
