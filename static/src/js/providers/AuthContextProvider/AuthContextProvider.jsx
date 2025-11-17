import React, {
  useCallback,
  useEffect,
  useMemo,
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

  const [idleTimeout, setIdleTimeout] = useState(900000) // Default to 15 minutes in milliseconds
  const idle = useIdle(idleTimeout)

  const [authLoading, setAuthLoading] = useState(true)

  // The user's EDL Token
  const [tokenValue, setTokenValue] = useState()

  // The timestamp the JWT (and EDL) expires
  const [tokenExpires, setTokenExpires] = useState()

  // The user's name and EDL uid
  const [user, setUser] = useState({})

  // `setTimeout` timeoutId used for the timer for auto refreshing the user
  let idleTimeoutId

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

        // Set idle timeout to 1 minute less than time until expiry, or 0 if already expired
        setIdleTimeout(Math.max(timeUntilExpiry - 60000, 0))

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

  // Setup a `setTimeout` for checking if the user has been active during their token's valid time
  const resetTimer = (userIdle) => {
    const now = Date.now()
    const timeUntilExpiry = tokenExpires - now
    const timeoutValue = Math.max(timeUntilExpiry - 60000, 0) // 60 seconds before expiry or 0

    console.log('Resetting Token Timer:')
    console.log(`  Current time: ${new Date(now).toISOString()}`)
    console.log(`  Token expires at: ${new Date(tokenExpires).toISOString()}`)
    console.log(`  Time until expiry: ${timeUntilExpiry / 1000} seconds`)
    console.log(`  Setting timeout to: ${timeoutValue / 1000} seconds`)

    return setTimeout(() => {
      if (!userIdle) {
        // If the user was active at some point during their token's valid time, refresh their token for them
        refreshToken({
          jwt: mmtJwt,
          setToken: saveToken
        })
      } else {
        // If they have not been active, warn them that they will be logged out
        // TODO MMT-3750
        console.log('LOG OUT WARNING')
      }
    }, timeoutValue)
  }

  useEffect(() => {
    if (tokenExpires) {
      console.log(`Setting up timer at: ${new Date().toISOString()}`)

      // If the tokenExpires value was updated, set the idleTimeoutId to that value - 60s
      idleTimeoutId = resetTimer(idle)
    }

    return () => {
      console.log(`Clearing timer at: ${new Date().toISOString()}`)

      // Clear the existing timer to ensure only one timer is running at a time
      clearTimeout(idleTimeoutId)
    }
  }, [tokenExpires, idle])

  // Login redirect
  const login = useCallback(() => {
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
