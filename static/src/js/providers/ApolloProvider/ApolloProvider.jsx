import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  ApolloClient,
  ApolloProvider as StandardApolloProvider,
  InMemoryCache,
  createHttpLink
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { useCookies } from 'react-cookie'
import useAppContext from '../../hooks/useAppContext'
import { getApplicationConfig } from '../../utils/getConfig'
import isTokenExpired from '../../utils/isTokenExpired'
import refreshToken from '../../utils/refreshToken'
import decodeCookie from '../../utils/decodeCookie'

/**
 * @typedef {Object} ApolloProviderProps
 * @property {ReactNode} children The children to be rendered.

/**
 * Renders any children wrapped with ApolloProvider.
 * @param {ApolloProviderProps} props
 *
 * @example <caption>Renders children wrapped with ApolloProvider.</caption>
 *
 * return (
 *   <ApolloProvider>
 *     {children}
 *   </ApolloProvider>
 * )
 */
const ApolloProvider = ({ children }) => {
  const { graphQlHost } = getApplicationConfig()
  const { user, setUser } = useAppContext()
  const { token } = user || {}
  const { tokenValue, tokenExp } = token || {}

  const httpLink = createHttpLink({
    uri: graphQlHost
  })

  console.log('using token ', tokenValue)

  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      // Todo pull this from config.
      Origin: 'https://mmt.sit.earthdata.nasa.gov',
      Authorization: tokenValue
    }
  }))

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache'
      },
      watchQuery: {
        fetchPolicy: 'no-cache'
      }
    }
  })

  const [cookies] = useCookies(['loginInfo'])

  const {
    loginInfo
  } = cookies

  useEffect(() => {
    console.log('use effect on login info')
    if (loginInfo) {
      const {
        auid, name, token: cookieToken
      } = decodeCookie(loginInfo)

      setUser({
        ...user,
        token: cookieToken,
        name,
        auid,
        providerId: 'MMT_2'
      })
    }
  }, [loginInfo])

  useEffect(() => {
    const interval = setInterval(async () => {
      if (token?.tokenValue) {
        if (tokenExp) {
          console.log('time remaining ', new Date(tokenExp), new Date(), ((tokenExp.valueOf() - new Date().valueOf()) / 1000 / 60))
        }

        // Subtract 1 minute from the actual token expiration to decide if we should refresh
        const offsetTokenInfo = { ...token }
        offsetTokenInfo.tokenExp -= 60 * 1000 // Shorten it by 1 minute
        if (token && isTokenExpired(offsetTokenInfo)) {
          const newToken = await refreshToken(token.tokenValue)
          console.log('new refresh token=', newToken)
          setUser({
            ...user,
            token: newToken
          })
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [token])

  return (
    <StandardApolloProvider client={client}>
      {children}
    </StandardApolloProvider>
  )
}

ApolloProvider.defaultProps = {
  children: null
}

ApolloProvider.propTypes = {
  children: PropTypes.node
}

export default ApolloProvider
