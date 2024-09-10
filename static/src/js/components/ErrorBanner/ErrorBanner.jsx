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
 * @property {String} previousURL A string that is sent down from PublishPreview only
 */

/**
 * Renders a ErrorBanner component
 * @param {ErrorBanner} props
 */
export const ErrorBanner = ({
  dataTestId,
  message,
  previousURL
}) => {
  const currentURL = window.location.pathname
  const conceptKeywords = ['/collections/', '/variables/', '/services/', '/tools/']

  // Checks to see that the url is a concept URL,
  // indicating that graphQL made a call that returned null
  const isConceptUrl = (url) => {
    if (conceptKeywords.some((keyword) => url.includes(keyword))) {
      return true
    }

    return false
  }

  return (
    (previousURL && isConceptUrl(previousURL)) ? (
      <div>
        <Alert className="fst-italic fs-6" variant="warning">
          <i className="eui-icon eui-fa-info-circle" />
          {' '}
          Some operations may take time to populate in the Common Metadata Repository.
          If you are not seeing what you expect below, please
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
            refresh the page
          </Button>
        </Alert>
      </div>
    ) : (
      <Row>
        <Col>
          <Alert variant="danger">
            <Alert.Heading>Sorry!</Alert.Heading>

            <span className="visually-hidden">{' '}</span>

            <p data-testid={dataTestId}>{isConceptUrl(currentURL) ? 'This record does not exist' : message}</p>
          </Alert>
        </Col>
      </Row>
    )
  )
}

ErrorBanner.propTypes = {
  dataTestId: PropTypes.string,
  message: PropTypes.string.isRequired,
  previousURL: PropTypes.string
}

ErrorBanner.defaultProps = {
  dataTestId: 'error-banner__message',
  previousURL: null
}

export default ErrorBanner
