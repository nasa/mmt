$(document).ready(function() {

  $('#select-provider').on('change', function() {
    if (this.value !== '') {
      window.location.href = '/set_provider?provider_id=' + this.value;
    }
  });

  $('.refresh-providers').on('click', function() {
    $(this).hide();
    $('.loading').show();
  });

});
