// Nested item selector
  // $(function() {
  //
  //   function setPickerPosition(itemPath, adding) {
  //     var top, left;
  //     left = $(itemPath).height();
  //     top = -left;
  //     if (adding) {
  //       top -= 48;
  //       left += 48;
  //     }
  //
  //     $(itemPath).closest('.nested-item-picker').css('top', top);
  //     $(itemPath).siblings('.item-list-pane').css('left', left);
  //   }
  //
  //   // Adds to the item path section
  //   // $(".item-parent").click(function () {
  //   $('div.nested-item-picker').on('click', '.item-parent', function() {
  //     var $this = $(this);
  //     var itemPathValue = $this.text();
  //
  //     setPickerPosition($this.parents('.nested-item-picker').find('.item-path'), true);
  //
  //     $('ul.item-path').append('<li><a href="javascript:void(0);">' + itemPathValue + '</a></li>');
  //   });
  //
  //   // Adds final option selected class
  //   // $(".final-option").click(function () {
  //   $('div.nested-item-picker').on('click', '.final-option', function() {
  //     var $this = $(this);
  //     $this.toggleClass('final-option-selected');
  //   });
  //
  //   $('ul.item-path').on('click', 'li', function() {
  //     var $this = $(this);
  //     $this.nextAll().remove();
  //     setPickerPosition($this.closest('.item-path'), false);
  //   });
  // });
// +function ($) {
//   'use strict';
//
//   var NestedItemPicker = function (element, options) {
//     this.type = null;
//     this.$element = null;
//     this.options = null;
//     this.data = null;
//
//     this.init('nestedItemPicker', element, options)
//   }
//
//   NestedItemPicker.DEFAULTS = {
//
//   }
//
//   NestedItemPicker.prototype.init = function (type, element, options) {
//     this.type = type;
//     this.$element = element;
//     this.options = this.getOptions(options);
//   }
//
//   NestedItemPicker.prototype.getDefaults = function () {
//     return NestedItemPicker.DEFAULTS
//   }
//
//   NestedItemPicker.prototype.getOptions = function (options) {
//     options = $.extend({}, this.getDefaults(), this.$element.data(), options)
//
//     return options;
//   }
//
//   NestedItemPicker.prototype.getValue = function () {
//     alert('test');
//     var items = this.$element.find('.item-path > li')
//   }
//
//   NestedItemPicker.prototype.selectItem = function () {
//
//   }
//
//
//
//
//   function Plugin(options) {
//     return this.each(function () {
//       var $this = $(this)
//
//     })
//   }
//
//   var old = $.fn.nestedItemPicker;
//   $.fn.nestedItemPicker = Plugin;
//   $.fn.nestedItemPicker.Constructor = NestedItemPicker;
// }(jQuery);

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
    this.level = 1;

    this.updateList();

    // bind events here
    var asdf = this;
    this.$element.on('DOMSubtreeModified', '.item-path', function() {
      asdf.updateList();
    });

    return this;
  };

  this.NestedItemPicker.DEFAULTS = {

  };

  this.NestedItemPicker.prototype.getDefaults = function() {
    return NestedItemPicker.DEFAULTS;
  };

  this.NestedItemPicker.prototype.getOptions = function(options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options);

    return options;
  };

  this.NestedItemPicker.prototype.getValue = function() {
    var pickerElement = this.$element;
    var items = [];
    var itemElements = pickerElement.find('.item-path > li').not('.item-path > li.list-title');
    $.each(itemElements, function(index, element) {
      items.push($(element).text());
    });

    var finalOption = pickerElement.find('.final-option-selected');
    if (finalOption.length > 0) {
      items.push($(finalOption).text());
    }

    return items.join(' > ');
  };

  this.NestedItemPicker.prototype.resetPicker = function() {
    this.$element.find('.item-path > li.list-title').click();
    this.updateList();
  };

  this.NestedItemPicker.prototype.updateList = function() {
    var selectedItems = this.getValue().split(' > ');

    if (selectedItems.length === 1 && selectedItems[0] === '') {
      selectedItems = [];
    }
    var itemList = this.$element.find('.item-list-pane > ul');
    $(itemList).html('');

    var newItems = [];
    var newItem = {};
    if (selectedItems.length === 0) {
      // display first level values
      // newItem.class = 'list-title';
      // newItem.value = 'Category';
      // newItems.push(newItem);
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

      // newItem.class = 'list-title';
      // newItem.value = arrayType;
      // newItems.push(newItem);
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
