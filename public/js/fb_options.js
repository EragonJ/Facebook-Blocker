/*
 *  fb_list setter
 */
function set_fb_list() {
  var fb_list = [];

  $(".fb_list").each(function() {
    var v = $(this).val();

    // No blank line here
    if ( v.match(/^\s$/) ) {
      return false;
    }

    fb_list.push( $(this).val() );
  });

  set_ls("fb_list", fb_list);
}

function ui_input_focus () {
  var $all_black_list   = $(".black_list_each");
  var $last_black_list  = $all_black_list.last();
  var $other_black_list = $all_black_list.not(":last");

  $other_black_list.removeClass("focus");
  $last_black_list.addClass("focus");
  $last_black_list.find("input").focus();
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

  ui_input_focus();

  /* 
   * Event settings below 
   */

  $("a").click(function(e) {
    e.preventDefault();
  });

  $("#add_button").click(function() {

    var new_list = $template.clone();
    $("#black_list").append(new_list);

    ui_input_focus();
  }); 

  $(".delete_button").live('click', function(){

    var $list = $(this).parent();

    $list.fadeOut("fast", function() {
      $(this).remove();
      ui_input_focus();
    });

  });

  // if user press enter in input
  $(".fb_list").live('keydown', function(e) {
    if ('13' == e.which) {
      $("#add_button").trigger('click');
    }
  });

  $("#done").click(function() {

    set_fb_list();
    window.close();
  });
});
