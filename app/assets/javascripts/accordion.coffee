$(document).ready ->
  # Disable toggle
  $('.eui-accordion__header.disable-toggle').unbind('click')

  # the eui-accordion__header listener in eui.js that is responsible for opening/closing the accordions
  # allows the accordions to open/close when the help icon is clicked. Performing this unbind/rebind
  # operation allows the below click listener to take priority and achieves the desired accordion/help
  # icon behavior without editing the vendor file (eui.js)
  $('.eui-accordion__header').not('.eui-accordion__header.disable-toggle').unbind('click')
  $(".eui-accordion__header").not('.eui-accordion__header.disable-toggle').click (e) ->
    if !$(e.target).is('a.display-modal, i.eui-fa-info-circle')
      $(this).siblings(".eui-accordion__body").slideToggle("fast")
      $(this).closest(".eui-accordion").toggleClass("is-closed")

  # if viewing Collection Descriptive Keywords form and Keyword Recommendations
  # are presented to the user, indicate that they have been viewed
  indicateIfKeywordRecommendationsViewed = () ->
    if $('#science-keywords.eui-accordion').length && $('#recommended-keywords-viewed').length
      if $('#recommended-keywords-viewed').val() == 'false'
        $('#recommended-keywords-viewed').val('true')

  # Open accordion based on URL hash (i.e., by clicking on a preview circle or
  # edit link in the preview)
  if window.location.hash
    hash = window.location.hash.substring(1)
    $body = $(document.getElementById(hash))
    .find('.eui-accordion__body').first()

    if $body.parent().hasClass('eui-accordion')
      if $body.parent().find('.disable-toggle').length == 0
        $body.slideToggle 'fast', ->
          $(this).parent().toggleClass 'is-closed'
          $('html, body').animate {
            scrollTop: $(this).parent().offset().top
          }, 500

    if hash == 'science-keywords'
      indicateIfKeywordRecommendationsViewed()

  $('.expand-accordions').on 'click', ->
    $('.eui-accordion.is-closed').removeClass('is-closed')
    $('.eui-accordion__body').slideDown('fast')
    $('.expand-accordions').addClass('is-invisible')
    $('.collapse-accordions').removeClass('is-invisible')

    indicateIfKeywordRecommendationsViewed()

  $('.collapse-accordions').on 'click', ->
    $('.eui-accordion').addClass('is-closed')
    $('.eui-accordion__body').slideUp('fast')
    $('.collapse-accordions').addClass('is-invisible')
    $('.expand-accordions').removeClass('is-invisible')

  # Change Expand/Collapse All link if all accordions on page are collapsed or expanded
  $('.eui-accordion__header').on 'click', ->
    # We don't really care about every accordion on the page for this, just the top level accordions, or fieldset.eui-accordion

    # if all accordions are closed
    if $('fieldset.eui-accordion.is-closed').length == $('fieldset.eui-accordion').length
      $('.collapse-accordions').addClass('is-invisible')
      $('.expand-accordions').removeClass('is-invisible')

    # if all accordions are open
    if $('fieldset.eui-accordion.is-closed').length == 0
      $('.collapse-accordions').removeClass('is-invisible')
      $('.expand-accordions').addClass('is-invisible')

    # the opening/closing and class toggling happens in eui.js and is executed
    # before it gets here, so the accordion is already open if it was closed
    if $(this).closest('.eui-accordion#science-keywords').length && !$(this).closest('.eui-accordion#science-keywords').hasClass('is-closed')
      indicateIfKeywordRecommendationsViewed()
