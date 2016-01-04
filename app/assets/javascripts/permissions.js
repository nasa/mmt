$(document).ready(function() {
  // Enable jQuery Chosen on field
  $('#collection-ids').chosen();
  $('#search-order-groups').chosen({
    placeholder_text_multiple: "Select groups for Search and Order permissions"
  });
  $('#search-groups').chosen({
    placeholder_text_multiple: "Select groups for Search permissions"
  });

  // Hide field by default
  $('#collection_ids_chosen').addClass('is-hidden');
  $('#search_order_groups_chosen').addClass('is-hidden');
  $('#search_groups_chosen').addClass('is-hidden');

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

  // Toggle group input field
  $('#groups-table button').on('click', function(e) {
    e.preventDefault();
    $(this).addClass('is-hidden');
    $(this).siblings('#search_order_groups_chosen').removeClass('is-hidden');
    $(this).siblings('#search_groups_chosen').removeClass('is-hidden');

  });
});