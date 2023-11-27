import React from 'react'
import PropTypes from 'prop-types'
import Alert from 'react-bootstrap/Alert'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export const ErrorBanner = ({ message, dataTestId }) => (
  <Row>
    <Col>
      <Alert variant="danger">
        <Alert.Heading>Sorry!</Alert.Heading>
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
