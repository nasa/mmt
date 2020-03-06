$(document).ready ->
  if $('.email-subscription-form').length > 0

    # Validate email subscription form
    $('.email-subscription-form').validate
      rules:
        'subscription[descriiption]':
          required: true
        'subscription[query]':
          required: true
        'subscription[user_id]':
          required: true
      messages:
        'subscription[descriiption]':
          required: 'Description is required.'
        'subscription[query]':
          required: 'Query is required.'
        'subscription[user_id]':
          required: 'Subscriber is required.'

      errorPlacement: (error, element) ->
        if element.attr('id') == 'subscriber'
          element.closest('.subscriber-group').append(error)
        else
          error.insertAfter(element)
