import { get, merge } from 'lodash'

/**
 * Recursively builds a validation error to pass into NavigationItemError, give an AJV validation error. See the tests for examples of input and output objects
 * @param {Object} params
 * @param {Object} params.draft Draft metadata, used to determine length of array fields
 * @param {Object[]} params.errors Working errors list
 * @param {String[]} params.pathParts List of each section of the validationError property, items are removed as the recursion goes deeping into the validation property
 * @param {Object} params.validationError Original validation error from AJV
 * @param {String[]} params.workingPathParts List of the path parts already seen in the recursion, used to find data in the draft metadata
 */
const buildValidationErrors = ({
  draft,
  errors = [],
  pathParts,
  validationError,
  workingPathParts = []
}) => {
  const [firstPathPart, ...nextPathParts] = pathParts

  // Regex to find if the `firstPathPart` is an array
  const regex = /^([^\\[]+)\[(\d+)\]/
  const match = firstPathPart.match(regex)

  let fieldName = firstPathPart
  const updatedWorkingPathParts = workingPathParts

  if (match && match[1]) {
    // If the field is an array
    [, fieldName] = match
    // Get the array index of this error from the regex match
    const arrayIndex = parseInt(match[2], 10)

    // Add the current pathPart to the workingPathParts to pass down
    updatedWorkingPathParts.push(match[1])

    // Find any metadata in the draft related to this array
    const results = get(draft, updatedWorkingPathParts.join('.'))

    // If no results exist, default the length parameter to 1
    const length = Math.max(results?.length || 1, arrayIndex + 1)

    // The fieldName for this array field will include the index and total length of the array, (1 of 2)
    fieldName = `${fieldName} (${arrayIndex + 1} of ${length})`
  } else {
    // Add the current pathPart to the workingPathParts to pass down
    updatedWorkingPathParts.push(fieldName)
  }

  let errorObject = validationError

  // If there are remaining parts to the error path, call buildValidationErrors again one more level down
  if (nextPathParts.length > 0) {
    const workingErrors = errors.find((error) => error.fieldName === fieldName)

    const nestedErrors = buildValidationErrors({
      draft,
      errors: workingErrors?.errors || [],
      pathParts: nextPathParts,
      validationError,
      workingPathParts: updatedWorkingPathParts
    })

    errorObject = {
      errors: nestedErrors,
      fieldName
    }
  }

  let foundError = false
  const returnValue = errors.map((error) => {
    // If the field has an existing error, merge the new `errorObject` with the existing error, to
    // ensure a field with multiple errors list all errors
    if (error.fieldName === fieldName) {
      foundError = true

      return merge(error, errorObject)
    }

    return error
  })

  // If no error was found then we need to return the new `errorObject` added to any existing errors
  if (!foundError) {
    return [
      ...errors,
      errorObject
    ]
  }

  return returnValue
}

export default buildValidationErrors
