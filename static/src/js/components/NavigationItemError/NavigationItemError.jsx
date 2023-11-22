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
  console.log('')
  console.log('')
  console.log('')
  console.log('🚀 ~ file: NavigationItemError.jsx:13 ~ error:', error)
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

  // Nested in Array
  //   {
  //     "name": "required",
  //     "property": ".Organizations.1.ShortName",
  //     "message": "must have required property 'ShortName'",
  //     "params": {
  //         "missingProperty": "ShortName"
  //     },
  //     "stack": "must have required property 'ShortName'",
  //     "schemaPath": "#/properties/Organizations/items/required"
  // }
  // Related Url (1 of 1) // need index from property and total length from metadata
  // Must have required property 'URL'
  // Must have required property 'URLContentType'
  // Must have required property 'Type'

  // Top level
  // {
  //   "name": "required",
  //   "property": "Name",
  //   "message": "must have required property 'Name'",
  //   "params": {
  //       "missingProperty": "Name"
  //   },
  //   "stack": "must have required property 'Name'",
  //   "schemaPath": "#/required"
  // }

  // Nested in an object
  // {
  //   "name": "required",
  //   "property": ".URL.URLValue",
  //   "message": "must have required property 'URL Value'",
  //   "params": {
  //       "missingProperty": "URLValue"
  //   },
  //   "stack": "must have required property 'URL Value'",
  //   "schemaPath": "#/properties/URL/required"
  // }

  // Nested in an object
  // {
  //   message: "must have required property 'MissingReason'",
  //   path: '.DOI.MissingReason',
  //   errorProperty: '.DOI.MissingReason'
  // }
  // DOI
  // Must have required property 'DOI'
  // Must have required property 'Missing Reason'
  // const isNestedItem = property.startsWith('.')
  // const path = createPath(property)
  // console.log('🚀 ~ file: NavigationItemError.jsx:92 ~ path:', path)
  // const regexp = /^(.*[^\\[]+)\[(\d+)\]/
  // const match = path.match(regexp)
  // console.log('🚀 ~ file: ErrorList.tsx:206 ~ ErrorList ~ walkErrorMap ~ match:', match)

  // let length
  // if (match && match[1]) {
  //   const matchedPath = match[1].substring(1)
  //   console.log('🚀 ~ file: NavigationItemError.jsx:139 ~ ummMetadata:', ummMetadata)
  //   console.log('🚀 ~ file: NavigationItemError.jsx:137 ~ matchedPath:', matchedPath)
  //   const results = get(ummMetadata, matchedPath)
  //   console.log('🚀 ~ file: NavigationItemError.jsx:139 ~ results:', results)
  //   length = results?.length
  // }

  // console.log('🚀 ~ file: NavigationItemError.jsx:134 ~ length:', length)

  // each error passed in is a single error, but if multiple errors are nested under a field they need to be grouped together

  let messageToDisplay = upperFirst(message)
  if (fieldName) messageToDisplay = fieldName

  const nestedErrors = () => {
    if (!errors) return null

    return (
      <For each={errors}>
        {
          (nestedError) => {
            console.log('🚀 ~ file: NavigationItemError.jsx:125 ~ nestedErrors ~ nestedError:', nestedError)

            return (
              <NavigationItemError
                className="ps-4"
                error={nestedError}
                setFocusField={setFocusField}
              />
            )
            // const {
            //   fieldName,
            //   message,
            //   visited
            // } = nestedError

            // let messageToDisplay = upperFirst(message)
            // if (fieldName) messageToDisplay = fieldName

            // return (
            //   <ListGroup.Item
            //     className={
            //       classNames([
            //         'navigation-item-error__item d-flex align-items-baseline border-0 ps-4 px-1 py-1',
            //         {
            //           'navigation-item-error__item--isFocused': hasFocus
            //         }
            //       ])
            //     }
            //     action
            //     onMouseOver={
            //       () => {
            //         setHasFocus(true)
            //       }
            //     }
            //     onMouseOut={
            //       () => {
            //         setHasFocus(false)
            //       }
            //     }
            //     onClick={
            //       () => {
            //         setFocusField(createId())
            //       }
            //     }
            //   >
            //     <i className={
            //       classNames([
            //         'eui-icon eui-icon--sm navigation-item__icon',
            //         {
            //           'eui-fa-circle-o navigation-item__icon--not-started': !visited
            //         },
            //         {
            //           'eui-fa-times-circle navigation-item__icon--error': visited
            //         }
            //       ])
            //     }
            //     />
            //     {/* // TODO format message, handle array fields, etc from ErrorList */}
            //     <span className="small">{messageToDisplay}</span>
            //   </ListGroup.Item>
            // )
          }
        }
      </For>
    )
  }

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
        {/* // TODO format message, handle array fields, etc from ErrorList */}
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
      {nestedErrors()}
    </div>
  )
}

NavigationItemError.propTypes = {
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
