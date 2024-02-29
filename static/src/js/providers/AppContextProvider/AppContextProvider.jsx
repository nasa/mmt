import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import useKeywords from '../../hooks/useKeywords'
import AppContext from '../../context/AppContext'
import useAuthContext from '../../hooks/useAuthContext'

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
  const { login, logout, user } = useAuthContext()
  const { addKeywordsData, keywords } = useKeywords()
  const [originalDraft, setOriginalDraft] = useState()
  const [draft, setDraft] = useState()
  const [savedDraft, setSavedDraft] = useState()

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
    setSavedDraft
  }), [
    user,
    draft,
    originalDraft,
    keywords,
    savedDraft
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
