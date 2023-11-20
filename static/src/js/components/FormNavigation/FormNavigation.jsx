import {
  Button,
  ButtonGroup,
  Dropdown,
  ListGroup
} from 'react-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'

import NavigationItem from '../NavigationItem/NavigationItem'
import For from '../For/For'

import saveTypes from '../../constants/saveTypes'

import './FormNavigation.scss'

const FormNavigation = ({
  draft,
  formSections,
  loading,
  validationErrors,
  visitedFields,
  onCancel,
  onSave,
  setFocusField
}) => (
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
          data-testid="navigationview--dropdown-toggle"
          split
          variant="success"
          id="dropdown-split-basic"
          className="text-white"
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
        data-testid="navigationview--cancel-button"
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
              validationErrors={validationErrors}
              visitedFields={visitedFields}
              setFocusField={setFocusField}
            />
          )
        }
      </For>
    </ListGroup>
  </>
)

FormNavigation.defaultProps = {
  loading: false
}

FormNavigation.propTypes = {
  draft: PropTypes.shape({}).isRequired,
  formSections: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  loading: PropTypes.bool,
  validationErrors: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  visitedFields: PropTypes.arrayOf(
    PropTypes.string
  ).isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  setFocusField: PropTypes.func.isRequired
}

export default FormNavigation
