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
  const [providerIds, setProviderIds] = useState([]) // State to hold providerIds

  const { keywords } = keywordsContext

  useEffect(() => {
    setUser({
      name: 'User Name',
      token: 'ABC-1',
      providerId: 'MMT_1'
    })
  }, [])

  const login = useCallback(() => {
    setUser({
      name: 'User Name',
      token: 'ABC-1',
      providerId: 'MMT_1'
    })
  })

  const logout = useCallback(() => {
    setUser({})
  })

  const handleProviderSelection = useCallback((providerId) => {
    setUser((prevUser) => ({
      ...prevUser,
      providerId
    }))
  }, [])

  // Fetch ACLs using useQuery hook
  const { data: aclData } = useQuery(GET_ACLS, {
    variables: {
      params: {
        includeFullAcl: true,
        pageNum: 1,
        pageSize: 2000,
        permittedUser: user.id,
        target: 'PROVIDER_CONTEXT'
      }
    },
    onError: (error) => {
      console.error('Error fetching ACLs:', error)
    }
  })

  // Extract provider IDs from ACL data and update state
  useEffect(() => {
    if (aclData && aclData.acls && aclData.acls.items.length > 0) {
      const providerList = aclData.acls.items.map(({ acl }) => acl.provider_identity.provider_id)
      setProviderIds(providerList)
    }
  }, [aclData])

  const providerValue = useMemo(() => ({
    ...keywordsContext,
    draft,
    handleProviderSelection, // Include the handleProviderSelection function in the context value
    login,
    logout,
    originalDraft,
    providerIds, // Include providerIds in the context value
    savedDraft,
    setDraft,
    setOriginalDraft,
    setSavedDraft,
    user
  }), [
    draft,
    handleProviderSelection,
    originalDraft,
    keywords,
    providerIds, // Include providerIds in the context value
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
