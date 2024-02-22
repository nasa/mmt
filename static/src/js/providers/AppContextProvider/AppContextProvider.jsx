import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext
} from 'react'
import PropTypes from 'prop-types'
import { useLazyQuery } from '@apollo/client'
import errorLogger from '../../utils/errorLogger'
import useKeywords from '../../hooks/useKeywords'

import { GET_ACLS } from '../../operations/queries/getAcls'

import AppContext from '../../context/AppContext'
import NotificationsContext from '../../context/NotificationsContext'

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

  const contextValue = useContext(NotificationsContext)
  const { addNotification } = contextValue || {}

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

  const setProviderId = useCallback((providerId) => {
    setUser((prevUser) => ({
      ...prevUser,
      providerId
    }))
  }, [])

  // Fetch providers using useQuery hook
  const [getProviders] = useLazyQuery(GET_ACLS, {
    variables: {
      params: {
        includeFullAcl: true,
        pageNum: 1,
        pageSize: 2000,
        permittedUser: user.id,
        target: 'PROVIDER_CONTEXT'
      }
    },
    onCompleted: ({ acls }) => {
      // Check if acls and acls.items are not undefined
      // and if items array has at least one item
      if (acls && acls.items && acls.items.length > 0) {
        const { items } = acls
        const providerList = items.map(({ acl }) => acl.provider_identity.provider_id)
        setProviderIds(providerList)

        // Check if user does not have providerId
        // and set it to the first providerId if available
        if (!user.providerId && providerList.length > 0) {
          setProviderId(providerList[0])
        }
      } else {
        // Display notification for no providers available
        addNotification({
          message: 'No providers available.',
          variant: 'warning'
        })
      }
    },
    onError: (getProviderError) => {
      // Console.error('Error fetching ACLs:', getProviderError)
      // Add an error notification
      addNotification({
        message: 'An error occurred while fetching providers.',
        variant: 'danger'
      })

      // Send the error to the errorLogger
      errorLogger(getProviderError, 'Error fetching providers')
    }
  })

  useEffect(() => {
    getProviders()
  }, [])

  const providerValue = useMemo(() => ({
    ...keywordsContext,
    draft,
    setProviderId,
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
