import React from 'react'
import PropTypes from 'prop-types'
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
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
}) => (
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

ErrorBanner.propTypes = {
  dataTestId: PropTypes.string,
  message: PropTypes.string.isRequired
}

ErrorBanner.defaultProps = {
  dataTestId: 'error-banner__message'
}

export default ErrorBanner
