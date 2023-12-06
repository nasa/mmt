import React from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Dropdown from 'react-bootstrap/Dropdown'
import ListGroup from 'react-bootstrap/ListGroup'
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
 * @property {Object[]} validationErrors An object array with a list of errors.
 * @property {Array} visitedFields An array with a list of visited fields.
 * @property {Function} onCancel A function that cancels unsaved draft.
 * @property {Function} onSave A function that saves the draft.
 * @property {Function} setFocusField A function that sets the focus field.
 */

/**
 * Renders Form Navigation
 * @param {FormNavigation} props
 */
const FormNavigation = ({
  draft,
  formSections,
  loading,
  visitedFields,
  onCancel,
  onSave,
  schema,
  setFocusField
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
          >
            <span>
              Save &amp; Continue
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

        {
          loading && (
            <div className="spinner-border spinner" role="status" />
          )
        }
      </div>

      <ListGroup className="form-navigation__sections p-2 bg-light">
        <For each={formSections}>
          {
            (section) => (
              <NavigationItem
                key={JSON.stringify(section)}
                draft={draft}
                section={section}
                validationErrors={errors}
                visitedFields={visitedFields}
                setFocusField={setFocusField}
              />
            )
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
  setFocusField: PropTypes.func.isRequired
}

export default FormNavigation
