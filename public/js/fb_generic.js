/*
 *  Generic localStorage Getter
 */
function get_ls(which, stringifiedJSON) {

    var ls = localStorage[which];

    // undefined means the value is not set , so we have to return undefined to recognize
    if ( ls === undefined ) {
        return undefined;
    }

    return (stringifiedJSON === true) ? JSON.parse( ls ) : ls.split(',');
}

/*
 *  Generic localStorage Setter
 */
function set_ls(which, value) {

    if ( which !== undefined &&  which !== null ) {
        localStorage[which] = value;
    }
}
