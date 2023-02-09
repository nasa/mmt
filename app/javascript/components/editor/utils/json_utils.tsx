/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
function traverse(obj: any) {
  const isArray = Array.isArray(obj)
  Object.keys(obj).forEach((k: any) => {
    if (obj[k] === null || obj[k] === '' || (obj[k] && Object.keys(obj[k]).length === 0)) {
      if (isArray) {
        obj.splice(k, 1)
      } else {
        delete obj[k]
      }
    } else if (typeof obj[k] === 'object') {
      traverse(obj[k])
    }
    if (isArray && obj.length === k) {
      traverse(obj)
    }
  })
  return obj
}
/* this will pass through the hierarchy each time removing empty fields. Each pass it removes the */
/* deepest nodes until the previous pass object is equal the the last pass, indicating it can't find any more empty fields. */
export function removeEmpty(obj: any) {
  let tempObj: any = obj
  let tempObj1: any = {}
  while (JSON.stringify(tempObj1) !== JSON.stringify(tempObj)) {
    tempObj = JSON.parse(JSON.stringify(tempObj1))
    tempObj1 = traverse(obj)
  }
  return obj
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
    if (isArray && obj.length === k) {
      removeNulls(obj)
    }
  })
  return obj
}
