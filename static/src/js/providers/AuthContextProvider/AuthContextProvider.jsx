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
import errorLogger from '../../utils/errorLogger'

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
  const [cookies, setCookie, removeCookie] = useCookies(['loginInfo', 'launchpadToken', 'data'])
  const { loginInfo = {}, launchpadToken } = cookies

  const setUser = (info) => {
    setCookie('loginInfo', info)
  }

  const updateLoginInfo = (auid) => {
    console.log('updating login info')
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

    // We've moved the launchpad token into the loginInfo, so no need to store it twice.
    removeCookie('launchpadToken', {
      path: '/',
      domain: '.earthdatacloud.nasa.gov',
      secure: true
    })

    // Remove this code after about 2 months, prior versions used data and we
    // just need to clean up that cookie for users, as it was causing
    // header size issues.
    removeCookie('data', {
      path: '/',
      domain: '.earthdatacloud.nasa.gov',
      secure: true
    })
  }

  useEffect(() => {
    if (!loginInfo || !loginInfo.auid) return

    const { name, auid } = loginInfo
    const fetchProfileAndSetLoginCookie = async () => {
      await fetch(`${apiHost}/edl-profile?auid=${auid}`).then(async (response) => {
        const { name: profileName } = await response.json()
        setUser({
          ...loginInfo,
          name: profileName
        })
      }).catch((error) => {
        errorLogger(`Error retrieving profile for ${auid}, message=${error.toString()}`, 'AuthContextProvider')
      })
    }

    if (!name) {
      fetchProfileAndSetLoginCookie()
    }
  }, [loginInfo])

  const handleRefreshToken = (refreshToken) => {
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
