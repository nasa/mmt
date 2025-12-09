import React from 'react'
import { useLocation } from 'react-router-dom'

import Header from '../Header/Header'

import './ErrorUnauthorizedAccess.scss'

const ErrorUnauthorizedAccess = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const errorType = queryParams.get('errorType') || 'default'
  const errorMessages = {
    deniedAccessMMT: 'It appears you are not provisioned with the proper permissions to access MMT.',
    deniedNonNasaAccessMMT: 'It appears you are not provisioned with the proper permissions to access the MMT for Non-NASA Users.',
    default: 'An unknown error occurred.'
  }

  return (
    <div className="d-flex flex-column w-100 flex-grow-0">
      <Header noLogin />
      <div className="body--has-error">
        <div className="wrap">
          <h2 className="h1 pt-3">
            {errorMessages[errorType] || errorMessages.default}
          </h2>
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

export default ErrorUnauthorizedAccess
