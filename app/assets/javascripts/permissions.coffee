$(document).ready ->

  # JUST FOR TESTING - REMOVE!
  $('#chooser-widget').show()
  start_widget()


  $('#search_groups_').select2()
  $('#search_and_order_groups_').select2()

  # Hide field by default
  $('#collection_ids_chosen').addClass 'is-hidden'


  $('#chooser-widget').hide()

  # Show respective field based on selection
  $('#collections').on 'change', ->
    if $(this).val() == 'selected-ids-collections'
      $('#chooser-widget').show()
      start_widget()
    else
      $('#chooser-widget').hide()


  $('#granules').on 'change', ->
    if $(this).val() == 'access-constraint-granule'
      $('#granules-constraint-values').removeClass 'is-hidden'
    else
      $('#granules-constraint-values').addClass 'is-hidden'

  # Toggle group input field
  $('#groups-table button').on 'click', (e) ->
    e.preventDefault()
    $(this).addClass 'is-hidden'
    $(this).siblings('#search_order_groups_chosen').removeClass 'is-hidden'
    $(this).siblings('#search_groups_chosen').removeClass 'is-hidden'


  if $("#search_groups_prev_val").val() != ""
    tmp_val = $("#search_groups_prev_val").val().split(",")
    $("#search_groups_").val(tmp_val)
    $("#search_groups_").select2()

  if $("#search_and_order_groups_prev_val").val() != ""
    tmp_val = $("#search_and_order_groups_prev_val").val().split(",")
    $("#search_and_order_groups_").val(tmp_val)
    $("#search_and_order_groups_").select2()




window.collectionsChooser = null

start_widget = () ->
  if window.collectionsChooser == null
    window.collectionsChooser = new Chooser({
      id: 'collectionsChooser',
      url: '/permission/all_collections',
      nextPageParm: 'page_num',
      filterParm: 'entry_id',
      filterChars: '1',
      resetSize: 20,
      target: $('#chooser-widget'),
      fromLabel: 'Available collections',
      toLabel: 'Chosen collections',
      showNumChosen: true,
      forceUnique: true,
      attachTo: $('#collection_selections')
    })

    window.collectionsChooser.init()

