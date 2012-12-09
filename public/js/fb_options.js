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

    // TODO: finish group
    this.allOptions = [ 
        { 
            id : 'enableUILock', 
            info : 'Enable Lock UI', 
            description: 'Display Lock Icon when messages are locked. <p> ( <b>ATTENTION</b> : If you disable this option, you will not be able to unlock messages !) </p>', 
            default : true
        },
        {
            id : 'ignoreCaseSensitive',
            info : 'Ignore Case Sensitive',
            description : 'Enable this to make case insensitive. <p> ( <b>Example</b> : If you enables this, pattern - "Dog" will match any word like "DOG" or "dog" or "DoG". )</p>',
            default : false
        },
        {
            id : 'disableTicker',
            info : 'Disable Ticker',
            description : 'Check this if you want to disable the FB new feature - Ticker.<p>( <b>Ticker?</b> - Ticker shows you the things you can already see on Facebook, but in real time. )</p>',
            default : false
    
        },
        {
            id : 'enableUnseen',
            info : 'Enable Unseen feature',
            description : 'Enable Unseen feature can make your friends unknow whether you read the chatbox message or not<p> ( <b>ATTENTION</b>: If you enable this option, you have to restart this extension to use it. )</p>',
            default : false
        }

/*        { 
            id : 'enableRE', 
            info : 'Enable Regular Expression', 
            description : 'This option is still under development', 
            default : true 
        },
        { 
            id : 'enableHotKey', 
            info : 'Enable HotKey', 
            description : 'This option is still under development',
            default : true 
        }*/

    ];

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

    render : function() {
        var that = this;
        chrome.storage.sync.get('userOptions', function(o) {
            if ( !chrome.runtime.lastError ) {
                that.userOptions = o['userOptions'];
                that.renderOption();
            }
        });
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
