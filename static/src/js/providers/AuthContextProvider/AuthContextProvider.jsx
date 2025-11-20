import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import PropTypes from 'prop-types'
import jwt from 'jsonwebtoken'
import { useIdle } from '@uidotdev/usehooks'

import AuthContext from '@/js/context/AuthContext'

import useMMTCookie from '@/js/hooks/useMMTCookie'

import errorLogger from '@/js/utils/errorLogger'
import refreshToken from '@/js/utils/refreshToken'

import MMT_COOKIE from 'sharedConstants/mmtCookie'

import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'

const {
  apiHost,
  cookieDomain
} = getApplicationConfig()

/**
 * @typedef {Object} AuthContextProviderProps
 * @property {ReactNode} children The children to be rendered.
 */

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
  const [idleTimeout, setIdleTimeout] = useState(900000) // Default to 15 minutes in milliseconds
  const idle = useIdle(idleTimeout)

  // The user's EDL Token
  const [tokenValue, setTokenValue] = useState()

  // The timestamp the JWT (and EDL) expires
  const [tokenExpires, setTokenExpires] = useState()

  // The user's name and EDL uid
  const [user, setUser] = useState({})

  const timerRef = useRef(null)

  // Parse the new token
  const saveToken = async (newToken) => {
    setAuthLoading(false)

    try {
      if (newToken) {
        // Decode the token to get the edlToken and edlProfile
        const decodedToken = jwt.decode(newToken)

        const {
          edlProfile,
          exp,
          edlToken
        } = decodedToken

        const expiresAt = exp * 1000 // Convert to milliseconds

        setTokenExpires(expiresAt)
        setTokenValue(edlToken)
        setUser(edlProfile)

        return
      }

      // `removeCookie` doesn't seem to work on Safari, using `setCookie` with a null value does remove the cookie
      setCookie(MMT_COOKIE, null, {
        domain: cookieDomain,
        path: '/',
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

  const refreshTokenIfNeeded = useCallback(() => {
    const timeUntilExpiry = tokenExpires - Date.now()
    if (timeUntilExpiry <= 60000 && !idle) { // 1 minute before expiry and not idle
      refreshToken({
        jwt: mmtJwt,
        setToken: saveToken
      })
    }
  }, [mmtJwt, saveToken, tokenExpires, idle])

  useEffect(() => {
    if (tokenExpires) {
      const now = Date.now()
      const timeUntilExpiry = tokenExpires - now
      const maxTimeout = 2147483647 // Maximum setTimeout delay (approx 24.8 days) due to 32-bit signed int limit
      const timeoutValue = Math.min(maxTimeout, Math.max(timeUntilExpiry - 60000, 0)) // 60 seconds before expiry or 0, capped at maxTimeout

      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      if (timeoutValue > 0) {
        timerRef.current = setTimeout(() => {
          refreshTokenIfNeeded()
        }, timeoutValue)
      } else {
        refreshTokenIfNeeded()
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [tokenExpires, refreshTokenIfNeeded])

  useEffect(() => {
    if (tokenExpires) {
      const timeUntilExpiry = tokenExpires - Date.now()
      setIdleTimeout(Math.min(900000, Math.max(timeUntilExpiry - 60000, 0)))
    }
  }, [tokenExpires])

  useEffect(() => {
    if (idle) {
      // Implement your logout warning logic here
    }
  }, [idle])

  // Login redirect
  const login = useCallback(() => {
    const loginUrl = new URL(`${apiHost}/login`)
    loginUrl.searchParams.append('target', '/')

    window.location.href = loginUrl.toString()
  }, [])

  // Context values
  const providerValue = useMemo(() => ({
    authLoading,
    login,
    setToken: saveToken,
    tokenExpires,
    tokenValue,
    user
  }), [
    authLoading,
    login,
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
