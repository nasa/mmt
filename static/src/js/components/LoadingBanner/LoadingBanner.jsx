import React from 'react'
import PropTypes from 'prop-types'

import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'

/**
 * LoadingBanner
 * @typedef {Object} LoadingBanner
 * @property {String} dataTestId A test id for the page
 */

/**
 * Renders a Loading Banner
 * @param {LoadingBanner} props
 */
export const LoadingBanner = ({
  dataTestId
}) => (
  <Row className="justify-content-center mt-5">
    <Spinner
      animation="grow"
      variant="primary"
      data-testid={dataTestId}
    />
  </Row>
)

LoadingBanner.propTypes = {
  dataTestId: PropTypes.string
}

LoadingBanner.defaultProps = {
  dataTestId: 'loading-banner__spinner'
}

export default LoadingBanner
