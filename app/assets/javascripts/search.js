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

function updateCollectionSearchInput(entryId, sort, page, pushUrl) {
  var targetUrl = 'search';
  var paramString = window.location.search;
  var paramArray = paramString.slice(1).split('&');
  var newParamArray = [];

  for (var i = 0; i< paramArray.length; i++) {
    var param = paramArray[i];
    var parts = param.split('=');
    if (parts[0].length > 0 && parts[0] != 'page' && parts[0] != 'sort' && parts[0] != entry_id) {
      newParamArray.push(param);
    }
  }
  newParamArray.push('page=' + page);
  //newParamArray.push('sort=' + sort);
  var queryParams = 'page=' + page + '&sort=' + sort;
  if (entryId && entryId.length !== 0) {
    newParamArray.push('entry_id=' + entryId);
  }

  var queryParams = newParamArray.join('&');

  if (history.pushState) {
    if (pushUrl) {
      var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?' + queryParams;
      window.history.pushState({path: newurl}, '', newurl);
    }
  }

  $.ajax({
    type: 'GET',
    dataType: 'script',
    url: targetUrl,
    data: queryParams
  });

  return false;
}

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [,''])[1].replace(/\+/g, '%20')) || null;
}

// Handle "Back" button
$(window).on('popstate', function() {
  // Refresh the contents page using AJAX. Extract & use the parameters from the "backed" url
  var page = getURLParameter('page');
  if (page !== null) {
    updateCollectionSearchInput(getURLParameter('entry_id') || '', getURLParameter('sort') || '', getURLParameter('page') || '', false);
  }
});

function goToPage(page) {
  updateCollectionSearchInput($('#entry_id').val(), $('#sort').val(), page, true);
}
