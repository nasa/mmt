import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router'
import validator from '@rjsf/validator-ajv8'
import { cloneDeep } from 'lodash-es'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Dropdown from 'react-bootstrap/Dropdown'
import ListGroup from 'react-bootstrap/ListGroup'
import Spinner from 'react-bootstrap/Spinner'

import saveTypes from '@/js/constants/saveTypes'
import saveTypesToHumanizedStringMap from '@/js/constants/saveTypesToHumanizedStringMap'

import removeEmpty from '@/js/utils/removeEmpty'

import ChooseProviderModal from '@/js/components/ChooseProviderModal/ChooseProviderModal'
import For from '@/js/components/For/For'
import NavigationItem from '@/js/components/NavigationItem/NavigationItem'

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
  // TODO MMT-3479
  // uiSchema,
  visitedFields
}) => {
  // If the concept id or a template id are undefined, assume a new draft or template is being created
  const { conceptId = 'new', id = 'new' } = useParams()
  const [chooseProviderModalOpen, setChooseProviderModalOpen] = useState(false)
  const [chooseProviderModalType, setChooseProviderModalType] = useState(null)
  const { templateType } = useParams()
  const cleanedDraft = cloneDeep(removeEmpty(draft))
  const { errors } = validator.validateFormData(cleanedDraft, schema)

  const isTemplate = !!templateType

  const onSaveClick = (type) => {
    // If editing a new draft, open the provider selection modal
    if (
      (!isTemplate && conceptId === 'new')
      || (isTemplate && id === 'new')
    ) {
      setChooseProviderModalType(type)
      setChooseProviderModalOpen(true)

      return
    }

    onSave(type)
  }

  return (
    <>
      <div className="mb-4">
        <Dropdown as={ButtonGroup}>
          <Button
            className="text-white"
            disabled={loading}
            onClick={() => onSaveClick(saveTypes.saveAndContinue)}
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
                  : saveTypesToHumanizedStringMap[saveTypes.saveAndContinue]
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
              onClick={() => onSaveClick(saveTypes.save)}
            >
              <span>
                {saveTypesToHumanizedStringMap[saveTypes.save]}
              </span>
            </Dropdown.Item>

            <Dropdown.Item
              onClick={() => onSaveClick(saveTypes.saveAndContinue)}
            >
              <span>
                {saveTypesToHumanizedStringMap[saveTypes.saveAndContinue]}
              </span>
            </Dropdown.Item>

            {
              isTemplate && (
                <Dropdown.Item
                  onClick={() => onSaveClick(saveTypes.saveAndCreateDraft)}
                >
                  {saveTypesToHumanizedStringMap[saveTypes.saveAndCreateDraft]}
                </Dropdown.Item>
              )
            }
            {
              !isTemplate && (
                <Dropdown.Item
                  onClick={() => onSaveClick(saveTypes.saveAndPublish)}
                >
                  {saveTypesToHumanizedStringMap[saveTypes.saveAndPublish]}
                </Dropdown.Item>

              )
            }

            <Dropdown.Item
              onClick={() => onSaveClick(saveTypes.saveAndPreview)}
            >
              <span>
                {saveTypesToHumanizedStringMap[saveTypes.saveAndPreview]}
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
            (section, index) => {
              const { displayName } = section

              // TODO MMT-3479
              // const ui = uiSchema[kebabCase(displayName)]
              // const required = ui?.['ui:layout_grid']?.['ui:row'][0]['ui:required'] || false

              return (
                <NavigationItem
                  draft={draft}
                  key={`section_${displayName}_${index}`}
                  // TODO MMT-3479
                  // required={required}
                  section={section}
                  sectionIndex={index}
                  setFocusField={setFocusField}
                  validationErrors={errors}
                  visitedFields={visitedFields}
                />
              )
            }
          }
        </For>
      </ListGroup>

      <ChooseProviderModal
        show={chooseProviderModalOpen}
        primaryActionType={chooseProviderModalType}
        toggleModal={
          () => {
            setChooseProviderModalOpen(false)
          }
        }
        type={!templateType ? 'draft' : 'template'}
        onSubmit={
          () => {
            onSave(chooseProviderModalType)
          }
        }
      />
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
