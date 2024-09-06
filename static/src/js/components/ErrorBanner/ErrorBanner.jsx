import { Button } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
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
  message,
  previousURL
}) => {
  const [hasCMRLagError, setHasCMRLagError] = useState(false)
  const [conceptIdDoesNotExist, setConceptIdDoesNotExist] = useState(false)
  const currentURL = window.location.pathname
  const conceptKeywords = ['/collections/', '/variables/', '/services/', '/tools/']

  // Catches if we are coming from a published record, indicating this is a CMR lag error
  useEffect(() => {
    if (previousURL && conceptKeywords.some((keyword) => previousURL.includes(keyword))) {
      setHasCMRLagError(true)
    }

    if (currentURL && conceptKeywords.some((keyword) => currentURL.includes(keyword))) {
      setConceptIdDoesNotExist(true)
    }
  }, [])

  return (
    hasCMRLagError ? (
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

            <p data-testid={dataTestId}>{conceptIdDoesNotExist ? 'This record does not exist' : message}</p>
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
