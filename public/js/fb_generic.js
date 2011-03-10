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
