$(document).ready(function() {
  $('#change-context').leanModal({
    top: 200,
    overlay: 0.6
  });

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
