// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://coffeescript.org/


var go_to_form = function(form,value) {

  $("#new_form_name").val(value);

  // Handle any JS validation and related issues for @content_partial_name
  //   Call page specific JS validations & handle findings
  // If ready, go to server to take next appropriate action
  // document.forms["edit_draft_<%= @draft_id %>"].submit();

  form.submit();
}


$(document).ready(function() {
  $('.add-organization').click(function() {
    var fields = $('.organization-fields select, .organization-fields input');
    if (fields.is(":visible")) {
      // if fields are visible
      var lastIndex = parseInt($(".organization-values input").last().attr('id').split('_')[3]);

      // Display field values with other organization values
      var values = "<p>Role: " + $(fields[0]).find("option:selected").text() + " | Short Name: " + $(fields[1]).val() + " | Long Name: " + $(fields[2]).val() + "</p>"
      $('.organization-values').append(values);

      $.each(fields, function(index, field) {
        var id = $(field).attr('id');
        var name = $(field).attr('name');

        // Create a hidden field with each fields value
        var newField = $('<input>');
        $(newField).attr('type', 'hidden');
        $(newField).attr('name', name.replace("index", lastIndex+1));
        $(newField).attr('id', id.replace("index", lastIndex+1));
        $(newField).attr('value', $(field).val());
        $('.organization-values').append(newField);

        // Clear field
        $(field).val('');
      });
    } else {
      // if fields are not visible
      // show the form and done button
      $('.organization-fields').show();
      $('.cancel-add-organization').show();
      console.log('fields == 0');

      // Add required attribute back to required fields
      $.each($('#organization-required').val().split(','), function(index, value) {
        $("#"+value).prop('required',true);
      });
    }
  });

  // Hide form, and remove required fields
  $('.cancel-add-organization').click(function() {
    var fields = $('.organization-fields select, .organization-fields input');

    // Remove require from each field
    $.each(fields, function(index, field) {
      $(field).removeAttr('required');
    });

    // Hide form
    $('.organization-fields').hide();

    // Hide 'Done' button
    $(this).hide();
  });
});
