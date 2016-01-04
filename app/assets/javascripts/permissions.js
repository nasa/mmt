$(document).ready(function() {
  // Enable jQuery Chosen on field
  $('#collection-ids').chosen();

  // Hide field by default
  $('#collection_ids_chosen').addClass('is-hidden');

  // Show respective field based on selection
  $('#collections').on('change', function() {
    if ($(this).val() == 'selected-ids-collections') {
      $('#collection_ids_chosen').removeClass('is-hidden');
      $('#all-granules-in-collections').removeClass('is-hidden');
    } else {
      $('#collection_ids_chosen').addClass('is-hidden');
      $('#all-granules-in-collections').addClass('is-hidden');
    }

    if ($(this).val() == 'access-constraint-collections') {
      $('#collections-constraint-values').removeClass('is-hidden');
    } else {
      $('#collections-constraint-values').addClass('is-hidden');
    }
  });

  $('#granules').on('change', function() {
    if ($(this).val() == 'access-constraint-granule') {
      $('#granules-constraint-values').removeClass('is-hidden');
    } else {
      $('#granules-constraint-values').addClass('is-hidden');
    }
  });
});