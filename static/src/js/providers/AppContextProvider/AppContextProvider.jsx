import React, { useEffect, useMemo, useState } from 'react'
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
  const [draft, setDraft] = useState()
  const [user, setUser] = useState({})

  useEffect(() => {
    setUser({
      token: 'ABC-1',
      providerId: 'MMT_2'
    })
  }, [])

  const providerValue = useMemo(() => ({
    ...statusMessagesContext,
    draft,
    setDraft,
    user
  }), [draft, user])

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
