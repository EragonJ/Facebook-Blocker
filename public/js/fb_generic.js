/*
 *  Generic localStorage Getter
 */
function get_ls(which, stringifiedJSON) {
    var ls = localStorage[which];

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
