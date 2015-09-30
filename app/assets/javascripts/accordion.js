$(document).ready(function() {

  // Accordion
  $(document).on('click', '.accordion > .accordion-header', function (e) {
    jQuery(this).parent().find('.accordion-body').slideToggle('fast');  // apply the toggle to the ul
    jQuery(this).parent().toggleClass('is-closed');
    e.preventDefault();
  });

});
