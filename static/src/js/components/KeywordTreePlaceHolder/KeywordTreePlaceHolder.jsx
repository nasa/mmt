import React from 'react'
import PropTypes from 'prop-types'

import './KeywordTreePlaceHolder.scss'
/**
 * KeywordTreePlaceHolder Component
 *
 * This component renders a placeholder message for the keyword tree.
 * It's typically used when the keyword tree is empty or loading.
 *
 * @param {Object} props - The component props
 * @param {string} props.message - The message to display in the placeholder
 * @returns {React.Element} A div containing the placeholder message
 */
export const KeywordTreePlaceHolder = ({ message }) => (
  <div className="keyword-tree-placeholder">
    {message}
  </div>
)

KeywordTreePlaceHolder.propTypes = {
  message: PropTypes.string.isRequired
}
