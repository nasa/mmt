import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import useStatusMessages from '../../hooks/useStatusMessages'

import AppContext from '../../context/AppContext'

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
  const statusMessagesContext = useStatusMessages()
  const [draft, setDraft] = useState(null)

  const providerValue = useMemo(() => ({
    ...statusMessagesContext,
    draft,
    setDraft
  }), [draft])

  return (
    <AppContext.Provider value={providerValue}>
      {children}
    </AppContext.Provider>
  )
}

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default AppContextProvider
