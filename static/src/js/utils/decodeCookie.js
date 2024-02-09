import base64 from 'base-64'

const decodeCookie = (rawString) => {
  if (rawString == null) {
    return {}
  }

  return JSON.parse(base64.decode(rawString))
}

export default decodeCookie
