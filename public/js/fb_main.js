var kill_list = [];

/* Function */
function add_list (pattern) {
    var _f = function(pattern) {
        return function() {

            // Support personal timeline, friend's timeline and group timeline ( <LI> elements )
            var $stories = $(".uiStreamStory, .mall_post");

            $stories.each(function() {
                var reg = new RegExp(pattern);

                // We have to check the FBBK-invisible 
                if ( $(this).html().match(reg) && !$(this).data('FBBK-invisible') ) {

                    // Facebook uses a <LI> to wrap a <DIV> element
                    $(this).children(':first-child').fadeOut('slow');

                    $(this).addClass('FBBK-invisible')
                                 .data('FBBK-invisible',true)
                                 .append(FBBK.html_helper('invisible-toggle-button'))
                                 .append(FBBK.html_helper('invisible-toggle-tips'));

                    $(this).children('.FBBK-invisible-toggle-tips').html('Keyword Detected - <b>' + pattern + '</b>');

                    // Tell the background.html to update the badgeText
                    chrome.extension.sendRequest({ method : "get_blocked_message" });
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
function main() {

    // communicate with the background page to get the fb_list
    chrome.extension.sendRequest({ method : "get_fb_list" }, function (response) {
        if (response["fb_list"]) {
            kill(response["fb_list"]);
        }
    });

    // UI part
    $("div.FBBK-invisible-toggle-button").live('click', function() {

        var $_this = $(this);
        var $_parent = $_this.parent();
        var $invisible_div  = $_parent.children(':first-child');
        var $invisible_tips = $_parent.children('.FBBK-invisible-toggle-tips'); 

        $invisible_tips.toggle('fast');
        
        $invisible_div.toggle('fast', function(){ 
            $_this.toggleClass('FBBK-invisible-after-toggle');

            var attr_title = $_this.attr('title');
            $_this.attr('title', (attr_title == 'lock') ? 'unlock' : 'lock');
        });

    });

};

main();
