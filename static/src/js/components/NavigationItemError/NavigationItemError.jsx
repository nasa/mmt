import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { ListGroup } from 'react-bootstrap'
import classNames from 'classnames'

import './NavigationItemError.scss'

const NavigationItemError = ({
  error,
  visited,
  setFocusField
}) => {
  const [hasFocus, setHasFocus] = useState(false)

  const { message, property } = error

  const createId = () => {
    let errorProperty = property
    const split = property.split('.')
    const parent = split[1]
    if (errorProperty.startsWith(`.${parent}.${parent}`)) {
      errorProperty = errorProperty.replace(`.${parent}.${parent}`, parent)
    }

    if (errorProperty.startsWith('.')) {
      errorProperty = errorProperty.substring(1)
    }

    // TODO Do we need to add root_?
    return `root_${errorProperty.replace(/\./g, '_')}`
  }

  return (
    <div>
      <ListGroup.Item
        className={
          classNames([
            'navigation-item-error__item d-flex align-items-baseline border-0 ps-4 px-1 py-1',
            {
              'navigation-item-error__item--isFocused': hasFocus
            }
          ])
        }
        action
        onMouseOver={
          () => {
            setHasFocus(true)
          }
        }
        onMouseOut={
          () => {
            setHasFocus(false)
          }
        }
        onClick={
          () => {
            setFocusField(createId())
          }
        }
      >
        <i className={
          classNames([
            'eui-icon eui-icon--sm navigation-item__icon',
            {
              'eui-fa-circle-o navigation-item__icon--not-started': !visited
            },
            {
              'eui-fa-times-circle navigation-item__icon--error': visited
            }
          ])
        }
        />
        {/* // TODO format message, handle array fields, etc from ErrorList */}
        <span className="small">{message}</span>
      </ListGroup.Item>
    </div>
  )
}

NavigationItemError.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
    property: PropTypes.string
  }).isRequired,
  visited: PropTypes.bool.isRequired,
  setFocusField: PropTypes.func.isRequired
}

export default NavigationItemError
