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
import checkAndRefreshToken from '../../utils/checkAndRefreshToken'

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

  const { keywords } = keywordsContext

  const [cookies, setCookie] = useCookies(['loginInfo'])
  const { token } = user

  const {
    loginInfo
  } = cookies

  useEffect(() => {
    if (loginInfo) {
      const {
        auid, name, token: cookieToken
      } = loginInfo

      setUser((prevUser) => ({
        ...prevUser,
        token: cookieToken,
        name,
        auid,
        providerId: 'MMT_2'
      }))
    }
  }, [loginInfo])

  useEffect(() => {
    const interval = setInterval(async () => {
      checkAndRefreshToken(token, loginInfo, setCookie)
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
