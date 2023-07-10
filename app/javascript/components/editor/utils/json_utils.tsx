/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import compactDeep from 'compact-object-deep'

export function removeEmpty(obj: object) {
  // The compactDeep function takes a second argument allowing the caller to override what should be considered a empty value, so in this case, if the "type" of the value is boolean, we are telling it NOT to consider it an empty value, otherwise false would be considered empty with the default implementation."
  return compactDeep(obj, (val) => {
    if (typeof val === 'boolean') { return val }
    return undefined
  })
}

// https://thewebdev.info/2022/01/19/how-to-recursively-remove-null-values-from-javascript-object/
export function removeNulls(obj: any) {
  const isArray = Array.isArray(obj)
  Object.keys(obj).forEach((k: any) => {
    if (obj[k] === null) {
      if (isArray) {
        obj.splice(k, 1)
      } else {
        delete obj[k]
      }
    } else if (typeof obj[k] === 'object') {
      removeNulls(obj[k])
    }
    if (isArray && obj.length === Number(k)) {
      removeNulls(obj)
    }
  })
  return obj
}

export function prefixProperty(prefix: string) {
  let propertyPrefix = prefix
  if (!prefix.startsWith('.')) {
    propertyPrefix = `.${prefix}`
  }
  return propertyPrefix
}

export function createPath(property: string) {
  property = property.replace(/\.(\d)/g, '[$1')
  property = property.replace(/(\d)\./g, '$1].')
  if (property.match(/^.*\d$/)) { // ends with a digit
    property += ']'
  }
  return property
}

export function convertToDottedNotation(property: string) {
  return property.replace(/_/g, '.')
}
