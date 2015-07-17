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
