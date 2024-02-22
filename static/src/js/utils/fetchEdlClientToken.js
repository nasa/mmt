import base64 from 'base-64'
import { getApplicationConfig, getEdlConfig } from './getConfig'

const fetchEdlClientToken = async () => {
  const { version } = getApplicationConfig()
  const { host, uid } = getEdlConfig()
  let password = process.env.EDL_PASSWORD2
  if (version === 'development') {
    password = undefined
  }

  const url = `${host}/oauth/token`
  const authorizationHeader = `Basic ${base64.encode(`${uid}:${password}`)}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: authorizationHeader,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: 'grant_type=client_credentials'
  })
  const json = await response.json()
  const accessToken = json.access_token

  return accessToken
}

export default fetchEdlClientToken
