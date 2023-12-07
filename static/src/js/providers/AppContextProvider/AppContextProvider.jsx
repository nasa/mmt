import React, {
  useEffect,
  useMemo,
  useState
} from 'react'
import PropTypes from 'prop-types'

import useKeywords from '../../hooks/useKeywords'

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
  const keywordsContext = useKeywords()
  const [draft, setDraft] = useState()
  const [user, setUser] = useState({})

  useEffect(() => {
    setUser({
      token: 'ABC-1',
      providerId: 'MMT_2'
    })
  }, [])

  const { keywords } = keywordsContext

  const providerValue = useMemo(() => ({
    ...keywordsContext,
    draft,
    setDraft,
    user
  }), [
    draft,
    keywords,
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
