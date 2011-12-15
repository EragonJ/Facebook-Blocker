(function() {

    var userOptions;

    var isUserOptioned = function( optionID ) {
            return ( $.inArray( optionID, userOptions) !== -1 ) ? true : false;
    };

    chrome.extension.sendRequest( { method : 'get_user_options' }, function (response) {

        if ( response['userOptions'] ) {
            userOptions = response['userOptions'];
        }

        /*
         *  This is a workaround to make users won't feel the lag because of insufficient supports on 
         *  content_script > run_at feature. In order to make users happy, I have to hide the ticker 
         *  first, and check whether users really disabled this feature later.
         */
        if( !isUserOptioned('disableTicker') ) {
            $('#pagelet_rhc_ticker').show();
        }
    });
})();

