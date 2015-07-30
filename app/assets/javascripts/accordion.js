$(document).ready(function() {

  // Accordion
  $('.accordion').on('click', '.accordion-header', function (e) {
    jQuery(this).parent().find('.accordion-body').slideToggle('fast');  // apply the toggle to the ul
    jQuery(this).parent().toggleClass('is-closed');
    jQuery(this).find("i.chevron-toggle").toggleClass("closed");
    e.preventDefault();
  });

});
