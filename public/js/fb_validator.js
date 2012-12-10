/*
 *  Validator -
 *      A helper that supply some often used rules that can be imported into fb_*.js
 */
var Validator = function(v) {

    this.v = v;
    this.patternsOf = {
        isEmpty : /^\s*$/,
    };
};

Validator.prototype = {

    isEmpty : function() {
        return this.isMatched( this.v, this.patternsOf['isEmpty'] );
    },

    /*
     *  This is the utility function that helps us validate the value
     */
    isMatched : function( v, regex ) {
        if ( v.match( regex ) ) {
            return true;
        }
        return false;
    }
};
