$(document).ready(function() {

  // Open accordion based on URL hash
  if(window.location.hash) {
    var hash = window.location.hash.substring(1);
    var $body = $(document.getElementById(hash)).find('.accordion-body').first();
    if ($body.parent().hasClass('accordion')) {
      $body.slideToggle('fast', function() {
        $(this).parent().toggleClass('is-closed');
        $('html, body').animate({
          scrollTop: $(this).parent().offset().top
        }, 500);
      });
    }
  }

  // Accordion
  $(document).on('click', '.accordion > .accordion-header', function (e) {
    jQuery(this).parent().find('.accordion-body').first().slideToggle('fast');  // apply the toggle to the first ul
    jQuery(this).parent().toggleClass('is-closed');
    e.preventDefault();
  });
});
