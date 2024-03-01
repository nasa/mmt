import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { useCookies } from 'react-cookie'
import AuthContext from '../../context/AuthContext'
import { getApplicationConfig } from '../../utils/getConfig'
import checkAndRefreshToken from '../../utils/checkAndRefreshToken'

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
  const [user, setUser] = useState({})

  const [cookies, setCookie] = useCookies(['loginInfo'])
  const { token } = user
  const { loginInfo } = cookies

  useEffect(() => {
    if (loginInfo) {
      const {
        auid,
        name,
        token: cookieToken
      } = loginInfo

      setUser({
        ...user,
        token: cookieToken,
        name,
        auid,
        providerId: 'MMT_2'
      })
    }
  }, [loginInfo])

  const handleRefreshToken = (refreshToken) => {
    console.log('refreshing token ', refreshToken)
    setCookie('loginInfo', {
      ...loginInfo,
      token: refreshToken
    })
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      checkAndRefreshToken(user, handleRefreshToken)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [token])

  const login = useCallback(() => {
    window.location.href = `${apiHost}/saml-login?target=${encodeURIComponent('/manage/collections')}`
  }, [])

  const logout = useCallback(() => {
    setUser({})
  }, [])

  const providerValue = useMemo(() => ({
    login,
    logout,
    setUser,
    user
  }), [
    user,
    login,
    logout
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
