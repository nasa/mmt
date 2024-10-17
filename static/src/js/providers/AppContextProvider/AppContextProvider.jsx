import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import useKeywords from '../../hooks/useKeywords'
import AppContext from '../../context/AppContext'

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
  const { addKeywordsData, keywords } = useKeywords()
  const [draft, setDraft] = useState()
  const [originalDraft, setOriginalDraft] = useState()
  const [providerId, setProviderId] = useState()
  const [revisionId, setRevisionId] = useState()
  const [savedDraft, setSavedDraft] = useState()

  const providerValue = useMemo(() => ({
    addKeywordsData,
    draft,
    keywords,
    originalDraft,
    providerId,
    savedDraft,
    setDraft,
    setOriginalDraft,
    setProviderId,
    setSavedDraft,
    revisionId,
    setRevisionId
  }), [
    draft,
    keywords,
    originalDraft,
    providerId,
    savedDraft,
    revisionId
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
