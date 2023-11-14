import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { ListGroup } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import classNames from 'classnames'

import './NavigationItemError.scss'

const NavigationItemError = ({
  error,
  visited,
  setFocusField
}) => {
  const [hasFocus, setHasFocus] = useState(false)
  const navigate = useNavigate()

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
    <div
      // data-testid={`navigationitem--${kebabCase(displayName)}`}
      // className={`navigation-item ${focusClass}`}
      // key={displayName}
    >
      <ListGroup.Item
        // className={`navigation-item ${focusClass}`}
        className={
          classNames([
            'navigation-item-error__item',
            {
              'navigation-item-error__item--isFocused': hasFocus
            }
          ])
        }
        // data-testid={`navigationitem--listgroup.item__${kebabCase(displayName)}`}
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
        // key={displayName}
        onClick={
          () => {
            console.log('clicked')
            setFocusField(createId())
            // TODO this needs to focus on clicked field
            // navigate(`../${conceptId}/${kebabCase(displayName)}`)
            // editor.setFocusField('')
            // editor.setArrayAutoScroll(null)
            // editor.navigateTo(section)
            // window.scroll(0, 0)
            // navigate(`/${editor.documentType}/${id}/edit/${displayName.replace(/\s/g, '_')}`, { replace: false })
          }
        }
      >
        <span>
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
          {message}
        </span>
      </ListGroup.Item>
    </div>
  )
}

NavigationItemError.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
    property: PropTypes.string
  }).isRequired,
  visited: PropTypes.bool.isRequired
}

export default NavigationItemError
