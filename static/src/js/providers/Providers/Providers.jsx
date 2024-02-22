import React from 'react'
import PropTypes from 'prop-types'

import AppContextProvider from '../AppContextProvider/AppContextProvider'
import NotificationsContextProvider from '../NotificationsContextProvider/NotificationsContextProvider'
// Import ApolloProvider from '../ApolloProvider/ApolloProvider'

/**
 * @typedef {Object} ProvidersProps
 * @property {ReactNode} children The children to be rendered.

/**
 * Renders any children wrapped with the application wide Providers
 * @param {ProvidersProps} props
 *
 * @example <caption>Renders children wrapped with context providers.</caption>
 *
 * return (
 *   <Providers>
 *     {children}
 *   </Providers>
 * )
 */
const Providers = ({ children }) => {
  const providers = [
    <AppContextProvider key="provider_app-context" />,
    // <ApolloProvider key="apollo_provider-context" />,
    <NotificationsContextProvider key="provider_notifications-context" />
  ]

  // Combine the Providers into a single Provider component
  return providers.reduceRight(
    (providerChildren, parent) => React.cloneElement(parent, { children: providerChildren }),
    children
  )
}

Providers.propTypes = {
  children: PropTypes.node.isRequired
}

export default Providers
