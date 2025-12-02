import React from 'react'
import PropTypes from 'prop-types'

import Header from '../Header/Header'

import './ErrorUnauthorizedAccess.scss'

const ErrorUnauthorizedAccess = ({ errorType }) => {
  const errorMessages = {
    mmt: 'It appears you are not provisioned with the proper permissions to access MMT.',
    nonNasaMMT: 'It appears you are not provisioned with the proper permissions to access the MMT for Non-NASA Users.'
  }

  return (
    <div className="d-flex flex-column w-100 flex-grow-0">
      <Header noLogin />
      <div className="body--has-error">
        <div className="wrap">
          <h2 className="h1 pt-3">{errorMessages[errorType]}</h2>
          <p>
            Please try again or contact
            {' '}
            <a href="mailto:support@earthdata.nasa.gov">Earthdata Operations</a>
            .
          </p>
          <div className="earth">
            <div className="orbit" />
          </div>
        </div>
      </div>
    </div>
  )
}

ErrorUnauthorizedAccess.propTypes = {
  errorType: PropTypes.oneOf(['mmt', 'nonNasaMMT']).isRequired
}

export default ErrorUnauthorizedAccess
