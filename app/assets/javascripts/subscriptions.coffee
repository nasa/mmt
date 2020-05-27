# the order of these match the CMR docs
@validGranuleQueryParameters = [
  # 'collection_concept_id', we don't want this to be allowed in the query
  'granule_ur',
  'producer_granule_id',
  'readable_granule_name',
  'online_only',
  'downloadable',
  'attribute',
  'polygon',
  'bounding_box',
  'point',
  'line',
  # we are not providing a shapefile upload option at this time
  'orbit_number',
  'equator_crossing_longitude',
  'equator_crossing_date',
  'updated_since',
  'revision_date',
  'created_at',
  'production_date',
  'cloud_cover',
  'platform',
  'instrument',
  'sensor',
  'project',
  'campaign', # alias for project
  'concept_id', # can be used for collections too...
  'echo_granule_id',
  'echo_collection_id',
  'day_night_flag',
  'day_night', # for unspecified, in the docs
  'two_d_coordinate_system',
  'provider',
  'native_id',
  'short_name',
  'version',
  'entry_title',
  'temporal',
  'cycle',
  'passes',
  'exclude',
  'options'
  # not including sort_key
]


$(document).ready ->
  if $('.subscription-form').length > 0

    # Validate email subscription form
    $('.subscription-form').validate
      rules:
        'subscription[Name]':
          required: true
        'subscription[CollectionConceptId]':
          required: true
        'subscription[Query]':
          required: true
          isValidQuery: true
        'subscription[SubscriberId]':
          required: true
      messages:
        'subscription[Name]':
          required: 'Subscription Name is required.'
        'subscription[CollectionConceptId]':
          required: 'Collection Concept ID is required.'
        'subscription[Query]':
          required: 'Query is required.'
          isValidQuery: 'Query must be a valid CMR granule search query.'
        'subscription[SubscriberId]':
          required: 'Subscriber is required.'

      errorPlacement: (error, element) ->
        if element.attr('id') == 'subscriber'
          element.closest('.subscriber-group').append(error)
        else
          error.insertAfter(element)

    # whether because of this additional validation function or otherwise,
    # clicking into a field that requires validation (and maybe entering something),
    # then clicking the submit button tends to to actually submit but blur and
    # validate only the field that was in focus, not all fields
    # method for validating query
    $.validator.addMethod 'isValidQuery', (value, elem, params) ->
      query = value
      queryRgx = /^\??(([\[\]\\\w]+)=[ \\\.\-\:\,\%\+\*\w]+&?)+$/

      return false if queryRgx.test(query) == false

      parts = query.split('&')

      for part in parts
        # remove the beginning ? if it was provided
        # some parameters can have brackets or escapes before the brackets. we are only checking what is before the bracket
        # cmr search parameters are case insensitive
        parameter = part.replace(/^\?/, '').split('=')[0].split('[')[0].split('\\')[0].toLowerCase()

        # is the parameter listed in the CMR docs?
        return false if validGranuleQueryParameters.indexOf(parameter) == -1

      true

  $('#subscriber').on 'change', ->
    if $('#subscriber-error').length > 0
      $('#subscriber').valid()

  $('.estimate-notifications').on 'click', ->
    $('.status-text').text('Creating an estimate from available data...')
    $('.results-text').hide()
    $('.error-text').hide()
    if $('.subscription-form').valid()
      $.ajax '/estimate_notifications',
        method: 'POST'
        data:
          subscription:
            CollectionConceptId: $('#subscription_CollectionConceptId').val()
            Query: $('#subscription_Query').val()
            SubscriberId: $('#subscriber').val()
        success: (data) ->
          $('.status-text').text('Estimate Done!')
          $('.estimate-text').text(data['estimate'])
          $('.granules-count-text').text(data['granules'])
          $('.frequency-text').text(data['frequency'])
          query_text = $('#subscription_Query').val()
          if (query_text.length > 300)  # more than 300 chars gets a text box
            $('.query-text-large').text(query_text)
            $('.query-text-small').hide()
            $('.query-title').show()
            $('.query-text-large').show()
          else
            $('.query-text-small').text("Query: #{query_text}")
            $('.query-text-small').show()
            $('.query-title').hide()
            $('.query-text-large').hide()
          $('.results-text').show()
        error: (response) ->
          $('.status-text').text('Estimate failed.')
          $('.error-text').text(response.responseText)
          $('.error-text').show()          
    else
      $('.status-text').text('Please enter a valid subscription and try again.')
