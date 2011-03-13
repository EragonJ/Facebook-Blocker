/*
 *  fb_list setter
 */
function set_fb_list() {
  var fb_list = [];

  $(".fb_list").each(function() {
    var v = $(this).val();

    // No blank line here
    if (is_empty(v)) {
      return true;
    }

    fb_list.push( $(this).val() );
  });

  set_ls("fb_list", fb_list);
}

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

function is_empty(v) {
  if (is_matched(v, /^\s*$/)) {
    return true;
  }
  return false;
}

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
 *  main
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

  $(".fb_list").live('keydown', function(e) {

    var $focus_input = get_focus_input();

    // If the user pressed TAB without SHIFT
    if ('9'  == e.which && !e.shiftKey) {

      e.preventDefault();
      var index = find_empty_fb_list_index();

      // If there are still some blank inputs left, we will focus on the toppest one.
      if (index != -1) {
        $(".fb_list").eq(index).focus();
      }
      else {
        $("#add_button").trigger('click');
      }
      ui_input_focus();
    }
    // If the user pressed TAB with SHIFT
    else if ('9' == e.which && e.shiftKey) {
      $(".fb_list").each(function(i) {

        e.preventDefault();
        if ($focus_input.equals($(this))) {

          var next_i = ((i - 1) < 0) ? ($(".fb_list").size() - 1) : (i - 1);
          $(".fb_list").eq(next_i).focus();
          ui_input_focus();
        }
      });
    }
    // If the user pressed C with SHIFT
    else if ('67' == e.which && e.shiftKey) {

      e.preventDefault();
      $focus_input.parent().find('.delete_button').trigger('click');
    }
    // If the user pressed ENTER
    else if ('13' == e.which) {

      $("#done").trigger('click'); 
    }
  });

  $("#done").click(function() {

    set_fb_list();
    window.close();
  });
});
