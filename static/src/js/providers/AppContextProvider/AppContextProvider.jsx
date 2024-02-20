import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import PropTypes from 'prop-types'

import { useQuery } from '@apollo/client'
import useKeywords from '../../hooks/useKeywords'

import { GET_ACLS } from '../../operations/queries/getAcls'

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
  const [originalDraft, setOriginalDraft] = useState()
  const [draft, setDraft] = useState()
  const [savedDraft, setSavedDraft] = useState()
  const [user, setUser] = useState({})
  const [aclData, setAclData] = useState(null) // State to hold ACL data

  const { keywords } = keywordsContext

  useEffect(() => {
    setUser({
      name: 'User Name',
      token: 'ABC-1',
      providerId: 'MMT_2'
    })
  }, [])

  const login = useCallback(() => {
    setUser({
      name: 'User Name',
      token: 'ABC-1',
      providerId: 'MMT_2'
    })
  })

  const logout = useCallback(() => {
    setUser({})
  })

  // Fetch ACLs using useQuery hook
  useQuery(GET_ACLS, {
    variables: {
      params: {
        includeFullAcl: true,
        pageNum: 1,
        pageSize: 2000,
        permittedUser: user.id,
        target: 'PROVIDER_CONTEXT'
      }
    },
    onCompleted: (data) => {
      setAclData(data)
    },
    onError: (error) => {
      console.error('Error fetching ACLs:', error)
    }
  })

  const providerValue = useMemo(() => ({
    ...keywordsContext,
    aclData, // Include ACL data in the context value
    draft,
    login,
    logout,
    originalDraft,
    savedDraft,
    setDraft,
    setOriginalDraft,
    setSavedDraft,
    user
  }), [
    aclData, // Ensure context updates when ACL data changes
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
