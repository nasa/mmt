$(document).ready ->
  if $('.subscription-form').length > 0

    # Validate email subscription form
    $('.subscription-form').validate
      rules:
        'subscription[name]':
          required: true
        'subscription[concept_id]':
          required: true
        'subscription[metadata]':
          required: true
        'subscription[user_id]':
          required: true
      messages:
        'subscription[name]':
          required: 'Subscription Name is required.'
        'subscription[concept_id]':
          required: 'Collection Concept ID is required.'
        'subscription[metadata]':
          required: 'Query is required.'
        'subscription[user_id]':
          required: 'Subscriber is required.'

      errorPlacement: (error, element) ->
        if element.attr('id') == 'subscriber'
          element.closest('.subscriber-group').append(error)
        else
          error.insertAfter(element)
