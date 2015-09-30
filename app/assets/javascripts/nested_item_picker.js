(function($) {
  this.NestedItemPicker = function(element, options) {
    this.type = null;
    this.$element = null;
    this.options = null;
    this.data = null;
    this.level = null;

    this.init('nestedItemPicker', element, options);
  };

  this.NestedItemPicker.prototype.init = function(type, element, options) {
    this.type = type;
    this.$element = $(element);
    this.options = this.getOptions(options);
    this.data = this.options.data;

    this.updateList();

    // bind events here
    var self = this;
    this.$element.on('DOMSubtreeModified', '.item-path', function() {
      self.updateList();
    });

    return this;
  };

  this.NestedItemPicker.DEFAULTS = {
    // put default options here
  };

  this.NestedItemPicker.prototype.getDefaults = function() {
    return NestedItemPicker.DEFAULTS;
  };

  this.NestedItemPicker.prototype.getOptions = function(options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options);

    return options;
  };

  this.NestedItemPicker.prototype.getValues = function() {
    var pickerElement = this.$element;
    var values = [];
    var items = [];
    var itemElements = pickerElement.find('.item-path > li').not('.item-path > li.list-title');
    $.each(itemElements, function(index, element) {
      items.push($(element).text());
    });

    var finalOption = pickerElement.find('.final-option-selected');
    var parentItems = items.slice();
    if (finalOption.length > 0) {
      $.each(finalOption, function(index, option) {
        items = parentItems.slice();
        items.push(option.text);

        values.push(items.join(' > '));
      });
    } else {
      values.push(items.join(' > '));
    }

    return values;
  };

  this.NestedItemPicker.prototype.resetPicker = function() {
    this.$element.find('.item-path > li.list-title').click();
    this.updateList();
  };

  this.NestedItemPicker.prototype.updateList = function() {
    var selectedValues = this.getValues();
    var selectedItems = [];
    if (selectedValues.length > 0) {
      selectedItems = this.getValues()[0].split(' > ');
    }

    var itemList = this.$element.find('.item-list-pane > ul');
    $(itemList).html('');

    var newItems = [];
    var newItem = {};
    if (selectedItems.length === 0) {
      $.each(this.data.category, function(index, item) {
        newItem = {};
        newItem.value = item.value;
        newItem.class = item.subfields === undefined ? 'final-option' : 'item-parent';

        newItems.push(newItem);
      });
    } else {
      // traverse this.data with item values and display subfields
      var arrayType = 'category';
      var array = this.data[arrayType];
      var values;
      $.each(selectedItems, function(index, selectedItem) {
        $.grep(array, function(item) {
          if (item.value === selectedItem) {
            arrayType = item.subfields[0];
            array = item[arrayType];
          }
        });
        if (index + 1 === selectedItems.length) {
          values = array;
        }
      });

      $.each(values, function(index, item) {
        newItem = {};
        newItem.value = item.value;
        newItem.class = item.subfields === undefined ? 'final-option' : 'item-parent';

        newItems.push(newItem);
      });
    }

    $.each(newItems, function(index, item) {
      var li = $('<li/>');
      $('<a/>', {
        href: 'javascript:void(0);',
        class: item.class,
        text: item.value
      }).appendTo(li);
      $(li).appendTo(itemList);
    });
  };

}(jQuery));
