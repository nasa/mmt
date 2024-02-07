import React from 'react'
import PropTypes from 'prop-types'
import Col from 'react-bootstrap/Col'
import { FaQuestionCircle } from 'react-icons/fa'

import './Panel.scss'

/**
 * Renders a `Panel` component.
 *
 * This is intended be used within the `HomePage` component.
 *
 * @component
 * @example <caption>Renders a `Panel` component</caption>
 * return (
 *   <Panel title="This will display as the title">
 *     This text will be in the body of the panel
 *   </Panel>
 * )
 */
const Panel = ({
  children,
  title
}) => (
  <Col className="d-flex mb-4" sm={12} md={6}>
    <div
      className="panel__content bg-dark text-white p-4 border-start border-5 border-pink rounded-1"
      style={{ '--bs-text-opacity': 0.95 }}
    >
      <div className="d-flex align-items-center mb-3">
        <FaQuestionCircle className="me-2 d-block text-opacity-75" />
        <h2 className="h6 mb-0 text-uppercase fw-bold">
          {' '}
          {title}
        </h2>
      </div>
      <p className="mb-0">{children}</p>
    </div>
  </Col>
)

Panel.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
}

export default Panel
