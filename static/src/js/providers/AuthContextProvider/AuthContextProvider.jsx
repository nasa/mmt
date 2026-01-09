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

const MAX_IDLE_TIMEOUT = 900000
const REFRESH_THRESHOLD_MS = 60000
const MAX_TIMEOUT_DELAY = 2147483647

/**
 * Parses a JWT for the information needed to hydrate AuthContext state.
 * @param {string} token The encoded JWT.
 * @returns {{ edlProfile: Object, edlToken: string, expiresAt: number } | null} The decoded payload or null on failure.
 */
const decodeTokenPayload = (token) => {
  if (!token) return null

  const decodedToken = jwt.decode(token)

  if (!decodedToken) return null

  const {
    edlProfile,
    exp,
    edlToken
  } = decodedToken

  return {
    edlProfile,
    edlToken,
    expiresAt: exp ? exp * 1000 : null
  }
}

/**
 * Clears cookie and state references when the token is missing or invalid.
 * @param {Object} params The setter callbacks from AuthContextProvider.
 */
const resetTokenState = ({
  setCookie,
  setTokenExpires,
  setTokenValue,
  setUser
}) => {
  setCookie(MMT_COOKIE, null, {
    domain: cookieDomain,
    path: '/',
    maxAge: 0,
    expires: new Date(0)
  })

  setTokenValue(null)
  setTokenExpires(null)
  setUser({})
}

/**
 * Determines whether the token is close enough to expiry to trigger a refresh.
 * @param {Object} params Evaluation inputs.
 * @param {boolean} params.idle True when the user is idle.
 * @param {number} params.threshold How long before expiry to trigger refresh.
 * @param {number} params.tokenExpires Token expiry timestamp in ms.
 * @returns {boolean} True when the refresh should run.
 */
const shouldRefreshToken = ({
  idle,
  threshold = REFRESH_THRESHOLD_MS,
  tokenExpires
}) => {
  if (!tokenExpires) return false

  const timeUntilExpiry = tokenExpires - Date.now()

  return timeUntilExpiry <= threshold && !idle
}

/**
 * Calculates the delay before the next refresh timer should fire.
 * @param {number} tokenExpires Expiration timestamp in ms.
 * @param {number} [threshold] Lead time in ms before expiry.
 * @returns {number|null} Milliseconds until refresh or null if expiry missing.
 */
const getRefreshDelay = (tokenExpires, threshold = REFRESH_THRESHOLD_MS) => {
  if (!tokenExpires) return null

  const timeUntilExpiry = tokenExpires - Date.now()

  return Math.min(
    MAX_TIMEOUT_DELAY,
    Math.max(timeUntilExpiry - threshold, 0)
  )
}

/**
 * Determines the idle timeout to pass to useIdle based on token expiry.
 * @param {number} tokenExpires Expiration timestamp in ms.
 * @returns {number} Milliseconds for the idle timeout.
 */
const getIdleTimeout = (tokenExpires) => {
  if (!tokenExpires) return MAX_IDLE_TIMEOUT

  const timeUntilExpiry = tokenExpires - Date.now()

  return Math.min(
    MAX_IDLE_TIMEOUT,
    Math.max(timeUntilExpiry - REFRESH_THRESHOLD_MS, 0)
  )
}

/**
 * Builds the login URL with the default redirect target.
 * @param {string} host API host base URL.
 * @param {string} [target='/'] The desired redirect target after login.
 * @returns {string} A fully qualified login URL.
 */
const buildLoginUrl = (host, target = '/') => {
  const loginUrl = new URL(`${host}/login`)
  loginUrl.searchParams.append('target', target)

  return loginUrl.toString()
}

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
  const [idleTimeout, setIdleTimeout] = useState(MAX_IDLE_TIMEOUT) // Default to 15 minutes in milliseconds
  const idle = useIdle(idleTimeout)

  // The user's EDL Token
  const [tokenValue, setTokenValue] = useState()

  // The timestamp the JWT (and EDL) expires
  const [tokenExpires, setTokenExpires] = useState()

  // The user's name and EDL uid
  const [user, setUser] = useState({})

  // Track if a refresh is already in progress
  const refreshInProgress = useRef(false)

  // Parse the new token
  const saveToken = useCallback(async (newToken) => {
    setAuthLoading(false)

    try {
      const decodedToken = decodeTokenPayload(newToken)

      if (decodedToken) {
        const {
          edlProfile,
          edlToken,
          expiresAt
        } = decodedToken

        setTokenExpires(expiresAt)
        setTokenValue(edlToken)
        setUser(edlProfile)

        return
      }

      resetTokenState({
        setCookie,
        setTokenExpires,
        setTokenValue,
        setUser
      })
    } catch (error) {
      // Saving error
      errorLogger(error, 'AuthContextProvider: decoding JWT')
    }
  }, [
    setCookie,
    setTokenExpires,
    setTokenValue,
    setUser
  ])

  // On page load, save the token from the cookie into the state
  useEffect(() => {
    saveToken(mmtJwt)
  }, [mmtJwt])

  const refreshTokenIfNeeded = useCallback(() => {
    if (refreshInProgress.current) return // Prevent duplicate refreshes

    if (shouldRefreshToken({
      idle,
      tokenExpires
    })) { // 1 minute before expiry and not idle
      refreshInProgress.current = true
      refreshToken({
        jwt: mmtJwt,
        setToken: (result) => {
          refreshInProgress.current = false

          // When the token refresh succeeds, the server sets a new cookie
          // The next time mmtJwt changes, our effect will process the new token
          // If the refresh fails, redirects happen in the refreshToken function
          if (result === null) {
            // Handle token reset, but don't redirect (already happening in refreshToken)
            resetTokenState({
              setCookie,
              setTokenExpires,
              setTokenValue,
              setUser
            })
          }
          // Result === 'refresh_success' is handled by the cookie change
        }
      })
    }
  }, [mmtJwt, saveToken, tokenExpires, idle])

  useEffect(() => {
    if (!tokenExpires) return undefined

    const refreshDelay = getRefreshDelay(tokenExpires)

    if (refreshDelay > 0) {
      const timeoutId = setTimeout(() => {
        refreshTokenIfNeeded()
      }, refreshDelay)

      return () => {
        clearTimeout(timeoutId)
      }
    }

    refreshTokenIfNeeded()

    return undefined
  }, [tokenExpires, refreshTokenIfNeeded])

  useEffect(() => {
    if (tokenExpires) {
      setIdleTimeout(getIdleTimeout(tokenExpires))
    }
  }, [tokenExpires])

  useEffect(() => {
    if (idle) {
      // Todo: MMT-3750 Implement logout warning logic here
    }
  }, [idle])

  // Login redirect
  const login = useCallback(() => {
    window.location.href = buildLoginUrl(apiHost)
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
    saveToken,
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
