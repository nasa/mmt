@generatedVariables = window.generatedVariables

$(document).ready ->
  $('.variable-preview-modal-link').on 'click', (element) ->
    variable = $(element.target).data('variable')
    title = "<strong>Generated Variable Record:</strong> #{variable.Name}"
    pretty_variable_text = JSON.stringify(variable, null, 2)

    # Set the title and variable json
    $('#variable-preview-modal .title').html(title)
    $('#variable-preview-modal .variable-json').text(pretty_variable_text)
