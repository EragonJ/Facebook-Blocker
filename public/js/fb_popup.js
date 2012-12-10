/*
 *  fb_list setter
 */
function set_fb_list() {

    var fb_list = [];

    $(".fb_list").each(function() {

        var eachPattern = $(this).val();
        var v = new Validator( eachPattern );

        // No blank line here
        if ( v.isEmpty() ) {
            return false;
        }

        fb_list.push( eachPattern );
    });

    var o = {};
    o['fb_list'] = fb_list;

    chrome.storage.sync.set(o);
}

/*
 *  This function is used by fb_keyboard.js 
 *  TODO : extract from fb_popup.js later
 */
function find_empty_fb_list_index() {

    var index = -1;

    $(".fb_list").each(function(i) {

        var eachPattern = $(this).val();
        var v = new Validator( eachPattern );

        if ( v.isEmpty() ) {

            index = i;
            return false; // Break the $.each loop
        }
    });

    return index;
}

function get_focus_input() {
    return $(".fb_list:focus");
}

function ui_input_focus(option) {

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

    chrome.storage.sync.get('fb_list', function(o) {
        if ( !chrome.runtime.lastError ) {

            fb_list = o['fb_list'];

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
        }
    })

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

    $("#done").click(function() {

        set_fb_list();
        window.close();
    });

    _($('#done'), 'GLOBAL_DONE');
});
