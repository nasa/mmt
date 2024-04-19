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
    return {
      hasError: true,
      error: error.message
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
