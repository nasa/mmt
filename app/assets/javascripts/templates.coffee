$(document).ready ->
  # Hides or shows the template name select box on manage_collections page.
  $('.draft-base-select').on 'click', (e) ->
    $(this).parents('.make-draft-radio').find('input').not("##{$(this).attr('id')}").prop 'checked', false

    switch($(this).val())
      when 'blank'
        $('.template-select').hide()
        $('.upload-json-form').hide()
        $('#submit-btn').show()
      when 'template'
        $('.template-select').show()
        $('.upload-json-form').hide()
        $('#submit-btn').show()
      when 'upload'
        $('.upload-json-form').show()
        $('#submit-btn').hide()
        $('.template-select').hide()

  # When the user clicks on 'Download JSON' this function disables the download link
  $('#download_json_link').on 'click', (e) ->
    $(this).addClass('disabled')
    $(this).bind('click',false)

  # When the user click on "Download JSON" from the table, this fucntion disables the download link for that clicked row
  $("td.download_json_link").on 'click', (e) ->
    $(this).addClass('disabled')
    $(this).bind('click',false)

  # When the user clicks on the save as template link, click the invisible button
  # to submit the form and change pages
  $('#save_as_template_link').on 'click', () ->
    $('#template_new_from_existing_button').click()
