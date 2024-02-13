import base64 from 'base-64'
import { getEdlConfig } from './getConfig'

const fetchEdlClientToken = async () => {
  const { host, uid } = getEdlConfig()
  const password = process.env.EDL_PASSWORD
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
