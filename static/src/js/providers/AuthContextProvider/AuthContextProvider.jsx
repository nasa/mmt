import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import PropTypes from 'prop-types'
import jwt from 'jsonwebtoken'

import AuthContext from '@/js/context/AuthContext'

import MMT_COOKIE from '@/js/constants/mmtCookie'

import useMMTCookie from '@/js/hooks/useMMTCookie'

import errorLogger from '@/js/utils/errorLogger'

import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'

const { apiHost, cookieDomain } = getApplicationConfig()

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
  const {
    mmtJwt,
    setCookie
  } = useMMTCookie()

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

      // `removeCookie` doesn't seem to work on Safari, using `setCookie` with a null value does remove the cookie
      setCookie(MMT_COOKIE, null, {
        domain: cookieDomain,
        maxAge: 0,
        expires: new Date(0)
      })

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

  const providerValue = useMemo(() => ({
    authLoading,
    login,
    setToken: saveToken,
    tokenExpires,
    tokenValue,
    user
  }), [
    authLoading,
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
