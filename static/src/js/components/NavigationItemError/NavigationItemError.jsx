import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { ListGroup } from 'react-bootstrap'
import classNames from 'classnames'
import { upperFirst } from 'lodash'

import For from '../For/For'

import './NavigationItemError.scss'

const NavigationItemError = ({
  className,
  error,
  setFocusField
}) => {
  const [hasFocus, setHasFocus] = useState(false)

  const {
    fieldName,
    errors,
    message,
    property,
    visited
  } = error

  let focusId = property?.replace(/\./g, '_')
  if (property && property.startsWith('.')) {
    focusId = property.substring(1).replace(/\./g, '_')
  }

  let messageToDisplay = upperFirst(message)
  if (fieldName) messageToDisplay = fieldName

  return (
    <div className={className}>
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
            setFocusField(focusId)
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
        <span
          className={
            classNames([
              'small',
              {
                'fw-bold': fieldName
              }
            ])
          }
        >
          {messageToDisplay}
        </span>
      </ListGroup.Item>
      {
        errors && (
          <For each={errors}>
            {
              (nestedError) => (
                <NavigationItemError
                  className="ps-4"
                  error={nestedError}
                  setFocusField={setFocusField}
                />
              )
            }
          </For>
        )
      }
    </div>
  )
}

NavigationItemError.defaultProps = {
  className: null
}

NavigationItemError.propTypes = {
  className: PropTypes.string,
  error: PropTypes.shape({
    fieldName: PropTypes.string,
    errors: PropTypes.arrayOf(
      PropTypes.shape({})
    ),
    message: PropTypes.string,
    property: PropTypes.string,
    visited: PropTypes.bool
  }).isRequired,
  setFocusField: PropTypes.func.isRequired
}

export default NavigationItemError
