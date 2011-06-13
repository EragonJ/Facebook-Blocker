$(document).ready(function() {

    var o = new Option();
    o.renderOption();

    $('label').click( function() {
        console.log('x');
        toggle( $(this) );
    })

    $('#reset').click( function() {
        nonCheckEffect(  $('label') );
    });

    $('#done').click( function() {
        o.setOptionsToLocalStorage();
        // chrome.tabs.remove();
        window.close();
    })

    // load from localstorage and insert values inside mapping selector
});

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

    // TODO: finish group feature
    this.optionSettings = [ 
        { id : 'enableRE', info : 'Enable Regular Expressiong' },
        { id : 'enableHotKey', info : 'Enable HotKey' }
    ];

    // User selected options
    this.options = this.getOptionsFromLocalStorage();

    this.$optionTemplate = this.getOptionTemplate();
};

Option.prototype = {

    renderOption : function() {
        var settings = this.getOptionSettings();
        var $div = this.createOption();

        $.each( settings, function(i, obj) {

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
        return $('div.option-body div:first').clone().remove();
    },

    getOptionSettings : function() {
        return this.optionSettings;
    },

    getOptionsFromLocalStorage : function() {
        return ( get_ls('options') !== undefined ) ? JSON.parse( get_ls('options') ) : [];
    },

    setOptionsToLocalStorage : function() {

        var checkedIDs = [];
        $('input:checked').each(function() {
            checkedIDs.push( $(this).attr('id') );
        })

        set_ls( 'options', JSON.stringify( checkedIDs ) ); 
    }
};
