import React, {
  useCallback,
  useMemo,
  useState
} from 'react'
import PropTypes from 'prop-types'
import useKeywords from '../../hooks/useKeywords'
import AppContext from '../../context/AppContext'
import useAuthContext from '../../hooks/useAuthContext'

/**
 * @typedef {Object} AppContextProviderProps
 * @property {ReactNode} children The children to be rendered.

/**
 * Renders any children wrapped with access to AppContext.
 * @param {AppContextProviderProps} props
 *
 * @example <caption>Renders children wrapped with access to AppContext.</caption>
 *
 * return (
 *   <AppContextProvider>
 *     {children}
 *   </AppContextProvider>
 * )
 */
const AppContextProvider = ({ children }) => {
  const {
    login,
    logout,
    setUser,
    updateLoginInfo,
    user
  } = useAuthContext()

  const { addKeywordsData, keywords } = useKeywords()
  const [originalDraft, setOriginalDraft] = useState()
  const [draft, setDraft] = useState()
  const [savedDraft, setSavedDraft] = useState()
  const [providerIds, setProviderIds] = useState([])
  const [pageTitle, setPageTitle] = useState([])

  const setProviderId = useCallback((providerId) => {
    setUser((prevUser) => ({
      ...prevUser,
      providerId
    }))
  }, [user])

  const providerValue = useMemo(() => ({
    addKeywordsData,
    draft,
    keywords,
    login,
    logout,
    originalDraft,
    providerIds,
    savedDraft,
    setDraft,
    setOriginalDraft,
    setProviderId,
    setProviderIds,
    setSavedDraft,
    updateLoginInfo,
    user,
    pageTitle,
    setPageTitle
  }), [
    draft,
    keywords,
    originalDraft,
    providerIds,
    savedDraft,
    pageTitle,
    user
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
