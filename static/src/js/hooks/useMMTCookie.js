import { useCookies } from 'react-cookie'

import MMT_COOKIE from '../constants/mmtCookie'

/**
 * Returns the cookie value for the MMT auth cookie
 */
const useMMTCookie = () => {
  const [
    cookies,
    // eslint-disable-next-line no-unused-vars
    setCookie,
    removeCookie
  ] = useCookies([MMT_COOKIE])
  const { [MMT_COOKIE]: mmtJwt } = cookies

  return {
    mmtJwt,
    removeCookie
  }
}

export default useMMTCookie
