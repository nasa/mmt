import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { useLazyQuery } from '@apollo/client'
import errorLogger from '../../utils/errorLogger'
import { useCookies } from 'react-cookie'
import useKeywords from '../../hooks/useKeywords'

import { GET_ACLS } from '../../operations/queries/getAcls'

import useNotificationsContext from '../../hooks/useNotificationsContext'
import AppContext from '../../context/AppContext'
import { getApplicationConfig } from '../../utils/getConfig'
import decodeCookie from '../../utils/decodeCookie'
import checkAndRefreshToken from '../../utils/checkAndRefreshToken'

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

  const { addNotification } = useNotificationsContext() || {}

  const { keywords } = keywordsContext

  const [cookies] = useCookies(['loginInfo'])
  const { token } = user

  const {
    loginInfo
  } = cookies

  useEffect(() => {
    if (loginInfo) {
      const {
        auid, name, token: cookieToken
      } = decodeCookie(loginInfo)

      setUser({
        ...user,
        token: cookieToken,
        name,
        auid
      })
    }
  }, [loginInfo])

  useEffect(() => {
    const interval = setInterval(async () => {
      checkAndRefreshToken(token, user, setUser)
    }, 1000)

    return () => clearInterval(interval)
  }, [token])

  const login = useCallback(() => {
    const { apiHost } = getApplicationConfig()
    window.location.href = `${apiHost}/saml-login?target=${encodeURIComponent('/manage/collections')}`
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
  const [getProvider] = useLazyQuery(GET_ACLS, {
    variables: {
      params: {
        includeFullAcl: true,
        pageNum: 1,
        pageSize: 2000,
        permittedUser: user.id,
        target: 'PROVIDER_CONTEXT'
      }
    },
    onCompleted: (getProviderData) => {
      const { acls } = getProviderData
      const { items } = acls

      if (items.length > 0) {
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
          message: 'User is not provisioned.  Please contact support.',
          variant: 'danger'
        })
      }
    },
    onError: (getProviderError) => {
      addNotification({
        message: 'An error occurred while fetching providers.',
        variant: 'danger'
      })

      // Send the error to the errorLogger
      errorLogger(getProviderError, 'Error fetching providers')
    }
  })

  useEffect(() => {
    getProvider()
  }, [])

  const providerValue = useMemo(() => ({
    ...keywordsContext,
    draft,
    setProviderId,
    login,
    logout,
    originalDraft,
    providerIds,
    savedDraft,
    setDraft,
    setOriginalDraft,
    setSavedDraft,
    setUser,
    user
  }), [
    draft,
    originalDraft,
    keywords,
    providerIds,
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
