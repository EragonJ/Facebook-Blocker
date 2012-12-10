$(document).ready(function() {

    var o = new Option();
    o.render();

    $(document).on('click', 'label', function() {
        toggle( $(this) );
    });

    $('#default').click( function() {
        if ( confirmNext() ) {
            o.defaultOption();
        }
    });

    $('#reset').click( function() {
        if ( confirmNext() ) {
            nonCheckEffect( $('label') );
        }
    });

    $('#done').click( function() {
        o.setOptionsToStorage();
        closeWindow();
    })

    $('.tipsy-item').tipsy({ 
        gravity : 'w', 
        html : true,
        live : true
    });


    // i18n
    _( $('#default'), 'UI_options_useDefaultValues');
    _( $('#reset'), 'UI_options_resetAll');
    _( $('#done'), 'GLOBAL_DONE');
});

function closeWindow() {

    // Workaround to help us close window
    window.open('', '_self', '');
    window.close();
}

function confirmNext() {
    return confirm(' Are you sure? '); 
}

function toggle( $label ) {

    var $input = $label.find('input');

    if ( isChecked( $input ) ) {
        $input.prop('checked', '');
        nonCheckEffect( $label );
    }
    else {
        $input.prop('checked', 'checked');
        checkEffect( $label );
    }
}

function isChecked( $input ) {
    return $input.prop('checked');
}

function checkEffect( $label ) {

    var $input = $label.find('input');
    var type = $input.attr('type');

    $label.removeClass( type + '-off' ); 
    $label.addClass( type + '-on' );
}

function nonCheckEffect( $label ) {

    var $input = $label.find('input');
    var type = $input.attr('type');

    $label.removeClass( type + '-on' );
    $label.addClass( type + '-off' ); 
}

function clearCheckEffect( $label ) {
    nonCheckEffect( $label );
}

var Option = function() {

    this.allOptions = [];

    // User selected options
    this.userOptions = [];

    this.$optionTemplate = this.getOptionTemplate();
};

Option.prototype = {

    defaultOption : function() {

        var that = this;

        $.each( this.allOptions, function(i, obj) {

            var $input = $( '#' + obj.id );
            var $label = $input.parent('label');

            if ( obj['default'] === true ) {
                $input.prop('checked', 'checked');
                checkEffect( $label );
            }
            else {
                $input.prop('checked', '');    
                nonCheckEffect( $label );
            }
        });
    },

    getAllOptions : function() {

        var that = this;

        $.getJSON('/models/options.json', function( result ) {

            // traverse all options
            $.each( result.options, function( _optionIndex, eachOption ) {

                var eachOptionObject = eachOption;

                // traverse each option
                $.each( eachOption, function(k, v) {

                    // only replace options_ variables
                    if ( typeof v === "string" && v.match(/^options_/) ) {
                        eachOptionObject[k] = chrome.i18n.getMessage(v);
                    }
                });

                that.allOptions.push( eachOptionObject );
            });
            
            that.getUserOptions();
        });
    },

    getUserOptions : function() {
        var that = this;
        chrome.storage.sync.get('userOptions', function(o) {
            if ( !chrome.runtime.lastError ) {
                that.userOptions = o['userOptions'];
                that.renderOption();
            }
        });
    },

    render : function() {
        // getAllOptions from models -> 
        // getUserOptions from storage -> 
        // render options
        this.getAllOptions()
    },

    renderOption : function() {

        var that = this;

        $.each( this.allOptions, function(i, obj) {

            var $div = that.createOption();

            if ( obj.description ) {
                $div.attr( 'title', obj.description );
            }

            $div.find( 'input' ).attr( 'id', obj.id );
            $div.find( 'span' ).html( obj.info ) ; 
            $div.appendTo( 'div.option-body' );

        });

        $.each( this.userOptions, function(i, id) { 
            // can't trigger here !? weird
            toggle( $( '#' + id ).parent( 'label' ) );
        });

    },

    createOption : function() {
        return this.$optionTemplate.clone();
    },

    getOptionTemplate : function() {
        return $('div.option-body div:first').remove().clone();
    },

    removeOptionsFromStorage : function() {
        chrome.storage.sync.remove('userOptions');
    },

    setOptionsToStorage : function() {

        // remove first
        this.removeOptionsFromStorage();

        var checkedIDs = [];
        $('input:checked').each(function() {
            checkedIDs.push( $(this).attr('id') );
        })

        // set
        var o = {};
        o['userOptions'] = checkedIDs;

        chrome.storage.sync.set(o);
    }

};
