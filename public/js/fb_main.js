var FBBK = function() {

    this.userOptions = [];

    this.blockPatterns = [];

    // communicate with the background page to get the fb_list
    this.blockFunctions = [];

    this.htmlTemplate = { 
        'lockBlock' : '<div class="FBBK-lockBlock"></div>',
        'lockUI'    : '<div class="FBBK-lockUI" title="unlock"></div>',
        'lockTips'  : '<div class="FBBK-lockTips"></div>'
    };

};

FBBK.prototype = {

    isUserOptioned : function( key ) {
        return ( $.inArray( key, this.userOptions) !== -1 ) ? true : false;
    },

    processBlockPatterns : function() {

        var patterns = this.blockPatterns;

        // Array
        if ( $.isArray( patterns ) ) {
            for (var i = 0; i < patterns.length; i++) {
                this.addBlockFunction( patterns[i] );
            }
        }
        // String
        else {
            this.addBlockFunction( patterns );
        }
    },

    addBlockFunction : function( pattern ) {

        var _f = this.wrapBlockFunction( pattern );

        this.blockFunctions.push( _f );
    },

    wrapBlockFunction : function( pattern ) {

        var that = this;
        var _f = function( pattern ) {

            return function() {

                // Support personal timeline, friend's timeline and group timeline ( <LI> elements )
                var $stories = $('.uiStreamStory, .mall_post');

                $stories.each(function() {
                    var reg = new RegExp( pattern );

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

    htmlHelper : function( arg ) {
        return this.htmlTemplate[ arg ];
    },

    bindUIEvents : function() {
        //TODO: add more UI parts here
        this.bindUILockClickEvent();
    },

    bindUILockClickEvent : function() {

        // TODO: Fix this with option.html 
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

    exec : function() {

        //TODO: we can put some initialization parts before preRequest(),
        //      but that must with no relationship between chrome.extension.sendRequest 

        this.preRequest();
    },

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

    afterRequest : function () {
        this.bindUIEvents();
        this.processBlockPatterns();
        this.startBlocking();
    },

    startBlocking : function() {
        for (var i = 0; i < this.blockFunctions.length; i++) {
            window.setInterval( this.blockFunctions[i], 1000 );
        }
    },
};

var fbbk = new FBBK();
fbbk.exec();
