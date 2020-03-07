$(document).ready ->
  if $('.email-subscription-form').length > 0

    # Validate email subscription form
    $('.email-subscription-form').validate
      rules:
        'subscription[description]':
          required: true
        'subscription[metadata]':
          required: true
        'subscription[user_id]':
          required: true
      messages:
        'subscription[description]':
          required: 'Description is required.'
        'subscription[metadata]':
          required: 'Query is required.'
        'subscription[user_id]':
          required: 'Subscriber is required.'

      errorPlacement: (error, element) ->
        if element.attr('id') == 'subscriber'
          element.closest('.subscriber-group').append(error)
        else
          error.insertAfter(element)
