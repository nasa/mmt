import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ListGroup from 'react-bootstrap/ListGroup'
import { useNavigate, useParams } from 'react-router'
import classNames from 'classnames'
import { cloneDeep } from 'lodash-es'

import For from '../For/For'
import NavigationItemError from '../NavigationItemError/NavigationItemError'

import buildValidationErrors from '../../utils/buildValidationErrors'
import createPath from '../../utils/createPath'
import removeEmpty from '../../utils/removeEmpty'
import prefixProperty from '../../utils/prefixProperty'
import toKebabCase from '../../utils/toKebabCase'

import './NavigationItem.scss'

/**
 * @typedef {Object} NavigationItem
 * @property {Object} draft Draft metadata.
 * @property {Object} section A single form section configuration.
 * @property {Integer} sectionIndex The index of the section being displayed.
 * @property {Function} setFocusField A callback function to set a field as focused.
 * @property {Object[]} validationErrors List of validation errors generated by the RJSF validator.
 * @property {String[]} visitedFields List of fields that have been visisted by the user.
 */

/**
 * Renders a NavigationItem
 * @param {NavigationItem} props
 *
 * @component
 * @example <caption>Render a NavigationItem</caption>
 * return (
 *   <NavigationItem />
 * )
 */
const NavigationItem = ({
  draft,
  // TODO MMT-3479
  // required,
  section,
  sectionIndex,
  setFocusField,
  validationErrors,
  visitedFields
}) => {
  const [hasFocus, setHasFocus] = useState(false)
  const {
    conceptId,
    draftType,
    id,
    sectionName,
    templateType
  } = useParams()

  const navigate = useNavigate()

  const { displayName, properties: sectionProperties } = section

  const isFirstForm = sectionIndex === 0

  // If we have a sectionName in the URL, this section is displayed if it matches the displayName of the section
  // If we don't have a sectionName in the URL, this section is displayed if it is the first form section
  const isSectionDisplayed = sectionName ? toKebabCase(displayName) === sectionName : isFirstForm

  // Does the form section have values
  const hasValues = sectionProperties.some((propertyPrefix) => {
    const value = cloneDeep(removeEmpty(draft[propertyPrefix]))

    // If the value is an empty array, return false
    if (value && value.length === 0) return false

    return value !== undefined
  })

  // `hasErrors` is used if any errors exist on the form section, so it loops over all validationErrors
  const hasErrors = validationErrors.some((error) => {
    const { property } = error

    return sectionProperties.some((propertyPrefix) => prefixProperty(property).startsWith(`${prefixProperty(propertyPrefix)}`))
  })

  let errorsWithGroups = []
  const errorsWithoutGroups = []

  // Multiple errors can occur within a nested field or array field, so we group those errors together
  // in order to display them together within NavigationItemError
  validationErrors.forEach((validationError) => {
    const { property } = validationError

    const propertyField = property.startsWith('.')
      ? property.split('.')[1]
      : property

    // If the property is not found in the `sectionProperties`, we don't show the error, so return here
    if (!sectionProperties.includes(propertyField)) return

    // Nested/Array errors from sjv start with `.`
    const isGrouped = property.startsWith('.')

    if (isGrouped) {
      const path = createPath(property)
      const parts = path.split('.').filter(Boolean)

      errorsWithGroups = buildValidationErrors({
        draft,
        errors: errorsWithGroups,
        pathParts: parts,
        validationError
      })
    } else {
      // If the error was not nested, save it in `errorsWithoutGroups`
      errorsWithoutGroups.push(validationError)
    }
  })

  // Combine the errors without groups to those with groups
  const errors = [
    ...errorsWithoutGroups,
    ...errorsWithGroups
  ]

  return (
    <div className={
      classNames([
        'navigation-item px-3 py-1',
        {
          'navigation-item--is-active': isSectionDisplayed
        }
      ])
    }
    >
      <ListGroup.Item
        className={
          classNames([
            'navigation-item__item d-flex flex-column p-0 py-1 border-0',
            {
              'navigation-item__item--is-focused': hasFocus
            },
            {
              'navigation-item__item--is-active': isSectionDisplayed
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
            if (templateType) {
              navigate(`../templates/${templateType}/${id || 'new'}/${toKebabCase(displayName)}`)
            } else {
              // Navigate to the correct form
              navigate(`/drafts/${draftType}/${conceptId || 'new'}/${toKebabCase(displayName)}`)
            }

            // Ensure the window is scrolled to the top of the page
            window.scroll(0, 0)
          }
        }
      >
        <span className="d-flex align-items-baseline">
          <i
            // TODO tooltips
            role="img"
            aria-label={displayName}
            className={
              classNames([
                'eui-icon eui-icon--sm navigation-item__icon me-2',
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
          <span>{displayName}</span>
          {/* // TODO MMT-3479 */}
          {/* {
            required && (
              <i className="eui-icon eui-required-o required-icon text-success ms-1" />
            )
          } */}
        </span>
        {
          (isSectionDisplayed && errors.length > 0) && (
            <div className="mt-2">
              <For each={errors}>
                {
                  (error) => (
                    <NavigationItemError
                      error={error}
                      key={JSON.stringify(error)}
                      setFocusField={setFocusField}
                      visitedFields={visitedFields}
                    />
                  )
                }
              </For>
            </div>
          )
        }

      </ListGroup.Item>
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
    properties: PropTypes.arrayOf(
      PropTypes.string
    )
  }).isRequired,
  sectionIndex: PropTypes.number.isRequired,
  setFocusField: PropTypes.func.isRequired,
  validationErrors: PropTypes.arrayOf(
    PropTypes.shape({})
  ),
  visitedFields: PropTypes.arrayOf(
    PropTypes.string
  ).isRequired
}

export default NavigationItem
