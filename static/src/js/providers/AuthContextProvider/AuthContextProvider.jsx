import React, {
  useCallback,
  useEffect,
  useMemo
} from 'react'
import PropTypes from 'prop-types'
import { useCookies } from 'react-cookie'

import AuthContext from '../../context/AuthContext'

import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'

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
  const [
    cookies,
    setCookie,
    removeCookie] = useCookies(['loginInfo', 'launchpadToken', 'data'])
  const {
    loginInfo = {},
    launchpadToken,
    data
  } = cookies

  const setUser = useCallback((arg) => {
    if (typeof arg === 'function') {
      const result = arg(loginInfo)
      setCookie('loginInfo', result)
    } else {
      setCookie('loginInfo', arg)
    }
  }, [cookies])

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

    // We've moved the launchpad token into the loginInfo, so no need to store it twice.
    removeCookie('launchpadToken', {
      path: '/',
      domain: '.earthdatacloud.nasa.gov',
      secure: true
    })
  }

  useEffect(() => {
    // TODO: https://bugs.earthdata.nasa.gov/browse/MMT-3612
    // Remove this code after about 2 months, prior versions used data and we just need
    // to clean up that cookie for users, as it was causing header size issues.
    if (data) {
      removeCookie('data', {
        path: '/',
        domain: '.earthdatacloud.nasa.gov',
        secure: true
      })
    }
  }, [data])

  useEffect(() => {
    if (!loginInfo || !loginInfo.auid) return

    const { name, auid } = loginInfo
    // TODO No cookie is set here
    const fetchProfileAndSetLoginCookie = async () => {
      await fetch(`${apiHost}/edl-profile`, {
        headers: {
          Authorization: `Bearer ${launchpadToken}`
        }
      })
        .then(async (response) => {
          const {
            error,
            name: profileName,
            uid
          } = await response.json()

          if (error) {
            errorLogger(`Error retrieving profile for ${auid}, message: `, error, 'AuthContextProvider')
            setUser({})

            return
          }

          setUser((prevUser) => ({
            ...prevUser,
            uid,
            name: profileName
          }))
        }).catch((error) => {
          errorLogger(`Error retrieving profile for ${auid}, message=${error.toString()}`, 'AuthContextProvider')

          setUser({})
        })
    }

    if (!name) {
      fetchProfileAndSetLoginCookie()
    }
  }, [loginInfo])

  const handleRefreshToken = (refreshToken) => {
    setUser((prevUser) => ({
      ...prevUser,
      token: refreshToken
    }))
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      checkAndRefreshToken(loginInfo, handleRefreshToken)
    }, 5000)

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
