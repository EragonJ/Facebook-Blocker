/*
 *  Generic localStorage Getter
 *  XXX: Deprecated
 */
//  function get_ls(which, stringifiedJSON) {
//  
//      var ls = localStorage[which];
//  
//      // undefined means the value is not set , so we have to return undefined to recognize
//      if ( ls === undefined ) {
//          return undefined;
//      }
//  
//      return (stringifiedJSON === true) ? JSON.parse( ls ) : ls.split(',');
//  }

/*
 *  Generic localStorage Setter
 *  XXX: Deprecated
 */
//  function set_ls(which, value) {
//  
//      if ( which !== undefined &&  which !== null ) {
//          localStorage[which] = value;
//      }
//  }

function isUserOptioned( optionID , src) {
    return ( $.inArray( optionID, src) !== -1 ) ? true : false;
}

function _($sel, key) {
    if ( $sel.is('input') ) {
        console.log( $sel.val());
        $sel.val( chrome.i18n.getMessage(key) );
    }
    else {
        $sel.html( chrome.i18n.getMessage(key) );
    }
}
