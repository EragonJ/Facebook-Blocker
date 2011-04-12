/*
 *  Generic localStorage Getter
 */
function get_ls(which) {
  var ls = localStorage[which];

  if (ls) {
    return ls.split(",");
  }
}

/*
 *  Generic localStorage Setter
 */
function set_ls(which, value) {
  localStorage[which] = value;
}

/*
 *  Global variables
 */
var FBBK = window.FBBK || {};

FBBK.html_helper = function(arg) {
  var map = {
    'invisible-toggle-button' : '<div class="FBBK-invisible-toggle-button" title="unlock"></div>',
    'invisible-toggle-tips'   : '<div class="FBBK-invisible-toggle-tips"></div>'
  };

  return map[arg];
};
