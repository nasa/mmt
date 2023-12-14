import React from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Dropdown from 'react-bootstrap/Dropdown'
import ListGroup from 'react-bootstrap/ListGroup'
import Spinner from 'react-bootstrap/Spinner'
import validator from '@rjsf/validator-ajv8'

import { kebabCase } from 'lodash'
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
 * @property {Object[]} validationErrors An object array with a list of errors.
 * @property {Function} onCancel A function that cancels unsaved draft.
 * @property {Function} onSave A function that saves the draft.
 * @property {Object} schema UMM Schema.
 * @property {Function} setFocusField A function that sets the focus field.
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
  visitedFields,
  uiSchema
}) => {
  const { errors } = validator.validateFormData(draft, schema)

  return (
    <>
      <div className="mb-4">
        <Dropdown as={ButtonGroup}>
          <Button
            onClick={() => onSave(saveTypes.saveAndContinue)}
            variant="success"
            className="text-white"
            disabled={loading}
          >
            {
              loading && (
                <Spinner
                  className="me-2"
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
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
            split
            variant="success"
            id="dropdown-split-basic"
            className="text-white"
            aria-label="Save Options"
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
          onClick={onCancel}
          type="button"
          className="link-button ms-2"
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
              const ui = uiSchema[kebabCase(displayName)]
              // TODO look into why this does not seem to account for all required forms
              const required = ui?.['ui:layout_grid']?.['ui:row'][0]['ui:required'] || false

              return (
                <NavigationItem
                  key={`section_${displayName}_${i}`}
                  draft={draft}
                  section={section}
                  validationErrors={errors}
                  visitedFields={visitedFields}
                  setFocusField={setFocusField}
                  required={required}
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
