/**
 *
 * Chooser - dynamic, AJAX-enabled pick-list
 *
 * @author James LastName
 *
 * Configuration parameters:
 * firstUrl (string):       URL of resource to retrieve initial selections.
 * nextUrl (string):        URL of resource to retrieve next chunk of selections.
 * filterUrl (string):      URL of resource to retrieve filtered selections.
 * target (string):         DOM element where this widget will be placed.
 * initialList:             List of initial values to load into the "from" list
 * fromLabel:               Label to appear over "from" list
 * toLabel:                 Label to appear over "to" list
 * forceUnique (boolean):   When true, only allows unique options to be added to the "to" list,
 *                          e.g., if "ABC" is already in the "to" list, it will not be added. Default is false.
 * size (int):              Height of select control in number of options.
 * resetSize (int):         When user scrolls to top, the entire list is trimmed to this size. Not required,
 *                          default is 50.
 * rememberLast:            Remember the last values entered. Uses browser's session storage.
 * filterChars (sting):     Number of characters to allow typing into filter textbox before AJAX call is triggered.
 *                          Default is 3.
 *
 * Public methods:
 *
 * init()                   Initialize and render the widget.
 * val()                    Get the currently selected "to" values.
 * getDOMNode()             Returns the DOM node for customization.
 * addValues(list)          Adds values to the "from" list
 * setValues(list)          Removes current values from "from" list and adds new ones.
 * removeFromBottom(n)      Remove n values from bottom of "from" list.
 *
 * NOTES: Data format shall be formatted in the following ways:
 *
 *          1) An array of strings. Every value will be used for the option value and display value.
 *          For example, ["lorem", "ipsum", "dolor", "sit", "amet"]
 *
 *          2) An array of 2-element arrays. First element is the option value, the second is the display value.
 *          For example, [ ["lorem", "Lorem"], ["ipsum", "Ipsum"] ...  ]
 *
 *          3) A mixed array: [ ["lorem", "Lorem"], "ipsum",  "dolor", ["sit", "Sit"] ... ]
 *
 *          4) An array of single- or dual-element arrays.
 *          For example, [ ["lorem", "Lorem"], ["ipsum"] ...  ]
 *
 *          5) Any combination of the above.
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
        FROM_LABEL, TO_LABEL,
        FILTER_TEXTBOX;

    var PAGE_NUM = 1;

    /**
     *
     */
    this.init = function() {

        var self = this;

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
        FILTER_TEXTBOX = $("<input type='text' placeholder='filter'>");

        if(!config.hasOwnProperty("resetSize")) {
            config.resetSize = 50;
        }


        if(config.fromLabel) {
            FROM_LABEL = $("<label>"+config.fromLabel+"</label>");
            $(FROM_CONTAINER).append(FROM_LABEL);
            $(FROM_CONTAINER).append("<br>");
        }

        if(config.toLabel) {
            TO_LABEL = $("<label>"+config.toLabel+"</label>");
            $(TO_CONTAINER).append(TO_LABEL);
        }

        // Assemble the components
        $(OUTER_CONTAINER).append(FROM_CONTAINER);
        $(OUTER_CONTAINER).append(BUTTON_CONTAINER);
        $(OUTER_CONTAINER).append(TO_CONTAINER);
        $(FROM_CONTAINER).append(FILTER_TEXTBOX);
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

        getRemoteData("first");

        $(FROM_LIST).on('scroll', function(){
            var lowerBoundary = $(this).position().top + parseInt($(this).css('height'));
            var upperBoundary = $(this).position().top;

            var lastOpt = $(this).find('option').last();
            var lastOptPos = $(lastOpt).position().top;
            var firstOpt = $(this).find('option').first();
            var firstOptPos = $(firstOpt).position().top;

            if(lastOptPos <= lowerBoundary) {
                console.log("HIT LOWER BOUNDARY ---->"+ lowerBoundary + "," + lastOptPos)
                getRemoteData("next");
            }

            if(firstOptPos >= upperBoundary) {
                console.log("HIT UPPER BOUNDARY ---->"+ upperBoundary + "," + firstOptPos)
                self.removeFromBottom();
            }
        });


        $(FILTER_TEXTBOX).keyup(initFilter);


        storeSelections();
        loadSelections();

    };

    /**
     *
     * @returns {*|jQuery}
     */
    this.val = function() {
        return $(TO_LIST)
            .find("option")
            .map(function(k,v){return $(v).attr("value")});
    };

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
        console.log("removeFromTop")

        var list = $(FROM_LIST).find("option");
        var listSize = $(list).length;
        var numOptsToRemove = listSize - config.resetSize;
        console.log("Removing " + numOptsToRemove + " options")
        $(FROM_LIST).find("option").each(function(k,v) {
            if(k < numOptsToRemove) {
                $(v).remove();
            }
        });
        console.log("removeFromTop:::LIST SIZE------->",$(FROM_LIST).find("option").length)
    };

    this.removeFromBottom = function() {
        console.log("removeFromBottom")

        var list = $(FROM_LIST).find("option");
        var listSize = $(list).length;
        var numOptsToRemove = listSize - config.resetSize;
        console.log("Removing " + numOptsToRemove + " options")
        var revList = [];
        // reverse the list
            $.each(list, function(k,v){
            revList.unshift(v);
        });
        console.log("revList==="+revList.length);
        $.each(revList, function(k,v) {
                if(k < numOptsToRemove) {
                $(v).remove();
            }
        });
        console.log("removeFromBottom:::LIST SIZE------->",$(FROM_LIST).find("option").length)
    };


    // Private functions: -----------------------------


    var initFilter = function(e) {
        console.log($(this).val());
        if($(this).val().length > config.filterChars) {
            getRemoteData("filter");
        }
    };


    var storeSelections = function() {
        if(sessionStorage) {
            $(TO_LIST).on('change', function(){
                console.log("Storing selections...");
                var items = [];
                $(this).find("option").each(function(k,v){
                    items.push($(v).val());
                });
                sessionStorage.setItem("___Chooser_opts", JSON.stringify(items));
            });
        } else {
            console.error("Session storage is not supported in this browser.");
        }
    };


    var loadSelections = function() {
        if(sessionStorage) {
            var items = JSON.parse(sessionStorage.getItem("___Chooser_opts"));
            console.log("items==================>", items);
            $.each(items, function(k,v){
                var opt = $("<option value='"+v+"'>"+v+"</option>")
                $(TO_LIST).append(opt);
            });
        } else {
            console.error("Session storage is not supported in this browser.");
        }
    };

    var getRemoteData = function(type, filterText) {

        var url = config.url;

        if(type === "first") {
            url += "?"+config.nextPageParm+"=1"
            PAGE_NUM = 1;
        } else if(type === "next") {
            PAGE_NUM++;
            url += "?"+config.nextPageParm+"=" + PAGE_NUM;
        } else if(type === "filter") {
            if(filterText && filterText !== "") {
                url += "&" + config.filterParm + "=" + filterText;
            }
        }

        console.log("url", url)

        $.ajax({
            'url': url,
        }).done(function (resp) {
            //console.log(resp)
            setOrAddValues(resp)
            console.log("LIST SIZE------->",$(FROM_LIST).find("option").length)
        }).fail(function (resp) {
            console.error(resp)
        });
    };



    var setOrAddValues = function(list) {
        var value, displayValue;
        $.each(list, function(k,v) {
            if(typeof v === "string") {
                value = displayValue = v;
            } else if(typeof v === "object") {
                if(v.length === 2) {
                    value = v[0];
                    displayValue = v[1];
                } else if (v.length === 1){
                    value = v[0];
                    displayValue = v[0];
                }
            }

            var newOpt = $("<option value='"+value+"'>"+displayValue+"</option>");
            $(FROM_LIST).append(newOpt);
        });
    };

    var addButtonClick = function(e) {
        e.preventDefault();
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
            $(TO_LIST).trigger("change");
        })
    };

    var removeButtonClick = function(e) {
        e.preventDefault();
        $(TO_LIST).find("option:selected").each(function(k,v){
            var clonedOpt = $(v).clone();
            $(FROM_LIST).prepend(clonedOpt);
            $(v).remove();
        });
        $(TO_LIST).trigger("change");
    };

    var removeAllButtonClick = function(e) {
        e.preventDefault();
        $(TO_LIST).find("option").each(function(k,v){
            var clonedOpt = $(v).clone();
            $(FROM_LIST).prepend(clonedOpt);
            $(v).remove();
        });
        $(TO_LIST).trigger("change");
    };

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
    };

};