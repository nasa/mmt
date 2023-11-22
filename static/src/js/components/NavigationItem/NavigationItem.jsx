import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ListGroup from 'react-bootstrap/ListGroup'
import { get, kebabCase } from 'lodash'
import { useNavigate, useParams } from 'react-router'
import classNames from 'classnames'

import NavigationItemError from '../NavigationItemError/NavigationItemError'
import For from '../For/For'

import prefixProperty from '../../utils/prefixProperty'

import './NavigationItem.scss'
import createPath from '../../utils/createPath'

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

//   [
//     {
//         "name": "required",
//         "property": "Name",
//         "message": "must have required property 'Name'",
//         "params": {
//             "missingProperty": "Name"
//         },
//         "stack": "must have required property 'Name'",
//         "schemaPath": "#/required"
//     },
//     {
//         "name": "required",
//         "property": ".URL.URLContentType",
//         "message": "must have required property 'URL Content Type'",
//         "params": {
//             "missingProperty": "URLContentType"
//         },
//         "stack": "must have required property 'URL Content Type'",
//         "schemaPath": "#/properties/URL/required"
//     },
//     {
//         "name": "required",
//         "property": ".URL.Type",
//         "message": "must have required property ' Type'",
//         "params": {
//             "missingProperty": "Type"
//         },
//         "stack": "must have required property ' Type'",
//         "schemaPath": "#/properties/URL/required"
//     },
//     {
//         "name": "required",
//         "property": ".URL.URLValue",
//         "message": "must have required property 'URL Value'",
//         "params": {
//             "missingProperty": "URLValue"
//         },
//         "stack": "must have required property 'URL Value'",
//         "schemaPath": "#/properties/URL/required"
//     }
// ]

  // TODO find total length to add on to array groups - Organzations (1 of 1)
  // TODO errors are not correct for array groups
  // ? Must have required property 'Organizations' -- correct
  // ? Must NOT have fewer than 1 items - current
  // TODO nested array fields?
  const errorsWithGroups = {}
  const errorsWithoutGroups = []
  validationErrors.forEach((validationError) => {
    const { property } = validationError
    const visited = visitedFields.includes(prefixProperty(property))
    console.log('🚀 ~ file: NavigationItem.jsx:109 ~ validationErrors.forEach ~ validationError:', validationError)

    const isGrouped = property.startsWith('.')
    console.log('🚀 ~ file: NavigationItem.jsx:90 ~ validationErrors.forEach ~ isGrouped:', isGrouped)

    if (isGrouped) {
      const path = createPath(property)
      console.log('🚀 ~ file: NavigationItem.jsx:95 ~ validationErrors.forEach ~ path:', path)
      const regexp = /^(.*[^\\[]+)\[(\d+)\]/
      const match = path.match(regexp)
      console.log('🚀 ~ file: NavigationItem.jsx:95 ~ validationErrors.forEach ~ match:', match)

      let fieldName
      if (match && match[1]) {
        // This is an array field
        [, fieldName] = match[1].split('.')
        const index = parseInt(match[2], 10)

        const matchedPath = match[1].substring(1)
        console.log('🚀 ~ file: NavigationItem.jsx:111 ~ validationErrors.forEach ~ matchedPath:', matchedPath)
        const results = get(draft, matchedPath)
        console.log('🚀 ~ file: NavigationItem.jsx:113 ~ validationErrors.forEach ~ results:', results)

        // If the
        const length = Math.max(results?.length || 1, index + 1)

        fieldName = `${fieldName} (${parseInt(index, 10) + 1} of ${length})`
      } else {
        // This is an object
        const parts = property.split('.');
        [, fieldName] = parts
      }

      errorsWithGroups[fieldName] ||= []
      errorsWithGroups[fieldName] = [
        ...errorsWithGroups[fieldName],
        {
          ...validationError,
          visited
        }
      ]
    } else {
      errorsWithoutGroups.push({
        ...validationError,
        visited
      })
    }
  })

  console.log('🚀 ~ file: NavigationItem.jsx:99 ~ validationErrors.forEach ~ errorsWithGroups:', errorsWithGroups)

  const hasErrors = validationErrors.some((error) => {
    const { property } = error

    return section.properties.some((propertyPrefix) => prefixProperty(property).startsWith(`${prefixProperty(propertyPrefix)}`))
  })
  console.log('🚀 ~ file: NavigationItem.jsx:44 ~ hasErrors ~ validationErrors:', validationErrors)

  const errors = [
    ...errorsWithoutGroups,
    ...Object.keys(errorsWithGroups).map((fieldName) => ({
      fieldName,
      errors: errorsWithGroups[fieldName]
    }))
  ]
  console.log('🚀 ~ file: NavigationItem.jsx:120 ~ errors:', errors)

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

      <For each={errors}>
        {
          (error) => {
            if (!isSectionDisplayed) return null

            return (
              <NavigationItemError
                key={JSON.stringify(error)}
                error={error}
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
