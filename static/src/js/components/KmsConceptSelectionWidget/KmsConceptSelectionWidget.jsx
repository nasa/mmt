import { startCase } from 'lodash-es'
import PropTypes from 'prop-types'
import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { FaPencilAlt } from 'react-icons/fa'

import Button from '@/js/components/Button/Button'
import {
  KmsConceptSelectionEditModal
} from '@/js/components/KmsConceptSelectionEditModal/KmsConceptSelectionEditModal'
import { getKmsConceptFullPaths } from '@/js/utils/getKmsConceptFullPaths'
import { getVersionName } from '@/js/utils/getVersionName'
import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'

import './KmsConceptSelectionWidget.scss'

/**
 * KmsConceptSelectionWidget component for selecting and editing keyword concepts
 * within a user interface. It uses a modal to allow keyword selection and then
 * displays the selected keyword and its full path.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.id - Unique identifier for the widget.
 * @param {string} props.label - Label displayed for the widget.
 * @param {Function} props.onChange - Callback function to handle changes.
 * @param {Object} props.registry - Contains form context information.
 * @param {boolean} [props.required=false] - Specifies if the field is required.
 * @param {Object} props.schema - Schema containing field constraints.
 * @param {Object} props.uiSchema - UI schema allowing customization of display.
 * @param {string|number} [props.value=''] - Current value of the widget.
 * @returns {JSX.Element} The rendered component.
 */
const KmsConceptSelectionWidget = ({
  id,
  label,
  onChange,
  registry,
  required,
  schema,
  uiSchema,
  value
}) => {
  const [keywordLabel, setKeywordLabel] = useState('')
  const [fullPath, setFullPath] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [error, setError] = useState('')
  const inputScrollRef = useRef(null)
  const focusRef = useRef(null)

  const { formContext } = registry
  const { version, scheme } = formContext

  const { maxLength, description } = schema

  let title = startCase(label.split(/-/)[0])
  if (uiSchema['ui:title']) {
    title = uiSchema['ui:title']
  }

  useEffect(() => {
    const fetchFullPaths = async () => {
      try {
        const params = {
          conceptId: value,
          version: getVersionName(version)
        }
        let fullPaths = await getKmsConceptFullPaths(params)
        const lastField = fullPaths[0].split('|').pop()
        fullPaths = fullPaths.map((path) => path.replaceAll('|', ' > '))
        setKeywordLabel(lastField)
        setFullPath(fullPaths.join('\n'))
      } catch (errorObj) {
        console.error(`Error fetching keyword for ${value}`, errorObj)
        setError(`Error fetching keyword for ${value}`)
      }
    }

    if (value !== null && value.trim() !== '') {
      fetchFullPaths()
    }
  }, [value])

  const toggleEditModal = useCallback((nextState) => {
    setShowEditModal(nextState)
  }, [])

  const handleAcceptChanges = useCallback((uuidValue) => {
    onChange(uuidValue)
  }, [onChange])

  return (
    <CustomWidgetWrapper
      id={id}
      key={`${id}-${value}`}
      charactersUsed={value?.length}
      description={description}
      label={label}
      maxLength={maxLength}
      required={required}
      scrollRef={inputScrollRef}
      title={title}
    >
      <div className="kms-concept-selection-widget__container">
        <span
          key={`${id}-${value}`}
          className="kms-concept-selection-widget__label"
          id={id}
          ref={focusRef}
          title={fullPath || 'No full path available'}
        >
          {keywordLabel || 'No value set'}
        </span>
        <Button
          title="Select Concept"
          className="kms-concept-selection-widget__edit-button"
          Icon={FaPencilAlt}
          iconTitle="Pencil icon to edit"
          naked
          onClick={() => setShowEditModal(true)}
          size="sm"
        />
      </div>

      {
        error && (
          <div className="alert alert-danger kms-concept-selection-widget__compact-alert" role="alert">
            {error}
          </div>
        )
      }
      {' '}
      <KmsConceptSelectionEditModal
        uuid={value}
        version={version}
        scheme={scheme}
        show={showEditModal}
        toggleModal={toggleEditModal}
        handleAcceptChanges={handleAcceptChanges}
      />
    </CustomWidgetWrapper>
  )
}

KmsConceptSelectionWidget.defaultProps = {
  value: '',
  required: false
}

KmsConceptSelectionWidget.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  registry: PropTypes.shape({
    formContext: PropTypes.shape({
      focusField: PropTypes.string,
      setFocusField: PropTypes.func,
      version: PropTypes.shape({
        version: PropTypes.string,
        version_type: PropTypes.string
      }).isRequired,
      scheme: PropTypes.shape({
        name: PropTypes.string
      }).isRequired
    }).isRequired
  }).isRequired,
  required: PropTypes.bool,
  schema: PropTypes.shape({
    description: PropTypes.string,
    maxLength: PropTypes.number,
    type: PropTypes.string
  }).isRequired,
  uiSchema: PropTypes.shape({
    'ui:title': PropTypes.string
  }).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}

export default KmsConceptSelectionWidget
