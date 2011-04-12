function option_keydown(e) {

  var $focus_input = get_focus_input();
  var $fb_list = $(".fb_list");

  // with SHIFT
  if (e.shiftKey) {

    // pressed TAB + SHIFT
    if ('9' == e.which) {
      $fb_list.each(function(i) {

        e.preventDefault();
        if ($focus_input.equals($(this))) {

          var next_i = ((i - 1) < 0) ? ($fb_list.size() - 1) : (i - 1);
          $fb_list.eq(next_i).focus();
          ui_input_focus();
        }
      });
    }

    // pressed Delete + SHIFT
    else if ('8' == e.which) {

      e.preventDefault();
      $focus_input.parent().find('.delete_button').trigger('click');
    }

  }
  // without SHIFT
  else {

    // pressed TAB 
    if ('9' == e.which) {
      e.preventDefault();
      var index = find_empty_fb_list_index();

      // If there are still some blank inputs left, we will focus on the toppest one.
      if (index != -1) {
        $fb_list.eq(index).focus();
      }
      else {
        $("#add_button").trigger('click');
      }
      ui_input_focus();
    }

    // pressed ENTER
    else if ('13' == e.which) {

      $("#done").trigger('click'); 
    }
  }
}
