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
  const [cookies, setCookies] = useCookies(['token', 'name', 'auid'])

  useEffect(() => {
    const { cookie: appCookie } = getApplicationConfig()

    // If application config sets a user information, set that at login
    if (appCookie) {
      Object.keys(appCookie).forEach((key) => {
        setCookies(key, appCookie[key])
      })
    }
  }, [])

  const {
    token, auid, name
  } = cookies

  useEffect(() => {
    setUser({
      auid,
      name,
      token,
      providerId: 'MMT_2'
    })
  }, [cookies])

  const login = useCallback(() => {
    const { apiHost } = getApplicationConfig()
    Window.location.href = `${apiHost}/saml-login?target=${encodeURIComponent('/manage/collections')}`
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
