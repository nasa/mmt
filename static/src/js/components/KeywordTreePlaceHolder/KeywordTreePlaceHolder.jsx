import PropTypes from 'prop-types'
import React from 'react'

import './KeywordTreePlaceHolder.scss'

export const KeywordTreePlaceHolder = ({ message }) => (
  <div className="keyword-tree-placeholder">
    {message}
  </div>
)

KeywordTreePlaceHolder.propTypes = {
  message: PropTypes.string.isRequired
}
