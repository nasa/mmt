import { useCookies } from 'react-cookie'

import MMT_COOKIE from '../constants/mmtCookie'

import { getApplicationConfig } from '../../../../sharedUtils/getConfig'

/**
 * Returns the cookie value for the MMT auth cookie
 */
const useMMTCookie = () => {
  const { cookieDomain } = getApplicationConfig()

  const [
    cookies,
    setCookie,
    removeCookie
  ] = useCookies([MMT_COOKIE])

  const { [`${MMT_COOKIE}_${cookieDomain}`]: mmtJwt } = cookies

  return {
    mmtJwt,
    setCookie,
    removeCookie
  }
}

export default useMMTCookie
