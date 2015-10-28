$(document).ready(function() {
  $('.banner-dismissible').on('click', 'a.close', function() {
    $(this).parents('.banner').remove();
  });
});
