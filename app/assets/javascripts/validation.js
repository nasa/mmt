var validate = null; // Validate object is null until handleFieldValidation needs it

// Return an array of all the path element strings
function getObjPathArray(obj) {
  var objPathArray = obj.attr('name').replace(/]/g, '').split('[').reverse();
  objPathArray.pop(); // Removes "Draft", the last element of the array

  for (i=0; i<objPathArray.length; i++) {
    if (objPathArray[i].length > 0) {
      objPathArray[i] = snakeToCamel(objPathArray[i]);
    }
  }
  return objPathArray;
}

// Build json for this object and all its ancestors
function buildJsonToValidate(obj, objPathArray) {
  var schema = {};
  schema[objPathArray[0]] = obj.val();

  for (i=1; i<objPathArray.length; i++) {
    // TODO - find more efficient way of adding outer layers of json to a json object
    var oldSchema = JSON.parse(JSON.stringify(schema)); // clone the json before adding it
    schema = {};
    if (objPathArray[i].match(/^[0-9]+$/) == null) {
      schema[objPathArray[i]] = oldSchema;
    }
    else { // handle arrays
      schema = [oldSchema];
    }
  }
  return schema;
}

// Return just the errors that are relevant to this obj
function collectRelevantErrors(obj, objPathArray, errors) {

  var relevantErrors = [];

  for (var i=0; i<errors.length; i++) {
    //alert('Checking ' + errors[i].path + ' for ' + objPathArray[0] + ' Finding ' + errors[i].path.indexOf(objPathArray[0]));
    if (errors[i].path.indexOf(objPathArray[0]) > -1)
      relevantErrors.push(errors[i]);
  }
  return relevantErrors;
}


function handleFieldValidation(obj) {

  //try {

    // Get the path array of the obj here because it will be used in multiple places
    var objPathArray = getObjPathArray(obj);

    // Build the json to send to validate
    var json_to_validate = buildJsonToValidate(obj, objPathArray);

    //if (!validate) {
      validate = jsen(globalJsonSchema, {greedy: true});
    //}


    var valid = validate(json_to_validate); // Generate a valid json object here from field value(s)

    if (valid === false) {

      // Remove previous inline error display element (if any)
      var objId = obj.attr('id');
      var errorDisplayName = objId + '_errors';
      var errorDisplay = document.getElementById(errorDisplayName);
      if (errorDisplay) {
        errorDisplay.parentNode.removeChild(errorDisplay);
      }

      // Remove errors that do not apply
      var errorArray = collectRelevantErrors(obj, objPathArray, validate.errors);

      // Display new error element under obj
      if (errorArray.length > 0) {
        var newElement = '<div id="' + errorDisplayName + '" class="banner banner-danger error-display"><i class="fa fa-exclamation-triangle"></i>';
        for(i=0; i<errorArray.length; i++) {
          error = errorArray[i];
          newElement += 'Path = "' + error.path + '" Keyword = "' + error.keyword + '"' + '.</br>';
        }
        newElement += '</div>';
        $(newElement).insertAfter('#' + objId);
      }
      console.log(errorArray);
    }
  //} catch (e) {
  //  console.log(e);
  //}

  return null;

}


function snakeToCamel(str){
  var newStr = str.replace(/(\_\w)/g, function(m){return m[1].toUpperCase();});
  newStr = newStr[0].toUpperCase() + newStr.slice(1);
  return newStr;
}

