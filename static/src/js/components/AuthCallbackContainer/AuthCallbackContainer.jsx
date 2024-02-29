import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { getApplicationConfig } from '../../utils/getConfig'

/**
 * This class handles the authenticated redirect from our saml lambda function.
 * We get the launchpad token and redirect to the specified `target` path
 */

export const AuthCallbackContainer = () => {
  const [searchParams] = useSearchParams()
  const { apiHost } = getApplicationConfig()

  const path = searchParams.get('target')
  const auid = searchParams.get('auid')

  const [cookie, setCookie] = useCookies(['launchpadToken', 'loginInfo'])

  const { launchpadToken } = cookie
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfileAndSetLoginCookie = async () => {
      const response = await fetch(`${apiHost}/edl-profile?auid=${auid}`)
      const edlProfile = await response.json()

      let expires = new Date()
      expires.setMinutes(expires.getMinutes() + 15)
      expires = new Date(expires)
      setCookie('loginInfo', {
        name: edlProfile.name,
        auid,
        token: {
          tokenValue: launchpadToken,
          tokenExp: expires.valueOf()
        }
      })
    }

    fetchProfileAndSetLoginCookie()
  }, [launchpadToken])

  if (path) {
    navigate(path)
  }

  return <div />
}

export default AuthCallbackContainer
