import React, {
  useCallback,
  useEffect,
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
    login, logout, user, updateLoginInfo, setUser
  } = useAuthContext()
  const { addKeywordsData, keywords } = useKeywords()
  const [originalDraft, setOriginalDraft] = useState()
  const [draft, setDraft] = useState()
  const [savedDraft, setSavedDraft] = useState()
  const [providerIds, setProviderIds] = useState([])

  const setProviderId = useCallback((providerId) => {
    setUser((prevUser) => ({
      ...prevUser,
      providerId
    }))
  }, [user])

  useEffect(() => {
    let expires = new Date()
    expires.setMinutes(expires.getMinutes() + 15)
    expires = new Date(expires)

    setUser((prevUser) => ({
      ...prevUser,
      providerId: 'MMT_2',
      token: {
        tokenValue: 'ABC-1',
        tokenExp: expires
      }
    }))
  }, [])

  const providerValue = useMemo(() => ({
    user,
    login,
    logout,
    addKeywordsData,
    keywords,
    draft,
    originalDraft,
    savedDraft,
    setDraft,
    setOriginalDraft,
    setSavedDraft,
    updateLoginInfo,
    setProviderId,
    setProviderIds,
    providerIds
  }), [
    JSON.stringify(user),
    JSON.stringify(draft),
    JSON.stringify(originalDraft),
    JSON.stringify(keywords),
    JSON.stringify(savedDraft),
    JSON.stringify(providerIds)
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
