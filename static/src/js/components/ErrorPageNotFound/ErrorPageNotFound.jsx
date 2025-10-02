import React from 'react'

import { v4 as uuidv4 } from 'uuid'

import errorLogger from '@/js/utils/errorLogger'

import Header from '../Header/Header'

import './ErrorPageNotFound.scss'

const ErrorPageNotFound = () => {
  const guid = uuidv4()

  errorLogger(`404 Not Found see ${guid}`, 'user attempted to access a page that does not exist')

  return (
    <div
      className="d-flex flex-column w-100 flex-grow-0"
    >
      <Header noLogin />
      <div className="body--has-error">
        <div className="wrap">
          <h2 className="h1 pt-3">Sorry! The page you were looking for does not exist.</h2>
          <p>
            Please refer to the ID
            {' '}
            <strong>
              {guid}
            </strong>
            {' '}
            when contacting
            {' '}
            <a href="mailto:support@earthdata.nasa.gov">Earthdata Operations</a>
            .
          </p>
          <p>
            <a href="/">Click here</a>
            {' '}
            to return to the home page.
          </p>
          <div className="earth">
            <div className="orbit" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorPageNotFound
