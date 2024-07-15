import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import './ErrorPageNotFound.scss'

export default function ErrorPageNotFound() {
  const guid = uuidv4()

  return (
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
  )
}
