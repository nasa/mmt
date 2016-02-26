$(document).ready ->

  # Advance to the next card body
  $('.card-navigation-control-forward').click (event) ->
    currentSlide = $(this).closest('.card').find('.card-body.active')
    console.log currentSlide
    slide(currentSlide, "next")
    event.preventDefault()

  # Move back to the previous card body
  $('.card-navigation-control-back').click (event) ->
    currentSlide = $(this).closest('.card').find('.card-body.active')
    slide(currentSlide, "prev")
    event.preventDefault()

  # slide() moves forward and back through card bodies
  slide = (currentSlide, direction) ->
    currentSlide.removeClass('active')
    if direction == 'next'
      if currentSlide.next('.card-body').length
        currentSlide.next('.card-body').addClass('active')
      else
        currentSlide.parent().find('.card-body').first().addClass('active')
      moveDot(currentSlide, 'next')
    else if direction == 'prev'
      if currentSlide.prev('.card-body').length
        currentSlide.prev('.card-body').addClass('active')
      else
        currentSlide.parent().find('.card-body').last().addClass('active')
      moveDot(currentSlide, 'prev')

  # moveDot() updates the position of the dot pagination
  moveDot = (currentSlide, direction) ->
    currentCard = currentSlide.closest('.card')
    currentDot = currentCard.find('.card-navigation-pagination .fa-circle')
    currentDot.toggleClass('fa-circle fa-circle-o')
    if direction == 'next'
      if currentDot.next().length
        currentDot.next().toggleClass('fa-circle-o fa-circle')
      else
        currentCard.find('.card-navigation-pagination i').first().toggleClass('fa-circle-o fa-circle')
    else if direction == 'prev'
      if currentDot.prev().length
        currentDot.prev().toggleClass('fa-circle-o fa-circle')
      else
        currentCard.find('.card-navigation-pagination i').last().toggleClass('fa-circle-o fa-circle')
