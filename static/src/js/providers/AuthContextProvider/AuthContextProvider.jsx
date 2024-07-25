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

import MMT_COOKIE from '@/js/constants/mmtCookie'

import useMMTCookie from '@/js/hooks/useMMTCookie'

import errorLogger from '@/js/utils/errorLogger'
import refreshToken from '@/js/utils/refreshToken'

import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'

const {
  apiHost,
  cookieDomain,
  tokenValidTime
} = getApplicationConfig()

const tokenValidSeconds = parseInt(tokenValidTime, 10)

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

  // The idle timeout should be 60s less than the total token valid time
  const idleTimeoutMs = (tokenValidSeconds - 60) * 1000
  const idle = useIdle(idleTimeoutMs)

  const [authLoading, setAuthLoading] = useState(true)

  // The user's Launchpad Token
  const [tokenValue, setTokenValue] = useState()

  // The timestamp the JWT (and Launchpad) expires
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
    const now = new Date().getTime()

    // The amount of time left before the token expires
    const expiresIn = tokenExpires - now

    // The timeoutValue will be 60 seconds before the token expires.
    const timeoutValue = expiresIn - 60 * 1000

    // Set a timeout for refreshing the user token. If the user has been active during the lifespan of their
    // current token we can refresh it for them.
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
      // If the tokenExpires value was updated, set the idleTimeoutId to that value - 60s
      idleTimeoutId = resetTimer(idle)
    }

    return () => {
      // Clear the existing timer to ensure only one timer is running at a time
      clearTimeout(idleTimeoutId)
    }
  }, [tokenExpires, idle, idleTimeoutId])

  // Login redirect
  const login = useCallback(() => {
    window.location.href = `${apiHost}/saml-login?target=${encodeURIComponent('/')}`
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
