import React from 'react'
import PropTypes from 'prop-types'

import ErrorBanner from '../ErrorBanner/ErrorBanner'

import parseError from '../../utils/parseError'

/**
 * ErrorBoundary component catches errors in its child components and displays a fallback UI.
 * @class ErrorBoundary
 * @extends React.Component
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    let errorMessage = error.message
    // Check to see if it is a known intermittent error from EDL (MMT-3923)
    if (error.graphQLErrors
      && (error.graphQLErrors[0].extensions?.code === 'INTERNAL_SERVER_ERROR')
      && error.graphQLErrors[0].path?.includes('acl')
      && error.graphQLErrors[0].path?.includes('groups')) {
      errorMessage = 'Error retrieving groups. Please refresh'
    }

    return {
      hasError: true,
      error: errorMessage
    }
  }

  render() {
    const { hasError, error } = this.state
    const { children } = this.props

    if (hasError) {
      return <ErrorBanner message={parseError(error)} />
    }

    return children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.shape({}).isRequired
}

export default ErrorBoundary
