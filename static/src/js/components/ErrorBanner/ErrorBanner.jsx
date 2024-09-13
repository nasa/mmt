import { Button } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import PropTypes from 'prop-types'
import React from 'react'
import Row from 'react-bootstrap/Row'

/**
 * @typedef {Object} ErrorBannerProps
 * @property {String} dataTestId A data-testid for the error message
 * @property {String} message A message displaying what error has occurred.
 */

/**
 * Renders a ErrorBanner component
 * @param {ErrorBanner} props
 */
export const ErrorBanner = ({
  dataTestId,
  message
}) => {
  const knownCMRLagErrors = ['draft is null', 'concept is null']

  // Checks to see if error message is a known CMR Lag Error Message
  const isKnownCMRLagError = () => {
    if (knownCMRLagErrors.some((knownError) => message.includes(knownError))) {
      return true
    }

    return false
  }

  return (
    (isKnownCMRLagError()) ? (
      <div>
        <Alert className="fst-italic fs-6" variant="warning">
          <i className="eui-icon eui-fa-info-circle" />
          {' '}
          Some operations may take time to populate in the Common Metadata Repository.
          If you are not seeing what you expect below, consider
          {' '}
          <Button
            onClick={() => window.location.reload()}
            className="text-decoration-underline"
            style={
              {
                background: 'none',
                border: 'none',
                padding: 0,
                color: 'blue',
                textDecoration: 'underline',
                cursor: 'pointer'
              }
            }
          >
            refreshing the page
          </Button>
          .
          {' '}
          If it has been over 24 hours and your record has
          {' '}
          not been updated, please contact support@earthdata.nasa.gov.
        </Alert>
      </div>
    ) : (
      <Row>
        <Col>
          <Alert variant="danger">
            <Alert.Heading>Sorry!</Alert.Heading>

            <span className="visually-hidden">{' '}</span>

            <p data-testid={dataTestId}>{message}</p>
          </Alert>
        </Col>
      </Row>
    )
  )
}

ErrorBanner.propTypes = {
  dataTestId: PropTypes.string,
  message: PropTypes.string.isRequired
}

ErrorBanner.defaultProps = {
  dataTestId: 'error-banner__message'
}

export default ErrorBanner
