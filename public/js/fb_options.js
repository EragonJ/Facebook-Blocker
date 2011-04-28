/*
 *  Local Storage["fb_list"] 的 Setter
 */
function set_fb_list( user_config ) {
  var fb_list = [];

  if ( user_config ) {
    fb_list = user_config;
  }
  else {
    $(".fb_list").each(function() {
      var v = $(this).val();

      // No blank line here
      if (is_empty(v)) {
        return true;
      }

      fb_list.push( $(this).val() );
    });
  }

  set_ls("fb_list", fb_list);
}

/*
 * 尋找 .fb_list 中的空白 input，可以讓使用者在 TAB 時跳到該 input 去做輸入的動作。
 */
function find_empty_fb_list_index() {
  var index = -1;

  $(".fb_list").each(function(i) {

    var v = $(this).val();
    if (is_empty(v)) {
      index = i;
      return false;
    }
  });

  return index;
}

/*
 *  判斷值是否全部都是空白，擴充於 is_matched function
 */
function is_empty(v) {
  if (is_matched(v, /^\s*$/)) {
    return true;
  }
  return false;
}

/*
 *  包裝 Regex match 的 function
 */
function is_matched(v, regex) {
  if (v.match(regex)) {
    return true;
  }
  return false;
}

function get_focus_input() {
  return $(".fb_list:focus");
}

function ui_input_focus (option) {
  if (option == 0) {
    $(".fb_list").focus();
  }
  else if (option == 1) {
    $(".fb_list:last").focus();
  }

  var $focus_input = get_focus_input();
  
  var $all_black_list = $(".black_list_each");
  var $focus_black_list = $focus_input.parent();
  var $other_black_list = $all_black_list.not($focus_black_list);

  $other_black_list.removeClass("focus");
  $focus_black_list.addClass("focus");
}

/*
 * 透過 HTML5 File API 來讀取使用者的 config，目前並沒有做到檢查其正確性的部分，
 * 只有簡單的 File I/O 會發生問題的警示，以後要記得更新。（目前 Google Chrome 的
 * popup 在這個部份會有問題，當上載視窗出現時會直接關閉整個 popup ，所以暫時不使
 * 用 read_file 的方式，改用 read_config。
 */
function read_file(file) {
  var reader = new FileReader();

  reader.onload = function(e) {

    var config = read_config( e.target.result );

    if (typeof config != 'undefined') {
      set_fb_list( config )
      location.reload();
    }
  };

  reader.onerror = function(e) {
    var error_message = "Error happened when accessing your files !\n" +
                        "please tell me about the details to eragonj@eragonj.me or \n" +
                        "go to Google Chrome Extension \\ search 'Facebook blocker' and leave comments !" +
                        "Thanks for your helps";

    alert(error_message);
  }

  reader.readAsText(file);
}

/*
 *  read_config 處理的 content 是一個 string ，供 read_file 使用。
 */
function read_config( content ) {

  var config;

  try {
    config = JSON.parse( content );
  }
  catch(e) { 
    var error_message = "Your config file is not the same type with Facebook Blocker !\n" +
                        "This situation often happens when modifying your config or upload the wrong file.\n" +
                        "In this way, please try uploading again or type by yourself !";

    alert(error_message);
  }

  return config;
}

/*
 *  Main function
 */
$(document).ready(function() {

  // copy the first black_list_each block
  var $template = $(".black_list_each:eq(0)").clone();
  $(".black_list_each").remove();

  var fb_list = get_ls("fb_list");

  // If we have histories in our localStorage, then we will grab them out and create the DOMs.
  if (typeof fb_list == "object" && fb_list.length) {
     for (var i = 0; i < fb_list.length; i++) {

        var $new_list = $template.clone();
        $new_list.find(".fb_list").val(fb_list[i]);

        $("#black_list").append($new_list);
     }
  }
  // Otherwise, we will create the basic one 
  else {
    var $new_list = $template.clone();
    $("#black_list").append($new_list);
  }

  ui_input_focus(0);

  /* 
   * Event settings below 
   */

  $("a").click(function(e) {
    e.preventDefault();
  });

  $("#add_button").click(function() {

    var new_list = $template.clone();
    $("#black_list").append(new_list);

    ui_input_focus(1);
  }); 

  $(".delete_button").live('click', function(){

    var $list = $(this).parent();

    $list.fadeOut("fast", function() {
      $(this).remove();
      ui_input_focus(1);
    });

  });

  $(".fb_list").live('keydown', option_keydown);

  /*
   * [UI] 送出按鈕的點擊
   */
  $("#done").click(function() {
    set_fb_list();
    window.close();
  });

  /*
   * [UI] 
   */
  $("#upload, #upload_done").click(function() {
    $("#upload_group > *").toggleClass('upload_group_toggle');
    $("#config").focus();
  });

  /*
   * [UI] 當使用者點擊 upload_done 的時候就會載入 config 並設定於 LocalStorage
   */
  $("#upload_done").click(function() {
    var config = $("#config").val();
    set_fb_list( read_config( config ) );
    location.reload();
  });

});
