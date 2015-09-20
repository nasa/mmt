function createUserValidationMessage(error, messageType) {
  var errorKeyword = error['keyword'];
  var errorPath = error['path'];
  var errorObj = error['obj'];

  // Get the name of the object into presentable form
  var objName = '';
  if (messageType === 'summary') {
    var pathArray = errorPath.split('.');
    if (pathArray[pathArray.length - 1].match(/^[0-9]+$/)) {// Is an array index. Don't use for name
      pathArray.pop();
    }
    objName = pathArray[pathArray.length - 1].replace( /([A-Z])/g, " $1" ) + ': '; // Camel case to title
  }

  // Create options to pass in depending on error type
  var option = null;
  if (errorKeyword === 'type') {
    option = 'string';
    if (errorObj.hasClass('mmt-number')) {
      option = 'number';
    }
    else if (errorObj.hasClass('mmt-integer')) {
      option = 'integer';
    }
    else if (errorObj.hasClass('mmt-boolean')) {
      option = 'boolean';
    }
  }

  var message = translateValidationMessage(errorKeyword, [option]);

  return objName + message;
}

// Note - portions of this file were derived from the work found here: https://github.com/josdejong/jsoneditor/

function translateValidationMessage (key, variables) {
  var lang = englishValidationMessages;
  var string = lang[key];

  if(typeof string === "undefined")
    string = "Unknown error string: " + key;

  if(variables) {
    for(var i=0; i<variables.length; i++) {
      string = string.replace(new RegExp('\\{\\{'+i+'}}','g'),variables[i]);
    }
  }

  return string;
}

var englishValidationMessages = {
  required: 'Value required',
  type: 'Value must be of type {{0}}',
  anyOf: 'Value must validate against at least one of the provided schemas',
  not: 'Value must not validate against the provided schema',
  additionalItems: 'No additional items allowed in this array',
  uniqueItems: 'Array must have unique items',

  enum: 'This is not one of the allowed values',
  exclusiveMaximum: 'Value is too high',
  maximum: 'Value is too high',
  exclusiveMinimum: 'Value is too low',
  minimum: 'Value is too low',
  multipleOf: 'Value must be a multiple of a given number',
  maxLength: 'Value is too long',
  minLength: 'Value is too short',
  pattern: 'Value must match the provided pattern',
  format: 'Value must match the provided pattern',
  minItems: 'Value has too few items',
  maxItems: 'Value has too many items',
  //maxProperties: 'Object must have at most {{0}} properties',
  //minProperties: 'Object must have at least {{0}} properties',
  //additionalProperties: 'No additional properties allowed, but property "{{0}}" is set',
  //dependencies: 'Must have property "{{0}}"',
  oneOf: 'Value must validate against exactly one of the provided schemas',
  date_time: 'This is not a valid RFC3339 date-time. Needs to look like "2015-08-01T00:00:00Z"'

  //enum: '"{{0}}" is not one of the allowed values',
  //exclusiveMaximum: 'Value must be less than {{0}}',
  //maximum: 'Value must at most {{0}}',
  //exclusiveMinimum: 'Value must be greater than {{0}}',
  //minimum: 'Value must be at least {{0}}',
  //multipleOf: 'Value must be a multiple of {{0}}',
  //maxLength: 'Value must be at most {{0}} characters long',
  //minLength: 'Value must be at least {{0}} characters long',
  //pattern: 'Value must match the provided pattern of "{{0}}"',
  //format: 'Value must match the provided pattern of "{{0}}"',
  //minItems: 'Value must have at least {{0}} items',
  //maxItems: 'Value must have at most {{0}} items',
  //maxProperties: 'Object must have at most {{0}} properties',
  //minProperties: 'Object must have at least {{0}} properties',
  //additionalProperties: 'No additional properties allowed, but property "{{0}}" is set',
  //dependencies: 'Must have property "{{0}}"',
  //oneOf: 'Value must validate against exactly one of the provided schemas. It currently validates against {{0}} of the schemas',
  //date_time: '"{{0}}" is not a valid RFC3339 date-time. Needs to look like "2015-08-01T00:00:00Z"'
};

function buildJsonForPage() {
  var jsonForPage = {};
  $('.validate').each(function( index ) {
    if ($(this).val().length !== 0) { // skip fields that are empty
      // Get the path of this
      var thisPathArray = getObjPathArray($(this));
      // Build the json for this, given its pathArray
      var jsonForThis = buildJsonToValidate($(this), thisPathArray);
      // Add this's path to jsonForPage
      jsonForPage = $.extend(true, jsonForPage, jsonForThis);
    }
  });
  return jsonForPage;
}

// Given an error path value (i.e. 'X.Y.1.CamelCase'), figure out what the obj id should be
function pathToObjId(path) {
  var objId = 'draft.' + path;
  // Camel to snake
  objId = objId.replace(/\UUID/g, 'Uuid');
  objId = objId.replace(/\URL/g, 'Url');
  objId = objId.replace(/\ISBN/g, 'Isbn');
  objId = objId.replace(/\DOI/g, 'Doi');
  objId = objId.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
  objId = objId.replace(/\._/g, '_');
  objId = objId.replace(/\./g, '_');
  return objId;
}

function errorRequiresSpecialHandling (error) {
  if (error['keyword'] === 'oneOf')
    return true;

  if (
    error['path'] === "MetadataLineagesDatesResponsibilitiesPartyRelatedUrlsURLs" ||
    error['path'] === "MetadataLineagesDatesResponsibilities" ||
    error['path'] === "DataDates" ||
    error['path'] === "OrganizationsPartyRelatedUrlsURLs" ||
    error['path'] === "Organizations" ||
    error['path'] === "PersonnelPartyRelatedUrlsURLs" ||
    error['path'] === "Personnel" ||
    error['path'] === "CollectionCitationsRelatedUrlsURLs" ||  // CC array
    error['path'] === "PublicationReferencesRelatedUrlsURLs" ||
    error['path'] === "RelatedUrlsURLs" ||
    error['path'] === "RelatedUrls" ||

    error['path'] === "ScienceKeywords" ||

    error['path'] === "TemporalExtentsRangeDateTimes" ||
    error['path'] === "TemporalExtentsSingleDateTimes" ||
    error['path'] === "TemporalExtentsPeriodicDateTimes" ||
    error['path'] === "TemporalExtents" ||

    error['path'] === "SpatialExtentHorizontalSpatialDomainGeometryGPolygonsExclusiveZoneBoundariesPoints" ||
    error['path'] === "SpatialExtentHorizontalSpatialDomainGeometryGPolygonsExclusiveZoneBoundaries" ||
    error['path'] === "SpatialExtentHorizontalSpatialDomainGeometryLinesPoints" ||
    error['path'] === "SpatialExtentHorizontalSpatialDomainGeometryGPolygonsBoundaryPoints" ||
    error['path'] === "SpatialKeywords" ||

    error['path'] === "PlatformsInstruments" ||
    error['path'] === "Platforms" ||

  )
    return true;

  return false;
}

function handleFormValidation(updateSummaryErrors, updateInlineErrors) {

  var jsonForPage = buildJsonForPage();
  var validate = jsen(globalJsonSchema, {greedy: true});
  var valid = validate(jsonForPage);

  // Because our required fields are spread over multiple pages and we only validated this one, there will always be errors

  // Ignore errors for objects that are not in this DOM (i.e. they lack an ID present on this page)
  var relevantErrors = [];
  for(i=0; i<validate.errors.length; i++) {
    var error = validate.errors[i];
    var obj = $('#' + pathToObjId(error['path']));
    if (obj[0] || errorRequiresSpecialHandling (error)) {
      error['obj'] = obj;
      relevantErrors.push(error);
    }
  }

  if (updateInlineErrors) {
    // Start off by removing all previous Inline error display elements (if any). They will be regenearted if needed.
    $('.validation-error-display').remove();
  }

  if (updateSummaryErrors) {
    // Remove previous Summary error display element (if any)
    var summaryErrorDisplayId = 'summary_error_display';
    var errorDisplay = document.getElementById(summaryErrorDisplayId);
    if (errorDisplay) {
      errorDisplay.parentNode.removeChild(errorDisplay);
    }
  }

  if (relevantErrors.length > 0) {

    if (updateSummaryErrors) {
      // Make sure the errors are sorted by path for display. THis will group them.
      relevantErrors = relevantErrors.sort(function (a, b) {
        return a.path == b.path ? 0 : +(a.path > b.path) || -1;
      });

      var newElement = '<div id="' + summaryErrorDisplayId + '" class="banner banner-danger"><i class="fa fa-exclamation-triangle"></i>' +
        'Click on an error to go directly to that field:</br>';

      for (i = 0; i < relevantErrors.length; i++) {
        var error = relevantErrors[i];
        var objId = error['obj'].attr('id');
        var userMessage = createUserValidationMessage(error, 'summary');
        var errorString = '<a href="javascript:scrollToLabel(\'' + objId + '\');">' + userMessage + '.</a></br>';

        newElement += errorString;
      }
      newElement += '</div>';

      // Insert in the proper DOM location
      var element = document.getElementsByClassName('nav-top');
      element[0].insertAdjacentHTML('afterend', newElement);
    }

    if (updateInlineErrors) {
      for (var i = 0; i < relevantErrors.length; i++) {
        var errorsForThisObj = [];
        var indexToObj = i;
        for (var j = i; j < relevantErrors.length; j++) {
          if (relevantErrors[i].obj === relevantErrors[j].obj) {
            errorsForThisObj.push(relevantErrors[j]);
          }
          else {
            i = j - 1;
            break;
          }
        }
        updateInlineErrorsForField(relevantErrors[indexToObj].obj, errorsForThisObj);
      }
    }

    if (updateSummaryErrors)
      return confirm ('This page has invalid data. Are you sure you want to save it and proceed?');
  }

  return true;
}

function getInlineErrorDisplayId (obj) {
  var objId = obj.attr('id');
  return objId + '_errors';
}

function updateInlineErrorsForField(obj, errorArray) {

  removeDisplayedInlineErrorsForField(obj);

  // Display new error element under field
  var inlineErrorDisplayId = getInlineErrorDisplayId(obj);
  if (errorArray.length > 0) {
    var newObj = '<div id="' + inlineErrorDisplayId + '" class="banner banner-danger validation-error-display"><i class="fa fa-exclamation-triangle"></i>';
    for(i=0; i<errorArray.length; i++) {
      error = errorArray[i];
      var userMessage = createUserValidationMessage(error, 'inline');
      newObj += userMessage + '.</br>';
    }
    newObj += '</div>';
    $(newObj).insertAfter('#' + obj.attr('id'));
  }

}

// Return an array of all the path element strings
function getObjPathArray(obj) {
  var objPathArray = obj.attr('name').replace(/]/g, '').split('[').reverse();
  objPathArray.pop(); // Removes "Draft", the last element of the array

  for (var i=0; i<objPathArray.length; i++) {
    if (objPathArray[i].length > 0) {
      objPathArray[i] = snakeToCamel(objPathArray[i]);
      if (objPathArray[i] === 'Doi')
        objPathArray[i] = 'DOI';
      else
        if (objPathArray[i] === 'Isbn')
          objPathArray[i] = 'ISBN';
        else
          if (objPathArray[i] === 'Url')
            objPathArray[i] = 'URL';
          else
            if (objPathArray[i] === 'Uuid')
              objPathArray[i] = 'UUID';
    }
  }
  return objPathArray;
}

// Build json for this object and all its ancestors
function buildJsonToValidate(obj, objPathArray) {
  var schema = {};
  var objValue = obj.val();
  if (obj.hasClass('mmt-number')) {
    objValue = objValue * 1.0;
  }
  else if (obj.hasClass('mmt-integer')) {
    objValue = objValue * 1;
  }
  else if (obj.hasClass('mmt-boolean')) {
    objValue = objValue == 'true';
  }

  schema[objPathArray[0]] = objValue;

  for (var i=1; i<objPathArray.length; i++) {
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
  var targetObjId = obj.attr('id');

  for (var i=0; i<errors.length; i++) {
    var error = errors[i];
    //alert('Checking ' + errors[i].path + ' for ' + objPathArray[0] + ' Finding ' + errors[i].path.indexOf(objPathArray[0]));
    var objId = pathToObjId(error['path']);
    if (targetObjId === objId) {
      error['obj'] = obj;
      relevantErrors.push(error);
    }
  }
  return relevantErrors;
}

function removeDisplayedInlineErrorsForField(obj) {
  // Remove previous inline error display element (if any)
  var inlineErrorDisplayId = getInlineErrorDisplayId(obj);
  var errorDisplay = document.getElementById(inlineErrorDisplayId);
  if (errorDisplay) {
    errorDisplay.parentNode.removeChild(errorDisplay);
  }
}

function handleFieldValidation(obj) {

  // Get the path array of the obj here because it will be used in multiple places
  var objPathArray = getObjPathArray(obj);

  var jsonForPage = buildJsonForPage();

  var validate = jsen(globalJsonSchema, {greedy: true});

  validate(jsonForPage);

  // Remove errors that do not apply
  var errorArray = collectRelevantErrors(obj, objPathArray, validate.errors);

  updateInlineErrorsForField(obj, errorArray);

  return errorArray;
}

function scrollToLabel(target) {
  // Find the label for this target & scroll it into view. If no label, scroll to the field itself
  var label = $("label[for='" + target + "']")[0];
  if (label)
    label.scrollIntoView( true );
  else
    $('#' + target)[0].scrollIntoView( true );
}

function snakeToCamel(str){
  var newStr = str.replace(/(\_\w)/g, function(m){return m[1].toUpperCase();});
  newStr = newStr[0].toUpperCase() + newStr.slice(1);
  return newStr;
}

$(document).ready(function() {

  //var validate = null; // Validate object is null until handleFieldValidation needs it

  // set up validation call
  $('.validate').blur(function(e) {
    handleFieldValidation ($(this));
  });
  
  // Handle form navigation
  $('.next-section').change(function() {
    if (handleFormValidation(true, true)) {
      $('#new_form_name').val(this.value);
      this.form.submit();
    }
  });

});

