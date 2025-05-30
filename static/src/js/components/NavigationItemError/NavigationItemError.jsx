import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ListGroup from 'react-bootstrap/ListGroup'
import classNames from 'classnames'
import { upperFirst } from 'lodash-es'

import For from '../For/For'

import './NavigationItemError.scss'

/**
 * @typedef {Object} NavigationItemError
 * @property {String} className Class name to be applied to the component.
 * @property {Object} error Validation error to be displayed.
= * @property {Function} setFocusField A callback function to set a field as focused.
= * @property {String[]} visitedFields List of visited fields in the form.
 */

/**
 * Renders a NavigationItemError
 * @param {NavigationItemError} props
 *
 * @component
 * @example <caption>Render a NavigationItemError</caption>
 * return (
 *   <NavigationItemError />
 * )
 */
const NavigationItemError = ({
  className,
  error,
  setFocusField,
  visitedFields
}) => {
  const [hasFocus, setHasFocus] = useState(false)

  const {
    fieldName,
    errors,
    message = '',
    name,
    property
  } = error

  let focusId = property?.replace(/\./g, '_')
  if (property && property.startsWith('.')) {
    focusId = property.substring(1).replace(/\./g, '_')
  }

  let messageToDisplay = message

  if (!messageToDisplay.includes('required')) {
    messageToDisplay = `${name} ${messageToDisplay}`
  }

  messageToDisplay = upperFirst(messageToDisplay)
  if (fieldName) messageToDisplay = fieldName

  const visited = visitedFields.includes(focusId)

  return (
    <div className={className}>
      <ListGroup.Item
        className={
          classNames([
            'navigation-item-error__item d-flex align-items-baseline border-0 px-0 py-1',
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
        {
          !fieldName && (
            <i className={
              classNames([
                'eui-icon eui-icon--sm navigation-item-error__icon pe-2',
                {
                  'eui-fa-circle-o navigation-item-error__icon--not-started': !visited
                },
                {
                  'eui-fa-times-circle navigation-item-error__icon--error': visited
                }
              ])
            }
            />
          )
        }

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
              (nestedError, index) => {
                const key = `${JSON.stringify(nestedError)}-${index}`

                return (
                  <NavigationItemError
                    className="ps-3"
                    error={nestedError}
                    key={key}
                    setFocusField={setFocusField}
                    visitedFields={visitedFields}
                  />
                )
              }
            }
          </For>
        )
      }
    </div>
  )
}

NavigationItemError.defaultProps = {
  className: null,
  visitedFields: []
}

NavigationItemError.propTypes = {
  className: PropTypes.string,
  error: PropTypes.shape({
    fieldName: PropTypes.string,
    errors: PropTypes.arrayOf(
      PropTypes.shape({})
    ),
    message: PropTypes.string,
    name: PropTypes.string,
    property: PropTypes.string
  }).isRequired,
  setFocusField: PropTypes.func.isRequired,
  visitedFields: PropTypes.arrayOf(
    PropTypes.string
  )
}

export default NavigationItemError
