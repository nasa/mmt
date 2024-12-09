import { useCookies } from 'react-cookie'

import MMT_COOKIE from 'sharedConstants/mmtCookie'

/**
 * Returns the cookie value for the MMT auth cookie
 */
const useMMTCookie = () => {
  const [
    cookies,
    setCookie,
    removeCookie
  ] = useCookies([MMT_COOKIE])
  const { [MMT_COOKIE]: mmtJwt } = cookies

  return {
    mmtJwt,
    setCookie,
    removeCookie
  }
}

export default useMMTCookie
