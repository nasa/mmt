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
        'subscription[SubscriberId]':
          required: true
      messages:
        'subscription[Name]':
          required: 'Subscription Name is required.'
        'subscription[CollectionConceptId]':
          required: 'Collection Concept ID is required.'
        'subscription[Query]':
          required: 'Query is required.'
        'subscription[SubscriberId]':
          required: 'Subscriber is required.'

      errorPlacement: (error, element) ->
        if element.attr('id') == 'subscriber'
          element.closest('.subscriber-group').append(error)
        else
          error.insertAfter(element)
