$(document).ready(function() {
  // Handle form navigation
  $('.next-section').change(function() {
    $('#new_form_name').val(this.value);
    this.form.submit();
  });

  $('.multiple').on('click', '.add-new', function(e) {
    var simple = $(this).hasClass('new-simple');
    var topMultiple = $(this).closest('.multiple'),
        multipleItem,
        newDiv;

    if (simple) {
      // multiple-item is a simple field, like just a text field
      // clone parent and clear field
      multipleItem = $(this).closest('.multiple-item');
      newDiv = $(multipleItem).clone(true);
      $.each($(newDiv).find('select, input, textarea'), function(index, field) {
        $(field).val('');
      });
      $(newDiv).appendTo(topMultiple);
    } else {
      // multiple-item is a collection of fields
      // get template and replace newindex
      multipleItem = topMultiple.children('.multiple-item:last')
      var index = getIndex(multipleItem);
      var type = getFieldType(topMultiple);
      var template = $('.' + type + '-template').clone(true);
      var newIndex = index + 1;
      newDiv = $(template.html().replace(/newindex/g, newIndex));
      $(this).closest('.accordion').addClass('is-closed');
      $(newDiv).insertAfter(multipleItem);
      $(multipleItem).addClass('is-closed');
    }

    $(newDiv).find('select, input, textarea').removeAttr('disabled');
    $(newDiv).show();
    $(newDiv).removeClass('is-closed');
    $(newDiv).find('select, input, textarea')[0].focus();
    e.stopImmediatePropagation();
  });

  $('.multiple').on('click', '.remove', function() {
    var multipleItem = $(this).closest('.multiple-item');
    $(multipleItem).remove();
  });

  var getFieldType = function(field) {
    var classes = $(field).attr('class').split(/\s+/)
    var type = '';
    if (classes.indexOf('organization') != -1) {
      type = 'organization';
    } else if (classes.indexOf('related-url') != -1) {
      type = 'related-url'
    } else if (classes.indexOf('metadata-dates') != -1) {
      type = 'metadata-dates'
    } else if (classes.indexOf('distribution') != -1) {
      type = 'distribution'
    }
    return type;
  }

  var getIndex = function(multipleItem) {
    var classMatch = $(multipleItem).attr('class').match(/multiple-item-(\d+)/);
    if (classMatch == null) {
      return false;
    } else {
      return parseInt(classMatch[1]);
    }
  }
});
