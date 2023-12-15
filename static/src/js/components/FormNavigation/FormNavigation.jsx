import React from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Dropdown from 'react-bootstrap/Dropdown'
import ListGroup from 'react-bootstrap/ListGroup'
import Spinner from 'react-bootstrap/Spinner'
import validator from '@rjsf/validator-ajv8'

import NavigationItem from '../NavigationItem/NavigationItem'
import For from '../For/For'

import saveTypes from '../../constants/saveTypes'

import './FormNavigation.scss'

/**
 * FormNavigation
 * @typedef {Object} FormNavigation
 * @property {Object} draft A save version of the umm metadata.
 * @property {Object} formSections A list of form sections.
 * @property {Boolean} loading A boolean value that represent if a page is loading.
 * @property {Function} onCancel A function that cancels unsaved draft.
 * @property {Function} onSave A function that saves the draft.
 * @property {Object} schema UMM Schema.
 * @property {Function} setFocusField A function that sets the focus field.
 * @property {Object} uiSchema A uiSchema for the field being shown.
 * @property {Array} visitedFields An array with a list of visited fields.
 */

/**
 * Renders Form Navigation
 * @param {FormNavigation} props
 */
const FormNavigation = ({
  draft,
  formSections,
  loading,
  onCancel,
  onSave,
  schema,
  setFocusField,
  // TODO MMT-####
  // uiSchema,
  visitedFields
}) => {
  const { errors } = validator.validateFormData(draft, schema)

  return (
    <>
      <div className="mb-4">
        <Dropdown as={ButtonGroup}>
          <Button
            className="text-white"
            disabled={loading}
            onClick={() => onSave(saveTypes.saveAndContinue)}
            variant="success"
          >
            {
              loading && (
                <Spinner
                  animation="border"
                  as="span"
                  className="me-2"
                  role="status"
                  size="sm"
                />
              )
            }
            <span>
              {
                loading
                  ? 'Saving draft...'
                  : 'Save & Continue'
              }
            </span>
          </Button>

          <Dropdown.Toggle
            aria-label="Save Options"
            className="text-white"
            id="dropdown-split-basic"
            split
            variant="success"
          />

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => onSave(saveTypes.save)}
            >
              <span>
                Save
              </span>
            </Dropdown.Item>

            <Dropdown.Item
              onClick={() => onSave(saveTypes.saveAndContinue)}
            >
              <span>
                Save &amp; Continue
              </span>
            </Dropdown.Item>

            <Dropdown.Item
              onClick={() => onSave(saveTypes.saveAndPublish)}
            >
              Save &amp; Publish
            </Dropdown.Item>

            <Dropdown.Item
              onClick={() => onSave(saveTypes.saveAndPreview)}
            >
              <span>
                Save &amp; Preview
              </span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Button
          className="link-button ms-2"
          onClick={onCancel}
          type="button"
          variant="link-secondary"
        >
          Cancel
        </Button>
      </div>

      <ListGroup className="form-navigation__sections p-3 bg-light">
        <For each={formSections}>
          {
            (section, i) => {
              const { displayName } = section

              // TODO MMT-####
              // const ui = uiSchema[kebabCase(displayName)]
              // const required = ui?.['ui:layout_grid']?.['ui:row'][0]['ui:required'] || false

              return (
                <NavigationItem
                  draft={draft}
                  key={`section_${displayName}_${i}`}
                  // TODO MMT-####
                  // required={required}
                  section={section}
                  setFocusField={setFocusField}
                  validationErrors={errors}
                  visitedFields={visitedFields}
                />
              )
            }
          }
        </For>
      </ListGroup>
    </>
  )
}

FormNavigation.defaultProps = {
  loading: false
}

FormNavigation.propTypes = {
  draft: PropTypes.shape({}).isRequired,
  formSections: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  loading: PropTypes.bool,
  visitedFields: PropTypes.arrayOf(
    PropTypes.string
  ).isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  schema: PropTypes.shape({}).isRequired,
  setFocusField: PropTypes.func.isRequired,
  uiSchema: PropTypes.shape({}).isRequired
}

export default FormNavigation
