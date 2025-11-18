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
import { debounce } from 'lodash-es'

import AuthContext from '@/js/context/AuthContext'

import useMMTCookie from '@/js/hooks/useMMTCookie'

import errorLogger from '@/js/utils/errorLogger'
import refreshToken from '@/js/utils/refreshToken'

import MMT_COOKIE from 'sharedConstants/mmtCookie'

import getApplicationNameFromHostname from '@/js/utils/getApplicationNameFromHostname'
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
  const idleRef = useRef(idle)
  const tokenExpiresRef = useRef(null)

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

        const now = Date.now()
        const expiresAt = exp * 1000 // Convert to milliseconds
        const timeUntilExpiry = expiresAt - now

        console.log('Token Expiration Details:')
        console.log(`  Current time: ${new Date(now).toISOString()}`)
        console.log(`  Token expires at: ${new Date(expiresAt).toISOString()}`)
        console.log(`  Time until expiry: ${timeUntilExpiry / 1000} seconds`)

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
    const now = Date.now()
    const timeUntilExpiry = tokenExpiresRef.current - now
    console.log(`Refresh check at ${new Date(now).toISOString()}:`)
    console.log(`  Token expires at: ${new Date(tokenExpiresRef.current).toISOString()}`)
    console.log(`  Time until expiry: ${timeUntilExpiry / 1000} seconds`)
    console.log(`  Idle: ${idleRef.current}`)

    if (timeUntilExpiry <= 60000 && !idleRef.current) { // 1 minute before expiry and not idle
      console.log(`Attempting to refresh token at ${new Date().toISOString()}`)
      refreshToken({
        jwt: mmtJwt,
        setToken: saveToken
      })
    } else {
      console.log('No need to refresh token')
    }
  }, [mmtJwt, saveToken])

  const debouncedRefresh = useMemo(
    () => debounce(refreshTokenIfNeeded, 1000),
    [refreshTokenIfNeeded]
  )

  useEffect(() => {
    idleRef.current = idle
    tokenExpiresRef.current = tokenExpires

    if (tokenExpires) {
      console.log(`Setting up timer at: ${new Date().toISOString()}`)
      const now = Date.now()
      const timeUntilExpiry = tokenExpires - now
      const timeoutValue = Math.max(timeUntilExpiry - 60000, 0) // 60 seconds before expiry or 0

      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      const maxTimeout = 2147483647 // Maximum timeout (about 24.8 days)

      if (timeoutValue > 0) {
        if (timeoutValue > maxTimeout) {
          console.log(`Setting intermediate timer for ${maxTimeout / 1000} seconds`)
          timerRef.current = setTimeout(() => {
            console.log(`Intermediate timer expired at ${new Date().toISOString()}, resetting timer`)
            // Reset the timer
            setTokenExpires(tokenExpires)
          }, maxTimeout)
        } else {
          console.log(`Setting final timer to expire in ${timeoutValue / 1000} seconds`)
          timerRef.current = setTimeout(() => {
            console.log(`Timer expired at ${new Date().toISOString()}, checking if refresh is needed`)
            debouncedRefresh()
          }, timeoutValue)
        }
      } else {
        console.log('Token is already expired or about to expire, refreshing now')
        debouncedRefresh()
      }
    }

    return () => {
      if (timerRef.current) {
        console.log(`Clearing timer at: ${new Date().toISOString()}`)
        clearTimeout(timerRef.current)
      }
    }
  }, [tokenExpires, idle, debouncedRefresh])

  useEffect(() => {
    if (tokenExpires) {
      const timeUntilExpiry = tokenExpires - Date.now()
      setIdleTimeout(Math.min(900000, Math.max(timeUntilExpiry - 60000, 0)))
    }
  }, [tokenExpires])

  useEffect(() => {
    console.log('Idle state changed:', idle)
    if (idle) {
      console.log('LOG OUT WARNING')
      // Implement your logout warning logic here
    }
  }, [idle])

  // Login redirect
  const login = useCallback(() => {
    console.log('in auth context provider logging in')
    const app = getApplicationNameFromHostname()
    const loginUrl = new URL(`${apiHost}/login`)
    loginUrl.searchParams.append('target', '/')

    loginUrl.searchParams.append('app', app)
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
