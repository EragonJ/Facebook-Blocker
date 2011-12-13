/*
 *  FBBK - a.k.a FaceBook BlocKer
 *
 *      This is the main script that blocks user-defined patterns.
 *
 *      @Author EragonJ<eragonj@eragonj.me>
 */
var FBBK = function() {

    /*
     *  userOptions -
     *      It stores options that user checked on options.html .
     *
     *  @var array
     */
    this.userOptions = [];

    /*
     *  blockPatterns -
     *      It stores patterns be blocked later set on popup.html .
     *
     *  @var array
     */
    this.blockPatterns = [];

    /*
     *  blockFunctions -
     *      It communicates with the background page to get fb_list.
     *
     *  @var array
     */
    this.blockFunctions = [];

    /*
     *  htmlTemplate -
     *      It stores necessary HTML.
     *
     *  @var JSON
     */
    this.htmlTemplate = { 
        'lockBlock' : '<div class="FBBK-lockBlock"></div>',
        'lockUI'    : '<div class="FBBK-lockUI" title="unlock"></div>',
        'lockTips'  : '<div class="FBBK-lockTips"></div>'
    };

};

FBBK.prototype = {

    /*
     *  isUserOptioned -
     *      It will grep out matched option from userOptions.
     *
     *  @param string optionID - optionID is the key stored in userOptions
     *  @return bool true / false - is matched or not
     */
    isUserOptioned : function( optionID ) {
        return ( $.inArray( optionID, this.userOptions) !== -1 ) ? true : false;
    },

    /*
     *  processBlockPatterns - 
     *      It will grep out all blockPatterns and call wrapBlockFunction to make them 
     *      executable functions and call addBlockFunction to push them into a array 
     *      which waits for executing.
     *
     */
    processBlockPatterns : function() {

        var that = this;

        $.each( this.blockPatterns, function(i, pattern) {

            var _f = that.wrapBlockFunction( pattern );
            that.addBlockFunction( _f );
        });
    },

    /*
     *  addBlockFunction -
     *      It will push wrappred functions into blockFunctions array that will be 
     *      executed later by window.setInterval
     *
     *  @param function _f - a wrapped function with user-defined patterns
     */
    addBlockFunction : function( _f ) {

        this.blockFunctions.push( _f );
    },

    /*
     *  wrapBlockFunction -
     *      This is the most important part that blocks user-defined patterns. 
     *
     *  TODO: Comment more about this block function and extract something aweful out.
     *
     *  @param string pattern - a user-defined pattern
     *  @return function _f - a wrapped function that can be executed by window.setInterval
     */
    wrapBlockFunction : function( pattern ) {

        var that = this;
        var _f = function( pattern ) {

            return function() {

                // Support personal timeline, friend's timeline and group timeline ( <LI> elements )
                var $stories = $('.uiStreamStory, .mall_post');

                $stories.each(function() {


                    // this is flag i 
                    var flag = ( that.isUserOptioned('ignoreCaseSensitive') ) ? 'i' : '';

                    var reg = new RegExp( pattern , flag );

                    // We have to check the FBBK-invisible 
                    if ( $(this).html().match( reg ) && !$(this).data('FBBK-invisible') ) {

                        // Facebook uses a <LI> to wrap a <DIV> element
                        $(this).children('.storyContent').fadeOut('slow');

                        $(this).prepend( that.htmlHelper('lockBlock') );

                        $(this).addClass('FBBK-invisible')
                               .data('FBBK-invisible', true);

                        var $lockBlock = $(this).children('.FBBK-lockBlock');
                        $lockBlock.append( that.htmlHelper('lockTips') );

                        if ( that.isUserOptioned( 'enableUILock' ) ) {
                            $lockBlock.append( that.htmlHelper('lockUI') );
                        }

                        $lockBlock.children('.FBBK-lockTips').html('Keyword Detected - <b>' + pattern + '</b>');

                        chrome.extension.sendRequest({ method : 'updateBadgeText' });
                    }
                });
            };

        }( pattern );

        return _f;
    },

    /*
     *  htmlHelper -
     *      It will fetch out the HTML with matched tempalate_key. 
     *
     *  @param string tempalate_key - key to match the HTML
     *  @return string this.htmlTemplate[ tempalate_key ] - matched HTML
     */
    htmlHelper : function( template_key ) {
        return this.htmlTemplate[ template_key ];
    },

    /*
     *  bindUIEvents - 
     *      It collects all UI events.
     *
     */
    bindUIEvents : function() {

        //TODO: add UI Events here
        this.bindUILockClickEvent();
    },

    /*
     *  bindUILockClickEvent -
     *      If a user enables 'enalbeUILock' option, then we have to bind related Click Event for it.
     * 
     */
    bindUILockClickEvent : function() {

        if ( !this.isUserOptioned( 'enableUILock' ) ) {
            return;
        }

        $('div.FBBK-lockUI').live('click', function() {

            var $this = $(this);
            var $parent = $this.parentsUntil('.uiStreamStory, .mall_post').parent(); // jQuery's magic

            var $invisible_div  = $parent.children('.storyContent');
            var $invisible_tips = $parent.children('.FBBK-lockTips'); 

            $invisible_tips.toggle('fast');
            
            $invisible_div.toggle('fast', function(){ 
                $this.toggleClass('FBBK-lockOpenUI');

                var attr_title = $this.attr('title');
                $this.attr('title', (attr_title == 'lock') ? 'unlock' : 'lock');
            });
        });
    },

    /*
     *  exec -
     *      It is the entry point.
     */
    exec : function() {

        //TODO: we can put some initialization parts before preRequest(),
        //      but that must with no relationship between chrome.extension.sendRequest 

        this.preRequest();
    },

    /*
     *  preRequest -
     *      We will interact with chrome.extension.* first to get userOptions and blockPatterns
     *      which are stored in localstorage on background.html . Only when we get these two 
     *      settings successfuly first will us call afterRequest.
     *
     */
    preRequest : function( ) {

        var that = this;

        // Get user options first
        chrome.extension.sendRequest( { method : 'get_user_options' }, function (response) {

            if ( response['userOptions'] ) {
                that.userOptions = response['userOptions'];
            }

            // Get blocked sentences second
            chrome.extension.sendRequest( { method : 'get_fb_list' }, function (response) {

                if ( response['fb_list'] ) {
                    that.blockPatterns = response['fb_list'];
                }

                that.afterRequest();
            });
        });
    },

    /*
     *  afterRequest -
     *      It collects bindUIEvents which sets necessary UI events first and blockFunctions second
     *      then startBlocking in the end.
     */
    afterRequest : function () {

        this.bindUIEvents();
        this.processBlockPatterns();
        this.startBlocking();
    },

    /*
     *  startBlocking - 
     *      It will grep out blockFunctions and call window.setInterval to execute them one by one.
     */
    startBlocking : function() {

        $.each( this.blockFunctions, function( i, _f ) {
            window.setInterval( _f, 1000 );
        });
    },
};

var fbbk = new FBBK();
fbbk.exec();
