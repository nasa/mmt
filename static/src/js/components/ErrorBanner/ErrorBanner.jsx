import React from 'react'
import PropTypes from 'prop-types'

import {
  Alert,
  Row,
  Col
} from 'react-bootstrap'

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
