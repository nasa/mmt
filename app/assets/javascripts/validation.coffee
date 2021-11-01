$(document).ready ->
  isMetadataForm = ->
    $('.metadata-form').length > 0

  isUmmForm = ->
    $('.umm-form').length > 0

  isUmmSForm = ->
    $('.umm-form.service-form').length > 0

  isUmmVarForm = ->
    $('.umm-form.variable-form').length > 0

  isUmmTForm = ->
    $('.umm-form.tool-form').length > 0

  getPageJson = ->
    if isMetadataForm()
      json = JSON.parse($('.metadata-form').find('input, textarea, select').filter ->
        return this.value
      .serializeJSON()).Draft
      fixCollectionKeys(json)
    else if isUmmForm()
      json = $('.umm-form').find('input, textarea, select').filter ->
        return this.value
      json = JSON.parse(json.serializeJSON())

      if isUmmSForm()
        json = json.ServiceDraft?.Draft or {}
        fixServicesKeys(json)
      else if isUmmVarForm()
        json = json.VariableDraft?.Draft or {}
        fixAvgCompressionRates(json)
      else if isUmmTForm()
        json = json.ToolDraft?.Draft or {}
        fixToolKeys(json)

    json = {} unless json?

    fixNumbers(json)
    fixIntegers(json)
    fixNestedFields(json)

    return json

  # the JQuery.serializeJSON plugin is conveniently designed to read any snake_case
  # that begins with url as URL, ie. url_content_type -> URLContentType but this is not true for
  # upcase acronyms that occur later in the string, ie. s3_credentials_api_documentation_url ->
  # S3CredentialsApiDocumentationUrl instead of S3CredentialsAPIDocumentationURL
  fixCollectionKeys = (json) ->
    # fix DirectDistributionInformation keys
    if dirDisInf = json?.DirectDistributionInformation?
      dirDisInf = json.DirectDistributionInformation
      if dirDisInf.S3CredentialsApiEndpoint?
        dirDisInf.S3CredentialsAPIEndpoint = dirDisInf.S3CredentialsApiEndpoint
        delete dirDisInf.S3CredentialsApiEndpoint
      if dirDisInf.S3CredentialsApiDocumentationUrl?
        dirDisInf.S3CredentialsAPIDocumentationURL = dirDisInf.S3CredentialsApiDocumentationUrl
        delete dirDisInf.S3CredentialsApiDocumentationUrl
    # fix AssociatedDOIs keys
    if json?.AssociatedDois
      json.AssociatedDOIs = json.AssociatedDois
      delete json.AssociatedDois
    # fix LicenseURL
    if json?.UseConstraints?.LicenseUrl?
      json.UseConstraints.LicenseURL = json.UseConstraints.LicenseUrl
      delete json.UseConstraints.LicenseUrl



  # fix keys from the serialized page json that don't match the schema
  fixServicesKeys = (json) ->
    if json?.URL?.UrlValue?
      json.URL.URLValue = json.URL.UrlValue
      delete json.URL.UrlValue
    # Operation Metadata has DataResourceDOI, CRSIdentifier, and UOMLabel
    # that need to be fixed
    if json?.OperationMetadata?
      for opData, i in json.OperationMetadata
        if opData?.CoupledResource?
          cResource = opData.CoupledResource

          if cResource.DataResourceDoi?
            cResource.DataResourceDOI = cResource.DataResourceDoi
            delete cResource.DataResourceDoi

          if cResource.DataResource?.DataResourceSpatialExtent?
            spExtent = cResource.DataResource.DataResourceSpatialExtent

            if spExtent.SpatialBoundingBox?.CrsIdentifier?
              spExtent.SpatialBoundingBox.CRSIdentifier = spExtent.SpatialBoundingBox.CrsIdentifier
              delete spExtent.SpatialBoundingBox.CrsIdentifier

            if spExtent.GeneralGrid?
              if spExtent.GeneralGrid.CrsIdentifier?
                spExtent.GeneralGrid.CRSIdentifier = spExtent.GeneralGrid.CrsIdentifier
                delete spExtent.GeneralGrid.CrsIdentifier
              if spExtent.GeneralGrid.Axis?
                for ax in spExtent.GeneralGrid.Axis
                  if ax.Extent?.UomLabel?
                    ax.Extent.UOMLabel = ax.Extent.UomLabel
                    delete ax.Extent.UomLabel

  # fix keys from the serialized page json that don't match the schema
  fixToolKeys = (json) ->
    if json?.URL?.UrlValue?
      json.URL.URLValue = json.URL.UrlValue
      delete json.URL.UrlValue
    # fix RelatedUrls to RelatedURLs
    if json?.RelatedUrls?
      json.RelatedURLs = json.RelatedUrls
      delete json.RelatedUrls

  # This fixes AvgCompressionRateASCII and AvgCompressionRateNetCDF4 in the page json
  fixAvgCompressionRates = (json) ->
    if json?.SizeEstimation?.AvgCompressionRateAscii?
      json.SizeEstimation.AvgCompressionRateASCII = json.SizeEstimation.AvgCompressionRateAscii
      delete json.SizeEstimation.AvgCompressionRateAscii
    if json?.SizeEstimation?.AvgCompressionRateNetCdf4?
      json.SizeEstimation.AvgCompressionRateNetCDF4 = json.SizeEstimation.AvgCompressionRateNetCdf4
      delete json.SizeEstimation.AvgCompressionRateNetCdf4

  # Nested non-array fields don't display validation errors because there is no form field for the top level field
  # Adding an empty object into the json changes the validation to display errors on the missing subfields
  fixNestedFields = (json) ->
    if isMetadataForm()
      json?.ProcessingLevel = {} unless json?.ProcessingLevel?
    else if isUmmSForm()
      json?.URL = {} unless json?.URL
    else if isUmmTForm()
      json?.URL = {} unless json?.URL

  fixNumbers = (json) ->
    if isMetadataForm()
      numberFields = $('.mmt-number.validate').filter ->
        this.value
    else if isUmmForm()
      numberFields = $('.validate[number="true"]').filter ->
        this.value

    for element in numberFields
      name = $(element).attr('name')
      re = /\[(.*?)\]/g
      path = []
      value = json
      while match = re.exec name
        newPath = humps.pascalize(match[1])
        if isUmmForm()
          newPath = 'AvgCompressionRateASCII' if newPath == 'AvgCompressionRateAscii'
          newPath = 'AvgCompressionRateNetCDF4' if newPath == 'AvgCompressionRateNetCdf4'

        unless newPath == 'Draft'
          value = value[newPath]
          path.push newPath

      if $.isNumeric(value)
        updateJson(json, path, parseFloat(value))

    return

  fixIntegers = (json) ->
    if isMetadataForm()
      integerFields = $('.mmt-integer.validate').filter ->
        this.value
    else if isUmmForm()
      integerFields = $('.validate[integer="true"]').filter ->
        this.value

    for element in integerFields
      name = $(element).attr('name')
      re = /\[(.*?)\]/g
      path = []
      value = json
      while match = re.exec name
        newPath = humps.pascalize(match[1])
        unless newPath == 'Draft'
          value = value[newPath]
          path.push newPath

      if $.isNumeric(value) and Math.floor(value) == +value
        updateJson(json, path, parseInt(value))

    return

  updateJson = (json, path, value) ->
    tempJson = json
    index = 0
    while index < path.length - 1
      tempJson = tempJson[path[index]]
      index++

    tempJson[path[path.length - 1]] = value
    return

  validationMessages = (error) ->
    keyword = error.keyword
    if error.title.length > 0
      field =  error.title
    else
      path = error.dataPath.split('/')
      field = path[path.length - 1]
      field = path[path.length - 2] if $.isNumeric(field)
    type = getFieldType(error.element)

    switch keyword
      when 'required' then "#{field} is required"
      when 'maxLength' then "#{field} is too long"
      when 'minLength' then "#{field} is too short"
      when 'pattern' then "#{field} must match the provided pattern"
      when 'format'
        if type == 'URI'
          "#{field} is an invalid URI"
        else
          "#{field} is an incorrect format"
      when 'minItems' then "#{field} has too few items"
      when 'maxItems' then "#{field} has too many items"
      when 'type' then "#{field} must be of type #{type}"
      when 'maximum' then "#{field} is too high"
      when 'minimum' then "#{field} is too low"
      when 'parameter-range-later' then "#{field} must be later than Parameter Range Begin"
      when 'parameter-range-larger' then "#{field} must be larger than Parameter Range Begin"
      when 'oneOf'
        # the stock message is: "should match exactly one schema in oneOf", which is not as useful to the user
        "#{field} should have one option completed"
      when 'invalidPicklist' then "#{field} #{error.message}"
      when 'enum' then "#{field} value [#{$('#' + error.id + ' option:selected').text()}] does not match a valid selection option"
      when 'anyOf'
        # the stock message is: "should match some schema in anyOf", which is not as useful to the user
        "#{field} should have one schema option completed"
      # UseConstraintsType is the only place a 'not' validation is used
      # so this is a very specific message
      when 'not' then 'License Url and License Text cannot be used together'
      # In case of Average File Size is set but no Average File Size Unit was selected
      # and also in case of Total Collection File Size and Total Collection File Size Unit,
      # we only want this simple message instead of the raw message:
      # 'should have property TotalCollectionFileSizeUnit when property TotalCollectionFileSize is present'
      when 'dependencies' then "#{field} is required"
      when 'notUnique' then "#{field} must be unique within a provider context"
      # Using an alternate keyword allows skipping some checks associated with
      # required fields that are problematic because the field is not in the schema
      # This error message should appear when a template name is not provided by the user
      when 'mustExist' then "#{field} is required"
      # These two rules are business logic not captured in the schema, but are
      # enforced in the CMR.
      when 'startAfterEnd' then "#{field} must be earlier than the #{error.pairedField}"
      when 'minGreaterThanMax' then "#{field} must be smaller than the #{error.pairedField}"
      when 'invalidValueDataType' then "Value [#{error.value}] is not a valid value for type [#{error.dataType}]."

  getFieldType = (element) ->
    classes = $(element).attr('class').split(/\s+/)
    if classes.indexOf('mmt-number') != -1 or $(element).attr('number') == 'true'
      type = 'number'
    if classes.indexOf('mmt-integer') != -1 or $(element).attr('integer') == 'true'
      type = 'integer'
    if classes.indexOf('mmt-boolean') != -1 or $(element).attr('boolean') == 'true'
      type = 'boolean'
    if classes.indexOf('mmt-date-time') != -1 or $(element).attr('date-time') == 'true'
      type = 'date-time'
    if classes.indexOf('mmt-uri') != -1 or $(element).attr('uri') == 'true'
      type = 'URI'
    if classes.indexOf('mmt-uuid') != -1 or $(element).attr('uuid') == 'true'
      type = 'uuid'
    type

  displayInlineErrors = (errors) ->
    for error in errors
      $element = $("##{error.id}")

      message = validationMessages(error)

      classes = 'eui-banner--danger validation-error'

      errorElement = $('<div/>',
        id: "#{error.id}_error"
        class: classes
        html: message
      )

      # if the error needs to be shown after the remove button
      if $element.parent().hasClass('multiple-item')
        afterElement = $element.parent().children('.remove')
      else
        afterElement = $element

      # if the error needs to be shown after the help icon
      if $element.next().hasClass('display-modal')
        afterElement = $element.next()

      # if the error needs to be shown after the select2
      if $element.next().hasClass('select2-container')
        afterElement = $element.next()

      $(errorElement).insertAfter(afterElement)

  displaySummary = (errors) ->
    # This modal is loaded on every new/edit page for templates, but not drafts
    resource_type = if $('#invalid-template-modal').length > 0 then 'template' else 'draft'
    summary = $('<div/>',
      class: 'eui-banner--danger summary-errors'
      html: "<h4><i class='fa fa-exclamation-triangle'></i> This #{resource_type} has the following errors:</h4>"
    )

    errorList = $('<ul/>', class: 'no-bullet')
    for error in errors
      message = validationMessages(error)
      listElement = $('<li/>')
      $('<a/>',
        href: "##{error.id}"
        text: message
      ).appendTo(listElement)
      $(listElement).appendTo(errorList)

    $(errorList).appendTo(summary)

    $(summary).insertAfter('.nav-top')

  getErrorDetails = (error) ->
    if error.keyword == 'additionalProperties'
      # ignore/suppress errors with keyword additionalProperties
      # since we control the forms, we should not be sending properties not
      # defined in the schema
      # these errors tend to show up when data is not fully valid and there are
      # variations in what is valid data from anyOf or oneOf characteristics
      error = null
      return
    if error.keyword == 'anyOf'
      if error.dataPath.indexOf('Geometry') != -1
        # If the error is for Geometry with keyword anyOf
        error.message = 'At least one Geometry Type is required'
      else if error.dataPath.indexOf('DataContacts') != -1
        # ignore/suppress errors with keyword anyOf for DataContacts
        # anyOf errors are showing up in the data contacts form, but only when
        # there are other validation errors. as the error messages are duplicate
        # and don't have the specificity of the other error messages (or have
        # information useful to the user), it seems best to suppress these
        # more info at https://github.com/epoberezkin/ajv/issues/201#issuecomment-222544956
        error = null
        return
      # else
      #   console.log "got a keyword `anyOf` error for #{error.dataPath}", error

    if error.schemaPath.indexOf('oneOf') != -1
      if error.dataPath.endsWith('ResolutionAndCoordinateSystem')
        # we are suppressing oneOf related errors for ResolutionAndCoordinateSystem
        # until MMT-2153 so that we can work through the most useful error messages
        # for the user
        error = null
        return

    error.dataPath += "/#{error.params.missingProperty}" if error.params.missingProperty?

    path = for p in error.dataPath.replace(/^\//, '').split('/')
      p = p.replace(/(\w)(\d)$/, '$1_$2')
      humps.decamelize(p)
    path = path.join('_')

    # Fix the path for special case keys
    path = path.replace(/u_r_ls/g, 'urls')
    path = path.replace(/u_r_l/g, 'url')
    path = path.replace(/u_r_l_content_type/g, 'url_content_type')
    path = path.replace(/d_o_i/g, 'doi')
    path = path.replace(/i_s_b_n/g, 'isbn')
    path = path.replace(/i_s_o_topic_categories/g, 'iso_topic_categories')
    path = path.replace(/data_i_d/g, 'data_id')
    path = path.replace(/c_r_s_identifier/g, 'crs_identifier')
    path = path.replace(/u_o_m_label/g, 'uom_label')
    path = path.replace(/a_s_c_i_i/g, 'ascii')
    path = path.replace(/c_d_f_4/g, 'cdf4')
    path = path.replace(/a_p_i/g, 'api')
    error.path = path

    if isMetadataForm()
      id = "draft_#{path}"
    else if isUmmSForm()
      id = "service_draft_draft_#{path}"
    else if isUmmVarForm()
      id = "variable_draft_draft_#{path}"
    else if isUmmTForm()
      id = "tool_draft_draft_#{path}"
    # remove last index from id for Roles errors
    if /roles_0$/.test(id)
      id = id.slice(0, id.length - 2)
    error.id = id
    error.element = $("##{id}")

    if error.dataPath.split('/')[error.dataPath.split('/').length - 1] == 'AllowMultipleValues'
      # Allow Multiple Values fields, under Subset, are boolean fields represented
      # by radio buttons
      # for a required error, because these are radio buttons, we want the error
      # to be surfaced with the radio parent container, which the path
      # transformation has taken care of
      if error.message == 'should be boolean'
        # html cannot hold boolean values, they are represented as string
        error = null
        return

    if error.dataPath.split('/')[error.dataPath.split('/').length - 1] == 'ValueRequired'
      # ValueRequired field is boolean field in UMM-T, represented
      # by radio buttons
      # for a required error, because these are radio buttons, we want the error
      # to be surfaced with the radio parent container, which the path
      # transformation has taken care of
      if error.message == 'should be boolean'
        # html cannot hold boolean values, they are represented as string
        error = null
        return


    # Hide individual required errors from an anyOf constraint
    # So we don't fill the form with errors that don't make sense to the user
    # Except ArchiveAndDistributionInformation has 'anyOf' constraint to the child element FileArchiveInformation and
    # FileDistributionInformation which have required field 'Format'
    if error.keyword == 'required' && error.schemaPath.indexOf('anyOf') != -1
      if error.dataPath.indexOf('ArchiveAndDistributionInformation') != -1 && error.params['missingProperty'] == 'Format'
        ; # you shall pass
      else if error.dataPath.indexOf('HorizontalDataResolution') != -1
        if error.params.missingProperty == 'Unit'
          ; # you shall pass
        else if error.id.endsWith('dimension')
          axisIndex = error.id.indexOf('_dimension') - 1
          axis = error.id[axisIndex]
          switch axis
            when 'x'
              otherDimId = error.id.replace('x_dimension', 'y_dimension')
            when 'y'
              otherDimId = error.id.replace('y_dimension', 'x_dimension')

          if error.id.indexOf('maximum') != -1
            minFieldId = error.id.replace('maximum', 'minimum')
            otherMinFieldId = otherDimId.replace('maximum', 'minimum')
            if $("##{minFieldId}").val() != ''
              # the paired Min field has a value, this is a valid error
              ; # you shall pass
            else if ($("##{otherDimId}").val() != '' || $("##{otherMinFieldId}").val() != '')
              # the other pair of Min/Max values has at least one value, and
              # since the paired Min field does not have a value, this is
              # not a valid error
              # you shall not pass
              error = null
              return
            else
              # the paired Min field has no value, and the other pair of
              # Min/Max fields have no value. So this is a valid error
              ; # you shall pass
          else if error.id.indexOf('minimum') != -1
            maxFieldId = error.id.replace('minimum', 'maximum')
            otherMaxFieldId = otherDimId.replace('minimum', 'maximum')
            if $("##{maxFieldId}").val() != ''
              # the paired Max field has a value, this is a valid error
              ; # you shall pass
            else if ($("##{otherDimId}").val() != '' || $("##{otherMaxFieldId}").val() != '')
              # the other pair of Min/Max values has at least one value, and
              # since the paired Max field does not have a value, this is
              # not a valid error
              # you shall not pass
              error = null
              return
            else
              # the paired Max field has no value, and the other pair of
              # Min/Max fields have no value. So this is a valid error
              ; # you shall pass
          else
            # the error is for XDimension or YDimension, so no Min/Max
            if $("##{otherDimId}").val() != ''
              # if the other dimension has a value, this one is no longer required
              # you shall not pass
              error = null
              return
        # else
        #   console.log "what??? another keyword `requred` with `anyOf` error??", error
      else
        # you shall not pass
        # console.log "supressing a keyword `required` relating to `anyOf` error", error
        error = null
        return

    if error.keyword == 'required' && error.dataPath == '/UseConstraints/Description'
      # this error only shows up for the Description field when there is a
      # validation error to be shown for License URL fields, when the License
      # URL radio button was selected. For this oneOf option with License URL
      # fields, Description is not required, so the validation error
      # should not be displayed
      error = null
      return
    if error.keyword == 'required' && error.dataPath == '/UseConstraints/LicenseText'
      # this error only shows up for the License Text field when there is a
      # validation error to be shown for License URL fields, when the License
      # URL radio button was selected. For this oneOf option with License URL
      # fields, License Text is not required, so the validation error
      # should not be displayed
      error = null
      return

    if id.indexOf('cdf4') >= 0
      labelFor = id
    else
      labelFor = id.replace(/(_)?\d+$/, "")

    error.title = $("label[for='#{labelFor}']").text()

    if error.title.length == 0 && error.element.closest('.multiple').hasClass('simple-multiple')
      # some Multi Item fields (arrays of simple values) in UMM-C drafts have
      # one label tied to the first field
      error.title = $("label[for='#{labelFor}_0']").text()

    error

  validateParameterRanges = (errors) ->
    if $('#additional-attributes').length > 0
      $('.multiple.additional-attributes > .multiple-item').each (index, element) ->
        type = $(element).find('.additional-attribute-type-select').val()
        if type.length > 0
          $begin = $(element).find('.parameter-range-begin')
          $end = $(element).find('.parameter-range-end')
          beginValue = $begin.val()
          endValue = $end.val()

          if beginValue.length > 0 && endValue.length > 0 && beginValue >= endValue
            largerTypes = ['INT', 'FLOAT']
            keyword = 'parameter-range-later'
            keyword = 'parameter-range-larger' if largerTypes.indexOf(type) != -1
            newError =
              keyword: keyword,
              dataPath: "/AdditionalAttributes/#{index}/ParameterRangeEnd"
              params: {}
              schemaPath: '' # these errors need this to not throw errors in getErrorDetails
            errors.push newError

  validatePicklistValues = (errors) ->
    # the mmt-fake-enum class is added to the select fields that don't have enum
    # values in the UMM Schema. Those 'real' enums can generate the errors messages
    # we need to display through schema validation. 'Fake' enums need this method to
    # generate errors
    $('select.mmt-fake-enum > option:disabled:selected, select.mmt-fake-enum > optgroup > option:disabled:selected').each ->

      id = $(this).parents('select').attr('id')
      visitField(id)

      dataPath = switch
        when /processing_level_id/.test id
          '/ProcessingLevel/Id'
        when /metadata_language/.test id
          '/MetadataLanguage'
        when /data_language/.test id
          '/DataLanguage'
        when /draft_related_urls_(\d*)_url_content_type/.test id
          [_, index] = id.match /draft_related_urls_(\d*)_url_content_type/
          "/RelatedUrls/#{index}/URLContentType"
        when /draft_related_urls_(\d*)_type/.test id
          [_, index] = id.match /draft_related_urls_(\d*)_type/
          "/RelatedUrls/#{index}/Type"
        when /draft_related_urls_(\d*)_subtype/.test id
          [_, index] = id.match /draft_related_urls_(\d*)_subtype/
          "/RelatedUrls/#{index}/Subtype"
        when /draft_related_urls_(\d*)_get_data_format/.test id
          [_, index] = id.match /draft_related_urls_(\d*)_get_data_format/
          "/RelatedUrls/#{index}/GetData/Format"
        when /draft_platforms_(\d*)_short_name/.test id
          [_, index] = id.match /platforms_(\d*)_short_name/
          "/Platforms/#{index}/ShortName"
        when /draft_projects_(\d*)_short_name/.test id
          [_, index] = id.match /projects_(\d*)_short_name/
          "/Projects/#{index}/ShortName"
        when /draft_platforms_(\d*)_instruments_(\d*)_short_name/.test id
          [_, index, index2] = id.match /platforms_(\d*)_instruments_(\d*)_short_name/
          "/Platforms/#{index}/Instruments/#{index2}/ShortName"
        when /draft_platforms_(\d*)_instruments_(\d*)_composed_of_(\d*)_short_name/.test id
          [_, index, index2, index3] = id.match /platforms_(\d*)_instruments_(\d*)_composed_of_(\d*)_short_name/
          "/Platforms/#{index}/Instruments/#{index2}/ComposedOf/#{index3}/ShortName"
        when /temporal_keywords/.test id
          '/TemporalKeywords'
        when /data_centers_\d*_short_name/.test id
          [_, index] = id.match /data_centers_(\d*)_short_name/
          "/DataCenters/#{index}/ShortName"
        when /data_centers_\d*_contact_information_addresses_\d*_country/.test id
          [_, index1, index2] = id.match /data_centers_(\d*)_contact_information_addresses_(\d*)_country/
          "/DataCenters/#{index1}/ContactInformation/Addresses/#{index2}/Country"
        when /data_centers_\d*_contact_information_addresses_\d*_state_province/.test id
          [_, index1, index2] = id.match /data_centers_(\d*)_contact_information_addresses_(\d*)_state_province/
          "/DataCenters/#{index1}/ContactInformation/Addresses/#{index2}/StateProvince"
        when /data_centers_\d*_contact_information_related_urls_\d*_url_content_type/.test id
          [_, index1, index2] = id.match /data_centers_(\d*)_contact_information_related_urls_(\d*)_url_content_type/
          "/DataCenters/#{index1}/ContactInformation/RelatedURLs/#{index2}/URLContentType"
        when /data_centers_\d*_contact_information_related_urls_\d*_type/.test id
          [_, index1, index2] = id.match /data_centers_(\d*)_contact_information_related_urls_(\d*)_type/
          "/DataCenters/#{index1}/ContactInformation/RelatedURLs/#{index2}/Type"
        when /data_centers_\d*_contact_information_related_urls_\d*_subtype/.test id
          [_, index1, index2] = id.match /data_centers_(\d*)_contact_information_related_urls_(\d*)_subtype/
          "/DataCenters/#{index1}/ContactInformation/RelatedURLs/#{index2}/Subtype"
        when /data_contacts_\d*_contact_person_data_center_short_name/.test id
          [_, index] = id.match /data_contacts_(\d*)_contact_person_data_center_short_name/
          "/DataContacts/#{index}/ContactPersonDataCenter/ShortName"
        when /data_contacts_\d*_contact_group_data_center_short_name/.test id
          [_, index] = id.match /data_contacts_(\d*)_contact_group_data_center_short_name/
          "/DataContacts/#{index}/ContactGroupDataCenter/ShortName"
        when /data_contacts_\d*_contact_person_data_center_contact_person_contact_information_addresses_\d*_country/.test id
          [_, index1, index2] = id.match /data_contacts_(\d*)_contact_person_data_center_contact_person_contact_information_addresses_(\d*)_country/
          "/DataContacts/#{index1}/ContactPersonDataCenter/ContactPerson/ContactInformation/Addresses/#{index2}/Country"
        when /data_contacts_\d*_contact_person_data_center_contact_person_contact_information_addresses_\d*_state_province/.test id
          [_, index1, index2] = id.match /data_contacts_(\d*)_contact_person_data_center_contact_person_contact_information_addresses_(\d*)_state_province/
          "/DataContacts/#{index1}/ContactPersonDataCenter/ContactPerson/ContactInformation/Addresses/#{index2}/StateProvince"
        when /data_contacts_\d*_contact_person_data_center_contact_person_contact_information_related_urls_\d*_url_content_type/.test id
          [_, index1, index2] = id.match /data_contacts_(\d*)_contact_person_data_center_contact_person_contact_information_related_urls_(\d*)_url_content_type/
          "/DataContacts/#{index1}/ContactPersonDataCenter/ContactPerson/ContactInformation/RelatedURLs/#{index2}/URLContentType"
        when /data_contacts_\d*_contact_person_data_center_contact_person_contact_information_related_urls_\d*_type/.test id
          [_, index1, index2] = id.match /data_contacts_(\d*)_contact_person_data_center_contact_person_contact_information_related_urls_(\d*)_type/
          "/DataContacts/#{index1}/ContactPersonDataCenter/ContactPerson/ContactInformation/RelatedURLs/#{index2}/Type"
        when /data_contacts_\d*_contact_person_data_center_contact_person_contact_information_related_urls_\d*_subtype/.test id
          [_, index1, index2] = id.match /data_contacts_(\d*)_contact_person_data_center_contact_person_contact_information_related_urls_(\d*)_subtype/
          "/DataContacts/#{index1}/ContactPersonDataCenter/ContactPerson/ContactInformation/RelatedURLs/#{index2}/Subtype"
        when /data_contacts_\d*_contact_group_data_center_contact_group_contact_information_addresses_\d*_country/.test id
          [_, index1, index2] = id.match /data_contacts_(\d*)_contact_group_data_center_contact_group_contact_information_addresses_(\d*)_country/
          "/DataContacts/#{index1}/ContactGroupDataCenter/ContactGroup/ContactInformation/Addresses/#{index2}/Country"
        when /data_contacts_\d*_contact_group_data_center_contact_group_contact_information_addresses_\d*_state_province/.test id
          [_, index1, index2] = id.match /data_contacts_(\d*)_contact_group_data_center_contact_group_contact_information_addresses_(\d*)_state_province/
          "/DataContacts/#{index1}/ContactGroupDataCenter/ContactGroup/ContactInformation/Addresses/#{index2}/StateProvince"
        when /data_contacts_\d*_contact_group_data_center_contact_group_contact_information_related_urls_\d*_url_content_type/.test id
          [_, index1, index2] = id.match /data_contacts_(\d*)_contact_group_data_center_contact_group_contact_information_related_urls_(\d*)_url_content_type/
          "/DataContacts/#{index1}/ContactGroupDataCenter/ContactGroup/ContactInformation/RelatedURLs/#{index2}/URLContentType"
        when /data_contacts_\d*_contact_group_data_center_contact_group_contact_information_related_urls_\d*_type/.test id
          [_, index1, index2] = id.match /data_contacts_(\d*)_contact_group_data_center_contact_group_contact_information_related_urls_(\d*)_type/
          "/DataContacts/#{index1}/ContactGroupDataCenter/ContactGroup/ContactInformation/RelatedURLs/#{index2}/Type"
        when /data_contacts_\d*_contact_group_data_center_contact_group_contact_information_related_urls_\d*_subtype/.test id
          [_, index1, index2] = id.match /data_contacts_(\d*)_contact_group_data_center_contact_group_contact_information_related_urls_(\d*)_subtype/
          "/DataContacts/#{index1}/ContactGroupDataCenter/ContactGroup/ContactInformation/RelatedURLs/#{index2}/Subtype"
        when /data_contacts_\d*_contact_person_contact_information_addresses_\d*_country/.test id
          [_, index1, index2] = id.match /data_contacts_(\d*)_contact_person_contact_information_addresses_(\d*)_country/
          "/DataContacts/#{index1}/ContactPerson/ContactInformation/Addresses/#{index2}/Country"
        when /data_contacts_\d*_contact_person_contact_information_addresses_\d*_state_province/.test id
          [_, index1, index2] = id.match /data_contacts_(\d*)_contact_person_contact_information_addresses_(\d*)_state_province/
          "/DataContacts/#{index1}/ContactPerson/ContactInformation/Addresses/#{index2}/StateProvince"
        when /data_contacts_\d*_contact_person_contact_information_related_urls_\d*_url_content_type/.test id
          [_, index1, index2] = id.match /data_contacts_(\d*)_contact_person_contact_information_related_urls_(\d*)_url_content_type/
          "/DataContacts/#{index1}/ContactPerson/ContactInformation/RelatedURLs/#{index2}/URLContentType"
        when /data_contacts_\d*_contact_person_contact_information_related_urls_\d*_type/.test id
          [_, index1, index2] = id.match /data_contacts_(\d*)_contact_person_contact_information_related_urls_(\d*)_type/
          "/DataContacts/#{index1}/ContactPerson/ContactInformation/RelatedURLs/#{index2}/Type"
        when /data_contacts_\d*_contact_person_contact_information_related_urls_\d*_subtype/.test id
          [_, index1, index2] = id.match /data_contacts_(\d*)_contact_person_contact_information_related_urls_(\d*)_subtype/
          "/DataContacts/#{index1}/ContactPerson/ContactInformation/RelatedURLs/#{index2}/Subtype"
        when /data_contacts_\d*_contact_group_contact_information_addresses_\d*_country/.test id
          [_, index1, index2] = id.match /data_contacts_(\d*)_contact_group_contact_information_addresses_(\d*)_country/
          "/DataContacts/#{index1}/ContactGroup/ContactInformation/Addresses/#{index2}/Country"
        when /data_contacts_\d*_contact_group_contact_information_addresses_\d*_state_province/.test id
          [_, index1, index2] = id.match /data_contacts_(\d*)_contact_group_contact_information_addresses_(\d*)_state_province/
          "/DataContacts/#{index1}/ContactGroup/ContactInformation/Addresses/#{index2}/StateProvince"
        when /data_contacts_\d*_contact_group_contact_information_related_urls_\d*_url_content_type/.test id
          [_, index1, index2] = id.match /data_contacts_(\d*)_contact_group_contact_information_related_urls_(\d*)_url_content_type/
          "/DataContacts/#{index1}/ContactGroup/ContactInformation/RelatedURLs/#{index2}/URLContentType"
        when /data_contacts_\d*_contact_group_contact_information_related_urls_\d*_type/.test id
          [_, index1, index2] = id.match /data_contacts_(\d*)_contact_group_contact_information_related_urls_(\d*)_type/
          "/DataContacts/#{index1}/ContactGroup/ContactInformation/RelatedURLs/#{index2}/Type"
        when /data_contacts_\d*_contact_group_contact_information_related_urls_\d*_subtype/.test id
          [_, index1, index2] = id.match /data_contacts_(\d*)_contact_group_contact_information_related_urls_(\d*)_subtype/
          "/DataContacts/#{index1}/ContactGroup/ContactInformation/RelatedURLs/#{index2}/Subtype"

      # Remove required error from the same dataPath
      errors = errors.filter (error) ->
        if error.keyword == 'required'
          dataPath.indexOf(error.dataPath) != -1
        else
          true

      error = {}
      error.keyword = 'invalidPicklist'
      error.message = "value [#{$(this).val()}] does not match a valid selection option"
      error.params = {}
      error.dataPath = dataPath
      error.schemaPath = '' # these errors need this to not throw errors in getErrorDetails
      errors.push error

    # combine TemporalKeywords invalidPicklist errors if more than one exist
    # find TemporalKeywords errors
    temporalKeywordErrors = errors.filter (error) ->
      error.dataPath == '/TemporalKeywords'

    if temporalKeywordErrors.length > 1
      # get all other errors
      errors = errors.filter (error) ->
        error.dataPath != '/TemporalKeywords'

      # combine temporalKeywordErrors into 1 error
      values = []
      for error in temporalKeywordErrors
        [_, value] = error.message.match /\[(.*)\]/
        values.push value

      newError = {}
      newError.keyword = 'invalidPicklist'
      newError.message = "values [#{values.join(', ')}] do not match a valid selection option"
      newError.params = {}
      newError.dataPath = '/TemporalKeywords'
      newError.schemaPath = '' # these errors need this to not throw errors in getErrorDetails
      errors.push newError

    errors

  addIfNotAlready = (errorArray, newError) ->
    exist = false
    for error in errorArray
      if error.id == newError.id && error.keyword == newError.keyword
        exist = true
    if !exist && $("##{newError.id}").length > 0
      errorArray.push newError
    errorArray

  validatePage = (opts) ->
    $('.validation-error').remove()
    $('.summary-errors').remove()

    # Remove the disabled attribute from fields before we read data in
    # This allows invalid picklist options to be read in so the correct
    # error message is displayed
    disabledFields = $(':disabled').removeAttr('disabled')

    json = getPageJson()

    # put the disabled attribute back in
    disabledFields.attr('disabled', true)

    ajv = Ajv
      allErrors: true,
      jsonPointers: true,
      formats: 'uri' : URI_REGEX
    validate = ajv.compile(globalJsonSchema)
    validate(json)

    # adding validation for Data Contacts form with separate schema as it
    # does not follow UMM schema structure in the form
    # Data Contacts Schema is only passed on the data contacts form
    # validateDataContacts = ajv.compile(globalDataContactsFormSchema)
    if globalDataContactsFormSchema?
      validate = ajv.compile(globalDataContactsFormSchema)
      validate(json)

    errors = if validate.errors? then validate.errors else []
    # console.log 'errors! ', JSON.stringify(errors)

    validateParameterRanges(errors)
    errors = validatePicklistValues(errors)
    template_error = validateTemplateName(errors)
    validatePairedFields(errors)
    validateAdditionalAttributeValueField(errors)
    validatePotentialActionUrlTemplate(json, errors)

    inlineErrors = []
    summaryErrors = []

    # Display errors, from visited fields
    for error, index in errors
      if error = getErrorDetails(error)
        # does the error id match the visitedFields
        visited = visitedFields.filter (e) ->
          return e == error.id
        .length > 0

        if (visited or opts.showConfirm) and inlineErrors.indexOf(error) == -1
          # don't duplicate errors

          if error.id.match(/^draft_archive_and_distribution_information_/i) || error.id.match(/^draft_spatial_extent_horizontal_spatial_domain_resolution_and_coordinate_system_/)
            # Because ArchiveAndDistributionInformation has 'anyOf' child elements,
            # errors from the schema validator can be duplicated, so add an error to
            # the error arrays only if it is not already there
            addIfNotAlready(inlineErrors, error)
            addIfNotAlready(summaryErrors, error)
          else
            inlineErrors.push error if $("##{error.id}").length > 0
            summaryErrors.push error if $("##{error.id}").length > 0

    if inlineErrors.length > 0 and opts.showInline
      displayInlineErrors inlineErrors
    if summaryErrors.length > 0 and opts.showSummary
      displaySummary summaryErrors
    if opts.showConfirm
      # 'visit' any invalid fields so they don't forget about their error
      for error in inlineErrors
        visitField(error.id)

    valid = summaryErrors.length == 0

    if template_error and opts.showConfirm
      $('#display-invalid-template-modal').click()
      $('#invalid-draft-deny').hide()
      $('#invalid-draft-accept').hide()
      return false
    else if !valid and opts.showConfirm
      # click on link to open modal
      $('#display-invalid-draft-modal').click()
      $('#invalid-draft-deny').show()
      $('#invalid-draft-accept').show()
      return false

    valid

  # Some of the fields are numerical and others are not. The dates that are
  # being validated here have rigid structures and can be validated as strings.
  # The tiling identification systems coordinates, however need to be converted
  # to numbers in order to be properly compared.
  pairedFieldComparison = (lesser, greater) ->
    if isNaN(lesser) && isNaN(greater)
      return lesser > greater
    else if !isNaN(lesser) && !isNaN(greater)
      return parseFloat(lesser) > parseFloat(greater)
    else
      return false

  # These errors are not captured in the schema, they are business logic being
  # enforced in the CMR. Since we cannot publish records with these conditions,
  # we should provide that feedback to the user.
  validatePairedFields = (errors) ->
    # if we are on the page with one of the paired fields...
    parent = $('#temporal-extents, #projects, #tiling-identification-system')
    if parent.length > 0
      # for each lesser pair tag, we should expect a greater pair tag...
      parent.find('.lesser-pair').each ->
        greaterPair = $(this).closest('.parent-pair').find('.greater-pair')
        # if both the lesser and greater have values and the lesser is larger
        # then there is an error
        if $(this).val() && greaterPair.val() && pairedFieldComparison($(this).val(), greaterPair.val())
          id = $(this).attr('id')
          # Populate the dataPath, pairedField, and keyword from the specific
          # case we are in.
          [dataPath, pairedField, keyword] = switch
            when /draft_temporal_extents_(\d*)_range_date_times_(\d*)_beginning_date_time/.test id
              [_, index1, index2] = id.match /temporal_extents_(\d*)_range_date_times_(\d*)_beginning_date_time/
              ["/TemporalExtents/#{index1}/RangeDateTimes/#{index2}/BeginningDateTime", 'Ending Date Time', 'startAfterEnd']
            when /draft_projects_(\d*)_start_date/.test id
              [_, index] = id.match /projects_(\d*)_start_date/
              ["/Projects/#{index}/StartDate", 'End Date', 'startAfterEnd']
            when /draft_tiling_identification_systems_(\d*)_coordinate_(\d*)_minimum_value/.test id
              [_, index, coordinate] = id.match /tiling_identification_systems_(\d*)_coordinate_(\d*)_minimum_value/
              ["/TilingIdentificationSystems/#{index}/Coordinate#{coordinate}/MinimumValue", 'Maximum Value', 'minGreaterThanMax']

          # The other errors which are likely to occur here are required errors
          # (which means we shouldn't be here because it is blank), and format
          # errors. We don't need to tell the user about this error if they are
          # not entering data in the right format (e.g. NaN or NaDate)
          unless errors.filter( (error) -> error.dataPath == dataPath).length > 0
            error =
              keyword: keyword
              dataPath: dataPath
              schemaPath: '' # necessary to not throw errors in getErrorDetails
              params: {}
              pairedField: pairedField

            errors.push(error)

  # These errors are not captured in the schema, they are business logic being
  # enforced in the CMR. Since we cannot publish records with these conditions,
  # we should provide that feedback to the user. Specifically, in the
  # Additional Attribute the Value supplied by the user needs to conform to the
  # Data Type the user selects. The checks in the errorPresent block are meant
  # to APPROXIMATE those of CMR ingestion with the intention that there are
  # likely some input values that the below logic will permit, and CMR will not,
  # but never vice versa.
  validateAdditionalAttributeValueField = (errors) ->

    if $('#draft_additional_attributes').length > 0
      floatRegex = new RegExp floatRegexString
      intRegex = new RegExp intRegexString
      boolRegex = new RegExp boolRegexString
      dateRegex = new RegExp dateRegexString
      timeRegex = new RegExp timeRegexString
      dateTimeRegex = new RegExp dateTimeRegexString

      $('#draft_additional_attributes').children('.multiple-item').each (index, element) ->
        dataType = $("#draft_additional_attributes_#{index}_data_type").val()
        value = $("#draft_additional_attributes_#{index}_value").val().trim()

        # if either dataType or value are empty move on to the next AdditionalAttribute
        return if !dataType || !value

        errorNotPresent = switch dataType
          when 'FLOAT' then floatRegex.test value
          when 'INT' then intRegex.test value
          when 'BOOLEAN' then boolRegex.test value
          when 'DATE' then dateRegex.test value
          when 'TIME' then timeRegex.test value
          when 'DATETIME' then dateTimeRegex.test value
          else true
          # there is no logic for 'STRING', 'DATE_STRING', 'TIME_STRING', or
          # 'DATETIME_STRING' because CMR will ingest anything for these fields

        unless errorNotPresent
          error =
            keyword: 'invalidValueDataType'
            dataPath: "AdditionalAttributes/#{index}/Value"
            schemaPath: '' # necessary to not throw errors in getErrorDetails
            params: {}
            value: value
            dataType: dataType

          errors.push(error)

  validatePotentialActionUrlTemplate = (json, errors) ->
    # This method is added as part of ticket https://bugs.earthdata.nasa.gov/browse/MMT-2714
    # Source of following regular expression is https://regex101.com/r/DstcXC/1/
    # which is pointed from https://stackoverflow.com/questions/29494608/regex-for-uri-templates-rfc-6570-wanted
    # This method should be removed after the regex is added to the umm-t schema.
    # Ticket for adding regex to umm-t schema is https://bugs.earthdata.nasa.gov/browse/ECSE-1117
    URI_TEMPLATE_REGEX = /^([^\x00-\x20\x7f"'%<>\\^`{|}]|%[0-9A-Fa-f]{2}|{[+#./;?&=,!@|]?((\w|%[0-9A-Fa-f]{2})(\.?(\w|%[0-9A-Fa-f]{2}))*(:[1-9]\d{0,3}|\*)?)(,((\w|%[0-9A-Fa-f]{2})(\.?(\w|%[0-9A-Fa-f]{2}))*(:[1-9]\d{0,3}|\*)?))*})*$/
    urlTemplateContent = json.PotentialAction?.Target?.UrlTemplate
    if urlTemplateContent? && ! URI_TEMPLATE_REGEX.test(urlTemplateContent)
      error =
        id: 'draft_url_template'
        title: 'Draft Url Template'
        params: {}
        dataPath: '/PotentialAction/Target/UrlTemplate'
        keyword: 'format'
        schemaPath: '' # necessary to not throw errors in getErrorDetails
      errors.push(error)

  validateTemplateName = (errors) ->
    if $('#draft_template_name').length > 0
      error = null
      if $('#draft_template_name').val().length == 0
        error =
          id: 'draft_template_name'
          title: 'Draft Template Name'
          params: {}
          dataPath: '/TemplateName'
          keyword: 'mustExist'
          schemaPath: '' # these errors need this to not throw errors in getErrorDetails
      else if globalTemplateNames.indexOf($('#draft_template_name').val()) isnt -1
        error =
          id: 'draft_template_name'
          title: 'Draft Template Name'
          params: {}
          dataPath: '/TemplateName'
          keyword: 'notUnique'
          schemaPath: '' # these errors need this to not throw errors in getErrorDetails
      if error
        errors.push(error)
        return true
    false

  # Stores the page's visited fields
  visitedFields = []

  visitField = (field_id) ->
    # If anything in UseConstraints shows up, 'visit' draft_use_constraints
    # so the 'not' validation will show up before clicking
    # submit (which 'visits' everything)
    if field_id.indexOf('draft_use_constraints') == 0
      visitedFields.push 'draft_use_constraints' unless visitedFields.indexOf('draft_use_constraints') != -1

    visitedFields.push field_id unless visitedFields.indexOf(field_id) != -1

    if field_id.match /^variable_draft_draft_index_ranges_lat_range_/i
      latRangeParentId = 'variable_draft_draft_index_ranges_lat_range'
      visitedFields.push latRangeParentId unless visitedFields.indexOf(latRangeParentId) != -1

    if field_id.match /^variable_draft_draft_index_ranges_lon_range_/i
      lonRangeParentId = 'variable_draft_draft_index_ranges_lon_range'
      visitedFields.push lonRangeParentId unless visitedFields.indexOf(lonRangeParentId) != -1

  validateFromFormChange = ->
    validatePage
      showInline: true
      showSummary: true
      showConfirm: false

  validateForNavigation = ->
    validatePage
      showInline: true
      showSummary: true
      showConfirm: true

  # Validate the whole page on page load
  if $('.metadata-form, .umm-form').length > 0
    # under what conditions are model errors shown? I am not able to locate any
    # code that seems to display the model errors. Can this chunk be removed?
    # Do not display validation errors on page load if model errors are showing
    if $('.model-errors').length == 0
      # "visit" each field with a value on page load
      $('.validate').not(':disabled').filter ->
        return switch this.type
          when 'radio'
            # don't want to save fields that aren't translated into metadata
            this.name? and this.checked
          else
            this.value
      .each (index, element) ->
        visitField($(element).attr('id'))

      validateFromFormChange()

      # For collection drafts only (b/c implemented as part of the progressive update feature MMT-2660),
      # Validate a specific field or fieldset on load, if the user has visited it directly
    if isMetadataForm()
      # if url has a hash, user clicked on a specific field or progress circle
      # we should visit the field (or nested fields) to show the user any issue
      # with the field since they have chosen to visit the field directly,
      # presumably the user wants to fill in or correct any issue with that field
      if (window.location.hash)
        targetFieldId = window.location.hash.substring(1)

        # links to collection information top level fields have a '_label' suffix
        # and already have the 'draft_' prefix
        targetFieldId = targetFieldId.replace('_label', '') if targetFieldId.endsWith('_label')

        targetField = $("##{targetFieldId}")
        if targetField.is('input, select, textarea')
          visitField(targetFieldId)
        else
          # target is a fieldset or top level field (collection information top level fields are caught as described above)
          # we need to add the 'draft_' prefix and convert to snake_case for any
          # potential error to match the field
          visitField("draft_#{targetFieldId.replace('-', '_')}")

          # for fieldsets we want to visit the nested fields for validation also
          # in-line validation errors for some fields may not appear if there is
          # no data entered in the related fields, as the containing data object
          # is therefore not technically invalid
          targetField.find('input, select, textarea').each (index, element) ->
            visitField($(element).attr('id'))

        validateFromFormChange()

  # // set up validation call
  $('.metadata-form, .umm-form').on 'blur', '.validate', ->
    visitField($(this).attr('id'))
    # if the field is a datepicker, and the datepicker is still open, don't validate yet
    return if $(this).attr('type') == 'custom-datetime' and $('.datepicker:visible').length > 0
    validateFromFormChange()

  # 'blur' functionality for select2 fields
  $('.metadata-form .select2-select, .umm-form .select2-select').on 'select2:open', (event) ->
    visitField($(this).attr('id'))

  $('.metadata-form, .umm-form').on 'click', '.remove', ->
    validateFromFormChange()

  $('.metadata-form, .umm-form').find('input[type="radio"], select').not('.next-section, .jump-to-section').on 'change', ->
    validateFromFormChange()

  $(document).on 'mmtValidate', ->
    validateFromFormChange()

  $('.metadata-form .next-section').on 'change', ->
    $('#new_form_name').val(this.value)

    if validateForNavigation()
      $('.metadata-form').submit()

  $('.umm-form .jump-to-section').on 'change', ->
    $('.jump-to-section').val($(this).val())

    if validateForNavigation()
      $('.umm-form').submit()

  $('.metadata-form .save-form, .umm-form .save-form').on 'click', (e) ->
    $('#commit').val($(this).val())

    return validateForNavigation()

  # Handle modal 'Yes', submit form
  $('#invalid-draft-accept').on 'click', ->
    $('.metadata-form, .umm-form').submit()

  # If a user clicks on Save/Done, then jump_to_section, #commit needs to be cleared
  # Handle modal 'No'
  $('#invalid-draft-deny').on 'click', ->
    $('#commit').val('')

  # would be nice to add an explanation or cite source of the regex
  URI_REGEX = /^(?:[A-Za-z][A-Za-z0-9+\-.]*:(?:\/\/(?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:]|%[0-9A-Fa-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\.[A-Za-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Za-z0-9\-._~!$&'()*+,;=]|%[0-9A-Fa-f]{2})*)(?::[0-9]*)?(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|\/(?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?|(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|)(?:\?(?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*)?(?:\#(?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*)?|(?:\/\/(?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:]|%[0-9A-Fa-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\.[A-Za-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Za-z0-9\-._~!$&'()*+,;=]|%[0-9A-Fa-f]{2})*)(?::[0-9]*)?(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|\/(?:(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?|(?:[A-Za-z0-9\-._~!$&'()*+,;=@]|%[0-9A-Fa-f]{2})+(?:\/(?:[A-Za-z0-9\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*|)(?:\?(?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*)?(?:\#(?:[A-Za-z0-9\-._~!$&'()*+,;=:@\/?]|%[0-9A-Fa-f]{2})*)?)$/
