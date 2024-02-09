import base64 from 'base-64'

const encodeCookie = (obj) => {
  const json = JSON.stringify(obj)

  return base64.encode(json)
}

export default encodeCookie
