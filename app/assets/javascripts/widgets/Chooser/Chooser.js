
// var chooser = new Chooser({
//      target: someNode,
//      url: "/some/path/controller.rb",
//      cssClass: "someClass",
//})
//
// chooser.init()
// chooser.clear()
// chooser.update()
/*
var CCCC;
$(function(){
    CCCC = new Chooser({
        target:$("#chooser_cont"),
        initialList: ["Item A", "Item B", "Item C", "Item C"],
        fromLabel: "From",
        toLabel: "To",
        forceUnique: true
    });
    //CCCC.init();
})
*/

/**
 *
 * Chooser - dynamic, AJAX-enabled pick-list
 *
 * @author James LastName
 *
 * Configuration parameters:
 *
 * target (string):         DOM element where this widget will be placed.
 * initialList:             List of initial values to load into the "from" list
 * fromLabel:               Label to appear over "from" list
 * toLabel:                 Label to appear over "to" list
 * forceUnique (boolean):   When true, only allows unique options to be added to the "to" list,
 *                          e.g., if "ABC" is already in the "to" list, it will not be added. Default is false.
 *
 * Public methods:
 *
 * init()                   Initialize and render the widget.
 * val()                    Get the currently selected "to" values.
 * getDOMNode()             Returns the DOM node for customization.
 * addValues(list)          Adds values to the "from" list
 * setValues(list)          Removes current values from "from" list and adds new ones.
 *
 * TODO! Add these methods:
 * removeFromTop(n)         Remove n values from top of "from" list.
 * removeFromBottom(n)      Remove n values from bottom of "from" list.
 *
 * @param config
 * @constructor
 */
var Chooser = function(config) {

    // Globals
    var OUTER_CONTAINER, FROM_CONTAINER, TO_CONTAINER, BUTTON_CONTAINER,
        FROM_BOX, FROM_LIST,
        TO_BOX, TO_LIST,
        ADD_BUTTON, REMOVE_BUTTON, REMOVE_ALL_BUTTON,
        FROM_LABEL, TO_LABEL;

    /**
     *
     */
    this.init = function() {

        // Construct each component
        OUTER_CONTAINER = $("<div class='___Chooser'></div>");
        FROM_CONTAINER = $("<div></div>");
        TO_CONTAINER = $("<div></div>");
        BUTTON_CONTAINER = $("<div></div>");
        FROM_BOX = $("<div></div>");
        TO_BOX = $("<div></div>");
        ADD_BUTTON = $("<button title='add'>&#x2192;</button>");
        REMOVE_BUTTON = $("<button title='remove'>&#x2190;</button>");
        REMOVE_ALL_BUTTON = $("<button title='remove all'>&#x21C7;</button>");
        FROM_LIST = $("<select multiple size='5'></select>");
        TO_LIST = $("<select class='___toList' multiple size='5'></select>");

        if(config.fromLabel) {
            FROM_LABEL = $("<label>"+config.fromLabel+"</label>");
            $(FROM_CONTAINER).append(FROM_LABEL);
        }

        if(config.toLabel) {
            TO_LABEL = $("<label>"+config.toLabel+"</label>");
            $(TO_CONTAINER).append(TO_LABEL);
        }

        // Assemble the components
        $(OUTER_CONTAINER).append(FROM_CONTAINER);
        $(OUTER_CONTAINER).append(BUTTON_CONTAINER);
        $(OUTER_CONTAINER).append(TO_CONTAINER);
        $(FROM_CONTAINER).append(FROM_LIST);
        $(TO_CONTAINER).append(TO_LIST);
        $(BUTTON_CONTAINER).append(ADD_BUTTON);
        $(BUTTON_CONTAINER).append(REMOVE_BUTTON);
        $(BUTTON_CONTAINER).append(REMOVE_ALL_BUTTON);
        $(OUTER_CONTAINER).appendTo($(config.target));


        if(hasProp("initialList", "object")) {
            config.initialList.forEach(function(v,k){
                var li = $("<option value='"+v+"'>"+v+"</option>");
                $(li).on("click", function(){

                });
                $(FROM_LIST).append(li);

            });
        }



        $(ADD_BUTTON).click(addButtonClick);
        $(REMOVE_BUTTON).click(removeButtonClick);
        $(REMOVE_ALL_BUTTON).click(removeAllButtonClick);
    };

    /**
     *
     * @returns {*|jQuery}
     */0
    this.val = function() {
        return $(TO_LIST)
            .find("option")
            .map(function(k,v){return $(v).attr("value")});
    }

    /**
     *
     * @returns {*|jQuery|HTMLElement}
     */
    this.getDOMNode = function() {
        return $(OUTER_CONTAINER);
    };


    /**
     *
     * @param list
     */
    this.addValues = function(list) {
        setOrAddValues(list);
    };


    /**
     *
     * @param list
     */
    this.setValues = function(list) {
        $(FROM_LIST).find("option").remove();
        setOrAddValues(list);
    };


    this.removeFromTop = function(n) {
        $(FROM_LIST).find("option").each(function(k,v) {
            if(k < n) {
                $(v).remove();
            }
        });
    }

    this.removeFromBottom = function(n) {
        var list = $(FROM_LIST).find("option");
        list = list.reverse();
        $.each(list, function(k,v) {
            if(k < n) {
                $(v).remove();
            }
        });
    }


    // Private functions: -----------------------------

    var setOrAddValues = function(list) {
        list.forEach(function(v,k){
            var newOpt = $("<option value='"+v+"'>"+v+"</option>");
            $(FROM_LIST).append(newOpt);
        });
    }

    var addButtonClick = function() {
        $(FROM_LIST).find("option:selected").each(function(k,v){
            var clonedOpt = $(v).clone();
            if(config.forceUnique) {
                //debugger
                var fromListVal = $(v).attr("value");
                var toListVal = $(TO_LIST).find("option[value='"+fromListVal+"']").attr("value");
                if(toListVal !== fromListVal) {
                    $(TO_LIST).append(clonedOpt);
                    $(v).remove();
                }
            } else {
                $(TO_LIST).append(clonedOpt);
                $(v).remove();
            }
        })
    }

    var removeButtonClick = function() {
        $(TO_LIST).find("option:selected").each(function(k,v){
            var clonedOpt = $(v).clone();
            $(FROM_LIST).prepend(clonedOpt);
            $(v).remove();
        })
    }

    var removeAllButtonClick = function() {
        $(TO_LIST).find("option").each(function(k,v){
            var clonedOpt = $(v).clone();
            $(FROM_LIST).prepend(clonedOpt);
            $(v).remove();
        })
    }

    // hasProp("someProp", "object")
    var hasProp = function(name, type) {
        if(config.hasOwnProperty(name)) {
            if(type) {
                var _t = typeof config[name];
                if(_t === type) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        }
    }

}