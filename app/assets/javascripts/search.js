$(document).ready(function() {

  // Toggles advanced search in header
  $('.full-search, .search-form-actions button, .search-form-actions a').click(function() {
    $(document).trigger('toggleSearch');
  });

  $(document).on('toggleSearch', function() {
    $('.search-module').toggleClass('is-hidden');

    var pageHeight = $(document).height() - 164; // Header height;

    lightbox(pageHeight);
  });

  $('#search').submit(function() {
    // The full search box might be up when clicking on quick find
    // so remove the lightbox
    $('#lightbox').remove();
  });

  // Basic lightbox functionality
  var lightbox = function(height) {
    if ($('#lightbox').size() === 0) {
      var lightbox = $('<div id="lightbox"/>');
      $('body').append(lightbox);
      $('#lightbox').height(height);
    } else {
      $('#lightbox').remove();
    }
  };
});

// Handle presence of Javascript by turning off or on visibility of JS sensitive objects
$('.js-disabled-object').css({'visibility': 'hidden'});
$('.js-enabled-object').css({'visibility': 'visible'});
