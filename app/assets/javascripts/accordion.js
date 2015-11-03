$(document).ready(function() {

  // Accordion
  $(document).on('click', '.accordion > .accordion-header', function (e) {
    jQuery(this).parent().find('.accordion-body').first().slideToggle('fast');  // apply the toggle to the first ul
    jQuery(this).parent().toggleClass('is-closed');
    e.preventDefault();
  });

});
