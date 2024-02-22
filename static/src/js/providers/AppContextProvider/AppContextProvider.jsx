import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { useCookies } from 'react-cookie'
import useKeywords from '../../hooks/useKeywords'
import AppContext from '../../context/AppContext'
import { getApplicationConfig } from '../../utils/getConfig'
import decodeCookie from '../../utils/decodeCookie'
import isTokenExpired from '../../utils/isTokenExpired'
import refreshToken from '../../utils/refreshToken'

/**
 * @typedef {Object} AppContextProviderProps
 * @property {ReactNode} children The children to be rendered.

/**
 * Renders any children wrapped with AppContext.
 * @param {AppContextProviderProps} props
 *
 * @example <caption>Renders children wrapped with AppContext.</caption>
 *
 * return (
 *   <AppContextProvider>
 *     {children}
 *   </AppContextProvider>
 * )
 */
const AppContextProvider = ({ children }) => {
  const keywordsContext = useKeywords()
  const [originalDraft, setOriginalDraft] = useState()
  const [draft, setDraft] = useState()
  const [savedDraft, setSavedDraft] = useState()
  const [user, setUser] = useState({})

  // Name: 'User Name',
  // providerId: 'MMT_2'

  const { keywords } = keywordsContext

  const [cookies] = useCookies(['loginInfo'])
  const { token } = user
  const { tokenValue, tokenExp } = token || {}

  const {
    loginInfo
  } = cookies

  useEffect(() => {
    if (loginInfo) {
      const {
        auid, name, token: cookieToken
      } = decodeCookie(loginInfo)

      setUser({
        ...user,
        token: cookieToken,
        name,
        auid,
        providerId: 'MMT_2'
      })
    }
  }, [loginInfo])

  useEffect(() => {
    const interval = setInterval(async () => {
      if (tokenValue) {
        if (tokenExp) {
          console.log('time remaining ', new Date(tokenExp), new Date(), ((tokenExp.valueOf() - new Date().valueOf()) / 1000 / 60))
        }

        // Subtract 1 minute from the actual token expiration to decide if we should refresh
        const offsetTokenInfo = { ...token }
        offsetTokenInfo.tokenExp -= 60 * 1000 // Shorten it by 1 minute
        if (token && isTokenExpired(offsetTokenInfo)) {
          const newToken = await refreshToken(tokenValue)
          console.log('new refresh token=', newToken)
          setUser({
            ...user,
            token: newToken
          })
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [token])

  const login = useCallback(() => {
    const { apiHost } = getApplicationConfig()
    window.location.href = `${apiHost}/saml-login?target=${encodeURIComponent('/manage/collections')}`
  })

  const logout = useCallback(() => {
    setUser({})
  })

  const providerValue = useMemo(() => ({
    ...keywordsContext,
    draft,
    login,
    logout,
    originalDraft,
    savedDraft,
    setDraft,
    setOriginalDraft,
    setSavedDraft,
    setUser,
    user
  }), [
    draft,
    originalDraft,
    keywords,
    savedDraft,
    user,
    login,
    logout
  ])

  return (
    <AppContext.Provider value={providerValue}>
      {children}
    </AppContext.Provider>
  )
}

AppContextProvider.defaultProps = {
  children: null
}

AppContextProvider.propTypes = {
  children: PropTypes.node
}

export default AppContextProvider
