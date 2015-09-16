function buildJsonToValidate(obj) {
  return ({EntryId: obj.val()});
}

function collectRelevantErrors(obj, errors) {
  return errors;
}

var validate = null; // Validate object is null until handleFieldValidation needs it

function handleFieldValidation(obj) {

  try {

    // Build the json to send to validate
    var json_to_validate = buildJsonToValidate(obj);

    if (!validate) {
      validate = jsen(globalJsonSchema, {greedy: true});
    }


    var valid = validate(json_to_validate); // Generate a valid json object here from field value(s)

    if (valid === false) {

      // Erase previous error display for this field
      var objId = obj.attr('id');
      var errorDisplayName = objId + '_errors';

      // Remove previous inline error display element (if any)
      var errorDisplay = document.getElementById(errorDisplayName);
      if (errorDisplay) {
        errorDisplay.parentNode.removeChild(errorDisplay);
      }

      // Remove errors that do not apply
      var errorArray = collectRelevantErrors(obj, validate.errors);


      // Display new error element under obj
      if (errorArray.length > 0) {
        var newElement = '<div id="' + errorDisplayName + '" class="banner banner-danger error-display"><i class="fa fa-exclamation-triangle"></i>';
        for(i=0; i<errorArray.length; i++) {
          error = errorArray[i];
          newElement += 'Path = "' + error.path + '" Keyword = "' + error.keyword+ '"' + '.</br>';
        }
        newElement += '</div>';
        $(newElement).insertAfter('#' + objId);
      }
      console.log(errorArray);
    }
  } catch (e) {
    console.log(e);
  }

  return null;

}


