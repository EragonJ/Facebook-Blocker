$(document).ready(function() {

    var o = new Option();
    o.renderOption();

    $('label').click( function() {
        toggle( $(this) );
    })

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
        o.setOptionsToLocalStorage();
        closeWindow();
    })

    $('.tipsy-item').tipsy({ gravity : 'w' });
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
        $input.attr('checked', '');
        nonCheckEffect( $label );
    }
    else {
        $input.attr('checked', 'checked');
        checkEffect( $label );
    }
}

function isChecked( $input ) {
    return $input.attr('checked');
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

    // TODO: finish group
    this.optionSettings = [ 
        { 
            id : 'enableRE', 
            info : 'Enable Regular Expression', 
            description : 'If blah blah', 
            default : true 
        },
        { 
            id : 'enableHotKey', 
            info : 'Enable HotKey', 
            default : true 
        },
        { 
            id : 'enableUILock', 
            info : 'Show Lock Icon', 
            description: 'Display Lock Icon when messages are blocked', 
            default : true
        } 
    ];

    // User selected options
    this.options = this.getOptionsFromLocalStorage();

    this.$optionTemplate = this.getOptionTemplate();
};

Option.prototype = {

    defaultOption : function() {
        var settings = this.getOptionSettings();
        var that = this;

        $.each( settings, function(i, obj) {
            var $input = $( '#' + obj.id );
            var $label = $input.parent('label');

            if ( obj['default'] === true ) {
                $input.attr('checked', 'checked');
                checkEffect( $label );
            }
            else {
                $input.attr('checked', '');    
                nonCheckEffect( $label );
            }
        });
    },

    renderOption : function() {

        var settings = this.getOptionSettings();
        var that = this;

        $.each( settings, function(i, obj) {

            var $div = that.createOption();

            if ( obj.description ) {
                $div.attr( 'title', obj.description );
            }

            $div.find( 'input' ).attr( 'id', obj.id );
            $div.find( 'span' ).html( obj.info ) ; 
            $div.appendTo( 'div.option-body' );

        });

        $.each( this.options, function(i, id) { 
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

    getOptionSettings : function() {
        return this.optionSettings;
    },

    getOptionsFromLocalStorage : function() {
        return ( get_ls('userOptions') !== undefined ) ? JSON.parse( get_ls('userOptions') ) : [];
    },

    setOptionsToLocalStorage : function() {

        var checkedIDs = [];
        $('input:checked').each(function() {
            checkedIDs.push( $(this).attr('id') );
        })

        set_ls( 'userOptions', JSON.stringify( checkedIDs ) ); 
    }
};
