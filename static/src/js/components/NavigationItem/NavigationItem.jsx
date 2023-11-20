import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { ListGroup } from 'react-bootstrap'
import { kebabCase } from 'lodash'
import { useNavigate, useParams } from 'react-router'
import classNames from 'classnames'

import NavigationItemError from '../NavigationItemError/NavigationItemError'
import For from '../For/For'

import prefixProperty from '../../utils/prefixProperty'

import './NavigationItem.scss'

const NavigationItem = ({
  draft,
  section,
  validationErrors,
  visitedFields,
  setFocusField
}) => {
  const [hasFocus, setHasFocus] = useState(false)
  const {
    conceptId,
    sectionName
  } = useParams()
  const navigate = useNavigate()

  const { displayName } = section

  const isSectionDisplayed = kebabCase(displayName) === sectionName

  const hasValues = section.properties.some((propertyPrefix) => {
    const value = draft[propertyPrefix]

    return value !== undefined
  })

  const hasErrors = validationErrors.some((error) => {
    const { property } = error

    return section.properties.some((propertyPrefix) => prefixProperty(property).startsWith(`${prefixProperty(propertyPrefix)}`))
  })

  return (
    <div
      key={displayName}
    >
      <ListGroup.Item
        className={
          classNames([
            'navigation-item__item d-flex px-1 py-1 border-0',
            {
              'navigation-item__item--isFocused': hasFocus
            },
            {
              'navigation-item__item--isActive': isSectionDisplayed
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
            // Navigate to the correct form
            navigate(`../${conceptId}/${kebabCase(displayName)}`)

            // Ensure the window is scrolled to the top of the page
            window.scroll(0, 0)
          }
        }
      >
        <span>
          <i className={
            classNames([
              'eui-icon eui-icon--sm navigation-item__icon',
              {
                'eui-fa-circle-o navigation-item__icon--not-started': !hasValues && !hasErrors
              },
              {
                'eui-fa-times-circle navigation-item__icon--error': hasErrors && isSectionDisplayed
              },
              {
                'eui-fa-circle-o navigation-item__icon--error': hasErrors && !isSectionDisplayed
              },
              {
                'eui-check navigation-item__icon--pass': !hasErrors && hasValues
              }
            ])
          }
          />
          {displayName}
        </span>
      </ListGroup.Item>

      <For each={validationErrors}>
        {
          (error) => {
            if (!isSectionDisplayed) return null

            const { property } = error

            const visited = visitedFields.includes(prefixProperty(property))

            return (
              <NavigationItemError
                key={JSON.stringify(error)}
                error={error}
                visited={visited}
                setFocusField={setFocusField}
              />
            )
          }
        }
      </For>
    </div>
  )
}

NavigationItem.defaultProps = {
  validationErrors: []
}

NavigationItem.propTypes = {
  draft: PropTypes.shape({}).isRequired,
  section: PropTypes.shape({
    displayName: PropTypes.string,
    properties: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  validationErrors: PropTypes.arrayOf(
    PropTypes.shape({})
  ),
  visitedFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  setFocusField: PropTypes.func.isRequired
}

export default NavigationItem
