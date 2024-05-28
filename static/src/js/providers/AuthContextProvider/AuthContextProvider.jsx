import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { useCookies } from 'react-cookie'
import jwt from 'jsonwebtoken'

import AuthContext from '@/js/context/AuthContext'

import MMT_COOKIE from '@/js/constants/mmtCookie'

import errorLogger from '@/js/utils/errorLogger'

import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'

const { apiHost } = getApplicationConfig()

/**
 * @typedef {Object} AuthContextProviderProps
 * @property {ReactNode} children The children to be rendered.

/**
 * Renders any children and provides access to AuthContext.
 * @param {AuthContextProviderProps} props
 *
 * @example <caption>Renders any children and provides access to AuthContext.</caption>
 *
 * return (
 *   <AuthContextProvider>
 *     {children}
 *   </AuthContextProvider>
 * )
 */
const AuthContextProvider = ({ children }) => {
  const [
    cookies,
    // eslint-disable-next-line no-unused-vars
    setCookie,
    removeCookie
  ] = useCookies([MMT_COOKIE])
  const { [MMT_COOKIE]: mmtJwt } = cookies

  const [authLoading, setAuthLoading] = useState(true)

  // The user's Launchpad Token
  const [tokenValue, setTokenValue] = useState()

  // The timestamp the JWT (and Launchpad) expires
  const [tokenExpires, setTokenExpires] = useState()

  // The user's name and EDL uid
  const [user, setUser] = useState({})

  // Parse the new token
  const saveToken = async (newToken) => {
    setAuthLoading(false)

    try {
      if (newToken) {
        // Decode the token to get the launchpadToken and edlProfile
        const decodedToken = jwt.decode(newToken)

        const {
          edlProfile,
          exp,
          launchpadToken
        } = decodedToken

        // `exp` comes back in seconds since epoch, we need milliseconds
        setTokenExpires(exp * 1000)
        setTokenValue(launchpadToken)
        setUser(edlProfile)

        return
      }

      removeCookie(MMT_COOKIE)

      setTokenValue(null)
      setTokenExpires(null)
      setUser({})
    } catch (error) {
      // Saving error
      errorLogger(error, 'AuthContextProvider: decoding JWT')
    }
  }

  // On page load, save the token from the cookie into the state
  useEffect(() => {
    saveToken(mmtJwt)
  }, [mmtJwt])

  // Login redirect
  const login = useCallback(() => {
    window.location.href = `${apiHost}/saml-login?target=${encodeURIComponent('/')}`
  }, [])

  // Logout redirect
  const logout = useCallback(() => {
    saveToken(null)

    window.location.href = '/'
  }, [])

  const providerValue = useMemo(() => ({
    authLoading,
    login,
    logout,
    setToken: saveToken,
    tokenExpires,
    tokenValue,
    user
  }), [
    authLoading,
    login,
    logout,
    tokenExpires,
    tokenValue,
    user
  ])

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  )
}

AuthContextProvider.defaultProps = {
  children: null
}

AuthContextProvider.propTypes = {
  children: PropTypes.node
}

export default AuthContextProvider
