/**
 *
 * Chooser - dynamic, AJAX-enabled pick-list
 *
 * @author James LastName
 *
 * Configuration parameters:
 * id (string):             Unique ID for this widget. All HTML elements within this widget will
 *                          have IDs based on this.
 * url (string):            URL of resource to retrieve initial selections.
 * target (element):        DOM element where this widget will be placed.
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
 * showNumChosen (int):     Always show the number of chosen items in the "to" list.
 * attachTo (element):      DOM element where a value can be stored (hidden or text input).
 * errorCallback (function): Callback function to execute if an AJAX error occurs.
 * filterText (string):     Text for the filter textbox placeholder (default is "filter")
 * removeAdded (boolean):   Remove selections from the FROM list as they are added to the TO list. Default is true,
 * allowRemoveALl (boolean): Show the remove all button
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
        FILTER_TEXTBOX, TO_MESSAGE;

    var CHOOSER_OPTS_STORAGE_KEY = "___Chooser_opts_" + config.id;
    var PAGE_NUM = 1;

    /**
     * init - initializes the widget.
     */
    this.init = function() {

        var self = this;

        // Construct each component
        OUTER_CONTAINER = $("<div class='___Chooser' id='"+config.id+"'></div>");
        FROM_CONTAINER = $("<div></div>");
        TO_CONTAINER = $("<div></div>");
        BUTTON_CONTAINER = $("<div></div>");
        FROM_BOX = $("<div></div>");
        TO_BOX = $("<div></div>");


        var addButtonText = hasProp("addButton", "object") ? config.addButton.text : "&#x2192;";
        var addButtonCssClass = hasProp("addButton", "object") ? config.addButton.cssClass : "";
        ADD_BUTTON = $("<button title='add' class='"+addButtonCssClass+"'>"+addButtonText+"</button>");
        if(hasProp("addButton") && config.addButton.arrowCssClass) {
            $(ADD_BUTTON).append(" <span class='"+config.addButton.arrowCssClass+"'></span> ");
        }


        var delButtonText = hasProp("delButton", "object") ? config.delButton.text : "&#x2190;";
        var delButtonCssClass = hasProp("delButton", "object") ? config.delButton.cssClass : "";
        REMOVE_BUTTON = $("<button title='remove' class='"+delButtonCssClass+"'>"+delButtonText+"</button>");
        if(hasProp("delButton") && config.delButton.arrowCssClass) {
            $(REMOVE_BUTTON).prepend(" <span class='"+config.delButton.arrowCssClass+"'></span> ");
        }

        var allowRemoveAll = hasProp("allowRemoveAll", "boolean") ? config.allowRemoveAll : true;

        if(allowRemoveAll === true) {
            REMOVE_ALL_BUTTON = $("<button title='remove all'>&#x21C7;</button>");
        }

        FROM_LIST = $("<select class='___fromList' id='"+config.id +"_fromList"
                    +"' multiple size='5'></select>");
        TO_LIST = $("<select class='___toList' name='"+config.id + "_toList"+"' id='"+config.id + "_toList"
                    +"' multiple size='5'></select>");

        var placeHolderText = hasProp("filterText", "string") ? config.filterText : "filter";
        FILTER_TEXTBOX = $("<input type='text' placeholder='"+placeHolderText+"'>");

        if(!config.hasOwnProperty("resetSize")) {
            config.resetSize = 50;
        }


        if(config.fromLabel) {
            FROM_LABEL = $("<label for='"+config.id + "_fromList" +"'>"+config.fromLabel+"</label>");
            $(FROM_CONTAINER).append(FROM_LABEL);
            $(FROM_CONTAINER).append("<br>");
        }

        if(config.toLabel) {
            TO_LABEL = $("<label for='"+config.id + "_toList" +"'>"+config.toLabel+"</label>");
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


        TO_MESSAGE = $("<span class='___to_message'></span>");
        $(TO_CONTAINER).append(TO_MESSAGE);


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

        $(FROM_LIST).on('scroll', function(evt){

            if(hasProp("endlessScroll", "boolean") && config.endlessScroll === false) {
                return;
            }

            //console.log('scroll event:::::', evt);

            var lowerBoundary = $(this).position().top + parseInt($(this).css('height'));
            var upperBoundary = $(this).position().top;

            var lastOpt = $(this).find('option').last();
            var lastOptPos = $(lastOpt).position().top;
            var firstOpt = $(this).find('option').first();
            var firstOptPos = $(firstOpt).position().top;
            var lastOptHeight = parseInt($(lastOpt).css("height"));

            if(lastOptPos <= lowerBoundary) {

                //console.log("HIT LOWER BOUNDARY ---->"+ lowerBoundary + "," + lastOptPos)
                //console.log("lastOptHeight==="+lastOptHeight)
                var dist = lowerBoundary - lastOptPos;
                //console.log("dist =====> " + dist);

                var offset = lastOptHeight - dist;

                //console.log("offset =====> " + offset);

                if(offset > 1 && offset < 5) {
                    getRemoteData("next");
                }
            }

            if(firstOptPos >= upperBoundary) {
                //console.log("HIT UPPER BOUNDARY ---->"+ upperBoundary + "," + firstOptPos);
                self.removeFromBottom();
                PAGE_NUM = 1;
            }
        });

        $(TO_LIST).change(function() {
            var numChosen = $(TO_LIST).find("option").length;
            if(hasProp("toLabel") && hasProp("showNumChosen") ) {
                if(config.showNumChosen === true && numChosen > 0) {
                    $(TO_LABEL).text( config.toLabel + " ("+  numChosen +")"  );
                } else {
                    $(TO_LABEL).text( config.toLabel );
                }
            }

            if(hasProp("attachTo", "object")) {
                var delimiter = hasProp("delimiter", "string") ? config.delimiter : ",";
                $(config.attachTo).val( self.val().join(delimiter) );
            }

            // Ensure each option has a title so that mouse hover reveals the full value
            // if it overflows the bounding box.
            $(TO_LIST).find("option").each(function(k,v){
                $(v).attr("title",  $(v).text() );
            });

            // if the TO_LIST has any selected options, make the first one selected and click on it
            $(TO_LIST).find("option:first").prop("selected", true);
            $(TO_LIST).find("option:first").click();

        });


        $(FILTER_TEXTBOX).keyup(initFilter);

        $(FROM_LIST).dblclick(function() {
            $(ADD_BUTTON).click();
        });

        $(TO_LIST).dblclick(function() {
            $(REMOVE_BUTTON).click();
        });
        
        storeSelections();
        loadSelections();
    };

    /**
     *
     * @returns {*|jQuery}
     */
    this.val = function(valToSet) {
        //var vals = $(TO_LIST)
         //   .find("option")
         //   .map(function(k,v){return $(v).attr("value")});


        if(valToSet && typeof valToSet === "object") {
            $(TO_LIST).empty();
            $.each(valToSet, function(k,v) {

                var disp_val, opt_val;

                if(typeof v === "object" && v.length === 2) {
                    disp_val = v[0];
                    opt_val = v[1];
                } else if(typeof v === "object" && v.length === 1) {
                    disp_val = v[0];
                    opt_val = v[0];
                } else {
                    disp_val = v;
                    opt_val = v;
                }

                var opt = "<option value='"+opt_val+"'>"+disp_val+"</option>";

                $(TO_LIST).append(opt);
            });

            $(TO_LIST).trigger("change");
        }

        var vals = $(TO_LIST)
            .find("option")
            .map(function(k,v){return $(v).text()});

        var valsAsArray = [];
        $.each(vals, function(k,v){valsAsArray.push(v)});
        return valsAsArray;
    };

    /**
     * Returns the top-level DOM node of this widget.
     * @returns {*|jQuery|HTMLElement}
     */
    this.getDOMNode = function() {
        return $(OUTER_CONTAINER);
    };


    /**
     * Adds values to the FROM list.
     * @param list
     */
    this.addValues = function(list) {
        setOrAddValues(list);
    };


    /**
     * Overwrites existing values in FROM list with new ones.
     * @param list
     */
    this.setValues = function(list) {
        $(FROM_LIST).find("option").remove();
        setOrAddValues(list);
    };


    /**
     * Removes N values from top of FROM list.
     *
     * @param n - number of values to remove.
     */
    this.removeFromTop = function(n) {
        //console.log("removeFromTop")

        var list = $(FROM_LIST).find("option");
        var listSize = $(list).length;
        var numOptsToRemove = listSize - config.resetSize;
        //console.log("removeFromTop::Removing " + numOptsToRemove + " options")
        $(FROM_LIST).find("option").each(function(k,v) {
            if(k < numOptsToRemove) {
                $(v).remove();
            }
        });
        //console.log("removeFromTop:::LIST SIZE------->",$(FROM_LIST).find("option").length)
    };


    /**
     * Remove N values from bottom of list.
     */
    this.removeFromBottom = function() {
        //console.log("removeFromBottom")

        var list = $(FROM_LIST).find("option");
        var listSize = $(list).length;
        var numOptsToRemove = listSize - config.resetSize;
        //console.log("removeFromBottom::Removing " + numOptsToRemove + " options");
        if(listSize < 1) {
            return;
        }
        var revList = [];
        // reverse the list
            $.each(list, function(k,v){
            revList.unshift(v);
        });
        //console.log("revList==="+revList.length);
        $.each(revList, function(k,v) {
                if(k < numOptsToRemove) {
                $(v).remove();
            }
        });



        //console.log("removeFromBottom:::LIST SIZE------->",$(FROM_LIST).find("option").length)
    };

    /**
     * Remove any stored selections.
     */
    this.clearSelections = function() {
        if(sessionStorage) {
            sessionStorage.removeItem(CHOOSER_OPTS_STORAGE_KEY);
        }
    };


    // Private functions: -----------------------------

    /**
     * Trigger the filter textbox action.
     *
     * @param e
     */
    var initFilter = function(e) {
        //console.log($(this).val());
        if($(this).val().length >= config.filterChars) {
            //console.log("Getting filtered data...")
            getRemoteData("filter");
        } else {
            //console.log("Getting first page of data...")
            getRemoteData("first");
        }
    };

    /**
     * Stores the selections in the browser's session
     * storage.
     */
    var storeSelections = function() {
        if(sessionStorage && hasProp("rememberLast", "boolean") && config.rememberLast === true) {
            $(TO_LIST).on('change', function(){
                //console.log("Storing selections...");
                var items = [];
                $(this).find("option").each(function(k,v){
                    var optData = {
                        dispText: $(v).text(),
                        val: $(v).val()
                    };
                    items.push(optData);
                });
                sessionStorage.setItem(CHOOSER_OPTS_STORAGE_KEY, JSON.stringify(items));
            });
        } else {
            //console.error("Session storage is not supported in this browser.");
        }
    };

    /**
     * Loads selections into the TO box from the browser's session storage.
     */
    var loadSelections = function() {
        if(sessionStorage && hasProp("rememberLast", "boolean") && config.rememberLast === true) {
            var items = JSON.parse(sessionStorage.getItem(CHOOSER_OPTS_STORAGE_KEY));
            //console.log("items==================>", items);
            $.each(items, function(k,v){
                var opt = $("<option value='"+v.val+"'>"+v.dispText+"</option>");
                $(TO_LIST).append(opt);
            });
            $(TO_LIST).trigger("change");
        } else {
            //console.error("Session storage is not supported in this browser.");
        }
    };



    /**
     * Makes the AJAX calls to get the data from the remote server.
     *
     * @param type
     */
    var getRemoteData = function(type) {
        //console.log("getRemoteData::type=="+type);
        var url = config.url;
        var overwrite = false;

        if(type === "first") {
            overwrite = true;
            url += "?"+config.nextPageParm+"=1"
            PAGE_NUM = 1;
        } else if(type === "next") {
            PAGE_NUM++;
            url += "?"+config.nextPageParm+"=" + PAGE_NUM;
        } else if(type === "filter") {
            overwrite = true;
            url += "?" + config.filterParm + "=" + $(FILTER_TEXTBOX).val();
        }


        $.ajax({
            'url': url,
        }).done(function (resp) {
            setOrAddValues(resp, overwrite);
        }).fail(function (resp) {
            console.error("ERROR--->Could not retrieve values. Reason:");
            console.error(resp.statusCode);
            console.error(resp.responseText)

            if(hasProp("errorCallback", "function")) {
                config.errorCallback.call();
            }
        });
    };


    /**
     * Sets or adds the values in the FROM list.
     *
     * @param list - the array of values.
     * @param overwrite - whether or not to overwrite the existing values.
     */
    var setOrAddValues = function(list, overwrite) {

        var value, displayValue;

        if(overwrite === true) {
            $(FROM_LIST).find("option").remove();
        }

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

            var newOpt = $("<option value='"+value+"' title='"+displayValue+"'>"+displayValue+"</option>");
            $(FROM_LIST).append(newOpt);
        });
    };

    /**
     * Add button click action.
     *
     * @param e - the click event
     */
    var addButtonClick = function(e) {
        e.preventDefault();
        var msg = hasProp("uniqueMsg", "string") ? config.uniqueMsg : "Value already added";

        var removeAdded = hasProp("removeAdded", "boolean") ? config.removeAdded : true;
        $(FROM_LIST).find("option:selected").each(function(k,v){
            var clonedOpt = $(v).clone();
            if(config.forceUnique) {
                //debugger
                var fromListVal = $(v).attr("value");
                var toListVal = $(TO_LIST).find("option[value='"+fromListVal+"']").attr("value");
                if(toListVal !== fromListVal) {
                    $(TO_LIST).append(clonedOpt);
                    if(removeAdded) {
                        $(v).remove();
                    }
                } else {
                    $(TO_MESSAGE).text(msg);
                    setTimeout(function() {
                        $(TO_MESSAGE).text("");
                    }, 2000);

                }
            } else {
                $(TO_LIST).append(clonedOpt);
                if(removeAdded) {
                    $(v).remove();
                }
            }

            $(TO_LIST).trigger("change");

            // This is a hack in order to accommodate picky libraries like validate
            $(TO_LIST).find("option:first").prop("selected", true);
            $(TO_LIST).find("option:first").click();

        })
    };

    /**
     * Remve button click action.
     *
     * @param e - the click event
     * @param remAll - boolean indicating whether or not to remove
     * all values from the FROM list.
     */
    var removeButtonClick = function(e, remAll) {
        e.preventDefault();
        var query =  remAll ? "option" : "option:selected";
        $(TO_LIST).find(query).each(function(k,v){
            var fromListVal = $(v).attr("value");
            var toListVal = $(TO_LIST).find("option[value='"+fromListVal+"']").attr("value");
            if(fromListVal !== toListVal) {
                var clonedOpt = $(v).clone();
                $(FROM_LIST).prepend(clonedOpt);
            }
            $(v).remove();
        });
        $(TO_LIST).trigger("change");

        // This is a hack in order to accommodate picky libraries like validate
        $(TO_LIST).find("option:first").prop("selected", true);
        $(TO_LIST).find("option:first").click();
    };

    var removeAllButtonClick = function(e) {
        removeButtonClick(e, true);
    };


    /**
     * Convenience method to test for presence of
     * a config option.
     *
     * Examples:
     * hasProp("someProp", "object")
     * hasProp("foo", "string")
     * hasProp("bar", "function")
     * hasProp("baz")
     *
     * @param name - config key
     * @param type - data type
     * @returns {boolean}
     */
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
        } else {
            return false;
        }
    };

};

