import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import PropTypes from 'prop-types'
import jwt from 'jsonwebtoken'

import AuthContext from '@/js/context/AuthContext'

import APP_LOADING_TOKEN from '@/js/constants/appLoadingToken'

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
  // The MMT JWT
  const [token, setToken] = useState()

  // The user's Launchpad Token
  const [tokenValue, setTokenValue] = useState(APP_LOADING_TOKEN)

  // The timestamp the JWT (and Launchpad) expires
  const [tokenExpires, setTokenExpires] = useState()

  // The user's name and EDL uid
  const [user, setUser] = useState({})

  // Parse the new token
  const saveToken = async (newToken) => {
    setToken(newToken)

    try {
      if (newToken) {
        localStorage.setItem('token', newToken)

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

      localStorage.removeItem('token')

      setTokenValue(null)
      setTokenExpires(null)
      setUser({})
    } catch (error) {
      // Saving error
      errorLogger(error, 'AuthContextProvider: local storage set/remove')
    }
  }

  // On page load, try to fetch the token from local storage and save to state
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const fetchedToken = localStorage.getItem('token')
        saveToken(fetchedToken)
      } catch (error) {
        errorLogger(error, 'AuthContextProvider: local storage get')
      }
    }

    fetchToken()
      .catch(console.error)
  }, [])

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
    login,
    logout,
    setToken: saveToken,
    setUser, // TODO do I need this?
    token,
    tokenExpires,
    tokenValue,
    user
  }), [
    login,
    logout,
    token,
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
