@generatedVariables = window.generatedVariables

$(document).ready ->

  # event to change the variable modal json content
  setVariableModalTextChangeEvent = () ->
    $('.variable-preview-modal-link').on 'click', (element) ->
      variable = $(element.target).data('variable')
      title = "<strong>Generated Variable Record:</strong> #{variable.Name}"
      pretty_variable_text = JSON.stringify(variable, null, 2)

      # Set the title and variable json
      $('#variable-preview-modal .title').html(title)
      $('#variable-preview-modal .variable-json').text(pretty_variable_text)

  variableTableBodyTemplate = (variablesToLoad) ->
    results = ''

    for variable in variablesToLoad
      row = $('<tr/>')
      nameCell = $('<td/>')
      $('<a/>',
        href: '#variable-preview-modal'
        class: 'display-modal variable-preview-modal-link'
        text: variable.Name
        'data-variable': JSON.stringify(variable)
      ).appendTo(nameCell)
      longNameCell = $('<td/>').text(variable.LongName)

      row.append(nameCell)
      row.append(longNameCell)
      # debugger
      results += '<tr>' + row.html() + '</tr>'

    results

  calculatePageResults = (currentPage, totalPage, totalNumber) ->
    pageSize = 25
    startNum = 1 + ((currentPage - 1) * pageSize)
    endNum = if currentPage < totalPage then (currentPage * pageSize) else totalNumber
    "#{startNum} - #{endNum}"

  if $('#uvg-results-table').length > 0
    # set modal event listeners first, in case they are populated without the paginator
    setVariableModalTextChangeEvent()

    # adding paginated variablees to the table
    $('#uvg-pagination').pagination(
      dataSource: generatedVariables
      pageSize: 25
      prevText: '<i class="eui-icon eui-fa-chevron-circle-left"></i> Previous'
      autoHidePrevious: true
      nextText: 'Next <i class="eui-icon eui-fa-chevron-circle-right"></i>'
      autoHideNext: true
      ulClassName: 'eui-pagination'
      activeClassName: 'active-page'
      hideWhenLessThanOnePage: true
      header: (currentPage, totalPage, totalNumber) ->
        text = "Showing Generated Variables <b>#{calculatePageResults(currentPage, totalPage, totalNumber)}</b> of <b>#{totalNumber}</b>"
        $('.uvg-pagination-header').html(text)
        null

      callback: (data, pagination) ->
        # make variable data ready to add to the table
        bodyContents = variableTableBodyTemplate(data)
        $('#uvg-results-table > tbody').html(bodyContents)

        # set modal event listeners
        $('.display-modal').leanModal
          top: 200
          overlay: 0.6
          closeButton: '.modal-close'
        setVariableModalTextChangeEvent()
    )
