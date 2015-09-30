$(document).ready(function() {
  $('.delete-collection').on('click', function(e) {
    var count = $('.collection-granule-count').text();
    if (count !== 'Granules (0)') {
      e.stopImmediatePropagation();

      alert('Collections with granules cannot be deleted.');
    }
  });
});
