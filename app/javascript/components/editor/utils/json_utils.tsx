/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import compactDeep from 'compact-object-deep'

export function removeEmpty(obj: object) {
  return compactDeep(obj)
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
  return property
}
