var kill_list = [];

/* Function */
function add_list (pattern) {
  var _f = function(pattern) {
    return function() {
      var $stories = $(".uiStreamStory");

      $stories.each(function() {
        var reg = new RegExp(pattern);

        if ( $(this).html().match(reg) ) {
          $(this).fadeOut('slow',function() {
            $(this).remove();  
          });
        }
      });
    };
  };

  kill_list.push( _f(pattern) );
}

function kill(pattern) {
  // Array
  if (typeof pattern == "object" && pattern.length) {
    for (var i = 0; i < pattern.length; i++) {
      add_list(pattern[i]);
    }
  }
  // String
  else {
    add_list(pattern);
  }
  
  for (var i = 0; i < kill_list.length; i++) {
    window.setInterval(kill_list[i], 1000);
  }
}

/* Main */
chrome.extension.sendRequest({ method : "get_fb_list" }, function (response) {
  if (response["fb_list"]) {
    kill(response["fb_list"]);
  }
});
