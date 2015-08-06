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
      // multiple-item is a simple field with no index (just a text field)
      // clone parent and clear field
      multipleItem = $(this).closest('.multiple-item');
      newDiv = $(multipleItem).clone(true);
      $.each($(newDiv).find('select, input, textarea'), function(index, field) {
        $(field).val('');
      });
      $(newDiv).appendTo(topMultiple);
    } else {
      // multiple-item is a collection of fields
      multipleItem = topMultiple.children('.multiple-item:last')
      newDiv = multipleItem.clone(true);

      var multipleIndex = getIndex(multipleItem);
      $(newDiv).removeClass('multiple-item-' + multipleIndex).addClass('multiple-item-' + (multipleIndex + 1));

      // Remove any extra multiple-item, should only be one per .multiple
      $.each($(newDiv).find('.multiple').not('.multiple.address-street-address'), function(index, multiple) {
        $.each($(multiple).children('.multiple-item'), function(index2, field) {
          if (index2 > 0) {
            $(this).remove();
          }
        });
      });

      // Find the index that needs to be incremented
      var firstElement = $(newDiv).find('select, input, textarea')[0]
      var nameIndex = $(firstElement).attr('name').lastIndexOf(multipleIndex);
      var idIndex = $(firstElement).attr('id').lastIndexOf(multipleIndex);

      // Loop through newDiv and increment the correct index
      $.each($(newDiv).find('select, input, textarea, label'), function(index, field) {
        if ($(field).is('input, textarea, select')) {
          var name = $(field).attr('name');
          if (name != undefined) {
            name = name.slice(0, nameIndex) + name.slice(nameIndex).replace(multipleIndex, multipleIndex + 1);
            $(field).attr('name', name);
          }

          var id = $(field).attr('id');
            id = id.slice(0, idIndex) + id.slice(idIndex).replace(multipleIndex, multipleIndex + 1);
            $(field).attr('id', id);

          // Clear field value
          if ($(field).attr('type') == 'radio') {
            $(field).prop('checked', false);
          } else {
            $(field).val('');
          }
        } else if ($(field).is('label')) {
          var labelFor = $(field).attr('for');
            if (labelFor != undefined) {
              labelFor = labelFor.slice(0, idIndex) + labelFor.slice(idIndex).replace(multipleIndex, multipleIndex + 1);
              $(field).attr('for', labelFor);
            }
        }
      });

      $(newDiv).insertAfter(multipleItem);
      // close last accordion and open all new accordions
      $(multipleItem).addClass('is-closed');
      $(newDiv).find('.accordion').removeClass('is-closed');
      // Increment index on first accordion header, set all others to 1
      $.each($(newDiv).find('.accordion-header'), function(index, field) {
        var headerHtml = $(field).html();
        var headerIndex = headerHtml.match(/\d+/);
        if (headerIndex != undefined) {
          if (index == 0) {
            $(field).html(headerHtml.replace(headerIndex, parseInt(headerIndex)+1));
          } else {
            $(field).html(headerHtml.replace(headerIndex, 1));
          }
        }
      })
    }

    $(newDiv).find('select, input, textarea').removeAttr('disabled');
    $(newDiv).find('select, input, textarea').not('input[type="hidden"]')[0].focus();
    e.stopImmediatePropagation();
  });

  $('.multiple').on('click', '.remove', function() {
    var multipleItem = $(this).closest('.multiple-item');
    $(multipleItem).remove();
  });

  // Handle responsibility-picker (org/person)
  $('.responsibility-picker').change(function() {
    $(this).siblings('.organization-fields').toggle();
    $(this).siblings('.person-fields').toggle();
    // Clear all org and person fields
    $.each($(this).siblings('.organization-fields, .person-fields').find('input'), function(index, field) {
      $(field).val('');
    });

    // Toggle checkboxes
    $(this).siblings('.responsibility-picker').prop('checked', false);
    $(this).prop('checked', true);
  });

  // Handle TemporalRangeType selector
  $('.temporal-range-type-select').change(function() {
    $(this).siblings('.temporal-range-type').hide();
    // Clear all fields
    $(this).siblings('.temporal-range-type').find('input, select').val('');

    switch ($(this).val()) {
      case 'SingleDateTime':
        $(this).siblings('.temporal-range-type.single-date-time').show();
        break;
      case 'RangeDateTime':
        $(this).siblings('.temporal-range-type.range-date-time').show();
        break;
      case 'PeriodicDateTime':
        $(this).siblings('.temporal-range-type.periodic-date-time').show();
        break;
      default:

    }
  });

  var getIndex = function(multipleItem) {
    var classMatch = $(multipleItem).attr('class').match(/multiple-item-(\d+)/);
    if (classMatch == null) {
      return false;
    } else {
      return parseInt(classMatch[1]);
    }
  }
});
