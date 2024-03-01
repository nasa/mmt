import React, {
  useCallback,
  useEffect,
  useMemo
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
  const [cookies, setCookie] = useCookies(['loginInfo', 'launchpadToken'])
  const { loginInfo = {}, launchpadToken } = cookies

  const setUser = (info) => {
    setCookie('loginInfo', info)
  }

  const updateLoginInfo = (auid) => {
    let expires = new Date()
    expires.setMinutes(expires.getMinutes() + 15)
    expires = new Date(expires)
    const info = {
      providerId: 'MMT_2',
      auid,
      token: {
        tokenValue: launchpadToken,
        tokenExp: expires.valueOf()
      }
    }
    setUser(info)
  }

  // UseEffect(() => { console.log('user changed ', user) }, [user])
  useEffect(() => {
    if (!loginInfo || !loginInfo.auid) return

    const { name, auid } = loginInfo
    const fetchProfileAndSetLoginCookie = async () => {
      const response = await fetch(`${apiHost}/edl-profile?auid=${auid}`)
      const { name: profileName } = await response.json()
      setCookie('loginInfo', {
        ...loginInfo,
        name: profileName
      })
    }

    if (!name) {
      fetchProfileAndSetLoginCookie()
    }
  }, [loginInfo])

  const handleRefreshToken = (refreshToken) => {
    const { tokenValue } = refreshToken
    console.log('refreshing token ', tokenValue)

    setUser({
      ...loginInfo,
      token: refreshToken
    })
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      checkAndRefreshToken(loginInfo, handleRefreshToken)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [loginInfo])

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
    updateLoginInfo,
    user: loginInfo
  }), [
    loginInfo,
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