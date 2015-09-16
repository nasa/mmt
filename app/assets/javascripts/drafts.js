// Setup NestedItemPicker for Science Keywords
var picker;
var setupScienceKeywords = function(data) {
  picker = new NestedItemPicker('.nested-item-picker', {data: data});
};

$(document).ready(function() {

  // set up validation call
  $('.validate').blur(function(e) {
    handleFieldValidation ($(this));
  });

  // Handle form navigation
  $('.next-section').change(function() {
    $('#new_form_name').val(this.value);
    this.form.submit();
  });

  $('.multiple').on('click', '.add-new', function(e) {
    var simple = $(this).hasClass('new-simple');
    var topMultiple = $(this).closest('.multiple');
    var multipleItem;
    var newDiv;

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
      multipleItem = topMultiple.children('.multiple-item:last');
      newDiv = multipleItem.clone(true);

      var multipleIndex = getIndex(multipleItem);
      $(newDiv).removeClass('multiple-item-' + multipleIndex).addClass('multiple-item-' + (multipleIndex + 1));

      // Remove any extra multiple-item, should only be one per .multiple
      $.each($(newDiv).find('.multiple').not('.multiple.addresses-street-addresses'), function(index, multiple) {
        $.each($(multiple).children('.multiple-item'), function(index2) {
          if (index2 > 0) {
            $(this).remove();
          }
        });
      });

      // Find the index that needs to be incremented
      var firstElement = $(newDiv).find('select, input, textarea')[0];
      var nameIndex = $(firstElement).attr('name').lastIndexOf(multipleIndex);
      var idIndex = $(firstElement).attr('id').lastIndexOf(multipleIndex);

      // Loop through newDiv and increment the correct index
      $.each($(newDiv).find('select, input, textarea, label'), function(index, field) {
        if ($(field).is('input, textarea, select')) {
          var name = $(field).attr('name');
          if (name !== undefined) {
            name = name.slice(0, nameIndex) + name.slice(nameIndex).replace(multipleIndex, multipleIndex + 1);
            $(field).attr('name', name);
          }

          var id = $(field).attr('id');
          id = id.slice(0, idIndex) + id.slice(idIndex).replace(multipleIndex, multipleIndex + 1);
          $(field).attr('id', id);

          // Clear field value
          if ($(field).attr('type') === 'radio') {
            $(field).prop('checked', false);
          } else {
            $(field).not('input[type="hidden"]').val('');
          }
        } else if ($(field).is('label')) {
          var labelFor = $(field).attr('for');
          if (labelFor !==  undefined) {
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
        if (headerIndex !== undefined) {
          if (index === 0) {
            $(field).html(headerHtml.replace(headerIndex, parseInt(headerIndex) + 1));
          } else {
            $(field).html(headerHtml.replace(headerIndex, 1));
          }
        }
      });
    }

    $(newDiv).find('select, input, textarea').removeAttr('disabled');
    $(newDiv).find('select, input, textarea').not('input[type="hidden"]')[0].focus();
    // Remove points from preview link
    $.each($(newDiv).find('.spatial-preview-link'), function() {
      var url = $(this).attr('href').split('?')[0];
      $(this).attr('href', url);
    });
    e.stopImmediatePropagation();
  });

  $('.multiple').on('click', '.remove', function() {
    var multipleItem = $(this).closest('.multiple-item');
    $(multipleItem).remove();
  });

  // Handle responsibility-picker (org/person)
  $('.responsibility-picker').change(function() {
    var partyType = $(this).parents('.party-type');
    switch ($(this).val()) {
      case 'organization':
        $(partyType).siblings('.organization-fields').show();
        $(partyType).siblings('.person-fields').hide();
        break;
      case 'person':
        $(partyType).siblings('.organization-fields').hide();
        $(partyType).siblings('.person-fields').show();
        break;
      default:

    }
    // Clear all org and person fields
    $.each($(partyType).siblings('.organization-fields, .person-fields').find('input'), function(index, field) {
      $(field).val('');
    });

    // Toggle checkboxes
    $(this).siblings('.responsibility-picker').prop('checked', false);
    $(this).prop('checked', true);
  });

  // Handle coordinate-system-picker (geographic/local)
  $('.coordinate-system-picker').change(function() {
    var partyType = $(this).parents('.party-type');
    switch ($(this).val()) {
      case 'geographic':
        $(partyType).siblings('.geographic-coordinate-system-fields').show();
        $(partyType).siblings('.local-coordinate-system-fields').hide();
        break;
      case 'local':
        $(partyType).siblings('.geographic-coordinate-system-fields').hide();
        $(partyType).siblings('.local-coordinate-system-fields').show();
        break;
      default:

    }
    // Clear all org and person fields
    $.each($(partyType).siblings('.geographic-coordinate-system-fields, .local-coordinate-system-fields')
    .find('input'), function(index, field) {
      $(field).val('');
    });

    // Toggle checkboxes
    $(this).siblings('.coordinate-system-picker').prop('checked', false);
    $(this).prop('checked', true);
  });

  // Handle TemporalRangeType selector
  $('.temporal-range-type-select').change(function() {
    $(this).parent().siblings('.temporal-range-type').hide();
    // Clear all fields
    $(this).parent().siblings('.temporal-range-type').find('input, select').val('');

    switch ($(this).val()) {
      case 'SingleDateTime':
        $(this).parent().siblings('.temporal-range-type.single-date-time').show();
        break;
      case 'RangeDateTime':
        $(this).parent().siblings('.temporal-range-type.range-date-time').show();
        break;
      case 'PeriodicDateTime':
        $(this).parent().siblings('.temporal-range-type.periodic-date-time').show();
        break;
      default:

    }
  });

  // Handle SpatialCoverageType selector
  $('.spatial-coverage-type-select').change(function() {
    $(this).parent().siblings('.spatial-coverage-type').hide();
    // Clear all fields
    $(this).parent().siblings('.spatial-coverage-type').find('input, select').not('input[type="radio"]').val('');

    switch ($(this).val()) {
      case 'HORIZONTAL':
        $(this).parent().siblings('.spatial-coverage-type.horizontal').show();
        break;
      case 'VERTICAL':
        $(this).parent().siblings('.spatial-coverage-type.vertical').show();
        break;
      case 'ORBITAL':
        $(this).parent().siblings('.spatial-coverage-type.orbit').show();
        break;
      case 'BOTH':
        $(this).parent().siblings('.spatial-coverage-type.horizontal').show();
        $(this).parent().siblings('.spatial-coverage-type.vertical').show();
        break;
      default:

    }
  });

  var getIndex = function(multipleItem) {
    var classMatch = $(multipleItem).attr('class').match(/multiple-item-(\d+)/);
    if (classMatch === null) {
      return false;
    } else {
      return parseInt(classMatch[1]);
    }
  };

  // Search form
  $('#search').on('click', 'button', function() {
    // Set search_type to whichever button was pressed
    var name = $(this).attr('name');
    var form = $(this).parents('form');

    $(form).find('#search_type').val(name);
    form.submit();
  });

  $('#search input').keypress(function(event) {
    // Set search_type to whichever form the user pressed enter in
    if (event.which === 13) {
      var name = 'full_search';

      if ($(this).parent('.quick-search').length > 0) {
        name = 'quick_find';
      }

      var form = $(this).parents('form');

      $(form).find('#search_type').val(name);
      form.submit();
    }
  });

  // Shape file uploads
  var csrf;
  if (typeof document.querySelector === 'function') {
    if (document.querySelector('meta[name=csrf-token]')) {
      csrf = document.querySelector('meta[name=csrf-token]').content;
    }
  }
  Dropzone.options.shapeFileUpload = {
    url: '/convert',
    paramName: 'upload',
    headers: {'X-CSRF-Token': csrf},
    clickable: '.geojson-dropzone-link',
    uploadMultiple: false,
    createImageThumbnails: false,
    dictDefaultMessage: '',

    success: function(file, response) {
      var hasPoints;
      $.each(response.features, function(index, feature) {
        if (feature.geometry.type === 'Point') {
          hasPoints = false;
          var lastPoint = $('.multiple.points').first().find('.multiple-item').last();
          $.each($(lastPoint).find('input'), function(index, element) {
            if ($(element).val() !== '') {
              hasPoints = true;
              return false;
            }
          });

          if (hasPoints) {
            $('.multiple.points').first().find('.actions > .add-new').click();
          }

          lastPoint = $('.multiple.points').first().find('.multiple-item').last();
          var points = feature.geometry.coordinates;

          $(lastPoint).find('.longitude').val(points[0]);
          $(lastPoint).find('.latitude').val(points[1]);
          $(lastPoint).find('.longitude').trigger('change');

        } else if (feature.geometry.type === 'Polygon') {
          if (feature.geometry.coordinates[0].length > 50) {
            $(file.previewElement).addClass('dz-error');
            $(file.previewElement).find('.dz-error-message > span').text('Too many points in polygon');
          } else {
            // if last polygon has points, click add another polygon
            hasPoints = false;
            var lastPolygon = $('.multiple.g-polygons > .multiple-item').last();
            $.each($(lastPolygon).find('input'), function(index, element) {
              if ($(element).val() !== '') {
                hasPoints = true;
                return false;
              }
            });

            if (hasPoints) {
              $('.multiple.g-polygons > .actions > .add-new').click();
            }

            // loop through coordinates and add points to last polygon
            lastPolygon = $('.multiple.g-polygons > .multiple-item').last();
            var lastPoint = $(lastPolygon).find('.boundary .multiple.points > .multiple-item').last();
            $.each(feature.geometry.coordinates[0], function(index, coordinate) {
              if (index > 0) {
                $(lastPolygon).find('.boundary .multiple.points > .actions > .add-new').click();
                lastPoint = $(lastPolygon).find('.boundary .multiple.points > .multiple-item').last();
              }
              $(lastPoint).find('.longitude').val(coordinate[0]);
              $(lastPoint).find('.latitude').val(coordinate[1]);
            });

            $(lastPoint).find('.longitude').trigger('change');

          }
        }

      });
    }
  };

  $('.latitude, .longitude').on('change', function() {
    var latitude, longitude;
    var coordinates = [];
    var previewLink = $(this).parents('.accordion-body').find('.spatial-preview-link');
    if (previewLink.length > 0) {
      var url = $(previewLink).attr('href').split('map')[0];

      // if point has both latitude and longitude points, generate a link
      if ($(this).parents('.boundary').length > 0) {
        // loop through all points and add to coordinates
        $.each($(this).parents('.boundary').find('input'), function(index, element) {
          coordinates.push($(element).val());
        });
        if (coordinates.length % 2 === 0) {
          $(previewLink).attr('href', url + 'map?polygon=' +  encodeURIComponent(coordinates.join(',')));
        }
      } else {
        if ($(this).hasClass('latitude')) {
          latitude = $(this).val();
          longitude = $(this).siblings('.longitude').val();
        } else {
          latitude = $(this).siblings('.latitude').val();
          longitude = $(this).val();
        }

        if (latitude !== '' && longitude !== '') {
          coordinates.push([longitude, latitude]);

          $(previewLink).attr('href', url + 'map?sp=' +  encodeURIComponent(coordinates.join(',')));
        }
      }
    }
  });

  $('.bounding-rectangle-point').on('change', function() {
    var west, south, east, north;
    var coordinates = [];
    var previewLink = $(this).parents('.accordion-body').find('.spatial-preview-link');
    var url = $(previewLink).attr('href').split('map')[0];

    var parent = $(this).parent();
    west = $(parent).find('.bounding-rectangle-point.west').val();
    south = $(parent).find('.bounding-rectangle-point.south').val();
    east = $(parent).find('.bounding-rectangle-point.east').val();
    north = $(parent).find('.bounding-rectangle-point.north').val();

    if (west.length > 0 && south.length > 0 && east.length > 0 && north.length > 0) {
      coordinates = [west, south, east, north];

      $(previewLink).attr('href', url + 'map?sb=' +  encodeURIComponent(coordinates.join(',')));
    }
  });

  // trigger changes on page load to generate links
  $.each($('.multiple.points .longitude, .bounding-rectangle-point.west')
  .not('.multiple.lines .longitude, .exclusive-zone .longitude'), function(index, element) {
    if ($(element).val().length > 0) {
      $(element).trigger('change');
    }
  });

  // Handle add keyword button
  $('.add-keyword').on('click', function() {
    // Add selected value to keyword list
    var values = picker.getValues();
    var keywordList = $('.selected-science-keywords ul');
    var li;
    $.each(values, function(index, value) {
      li = $('<li>' + value + "<a class='remove'><i class='fa fa-times-circle'></i></a></li>");
      $('<input/>', {
        type: 'hidden',
        name: 'draft[science_keywords][]',
        id: 'draft_science_keywords_',
        value: value
      }).appendTo(li);
      $(li).appendTo(keywordList);
    });

    // Reset picker to top level
    picker.resetPicker();
  });

  $('.selected-science-keywords').on('click', '.remove', function() {
    $(this).parent().remove();
  });

});
