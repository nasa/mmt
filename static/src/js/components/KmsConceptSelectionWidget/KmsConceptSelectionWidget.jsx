import { startCase } from 'lodash-es'
import PropTypes from 'prop-types'
import React, {
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

import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'

import './KmsConceptSelectionWidget.scss'

/**
 * KmsConceptSelectionWidget
 * @typedef {Object} KmsConceptSelectionWidget
 * @property {Boolean} disable A boolean value to disable the selection widget
 * @property {String} id The id of the widget.
 * @property {String} label The label of the widget.
 * @property {Boolean} onBlur Should blur a field.
 * @property {Function} onChange A callback function triggered when the concept uuid changes
 * @property {Object} registry An Object that has all the props that are in registry.
 * @property {Boolean} required Is the KmsConceptSelectionWidget field required
 * @property {Object} schema A UMM Schema for the widget being previewed.
 * @property {Object} uiSchema A uiSchema for the field being shown.
 * @property {String} value A concept uuid saved to the draft.
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
        let fullPaths = await getKmsConceptFullPaths(value)
        const lastField = fullPaths[0].split('|').pop()
        fullPaths = fullPaths.map((path) => path.replaceAll('|', ' > '))
        setKeywordLabel(lastField)
        setFullPath(fullPaths.join('\n'))
      } catch (error) {
        console.error('Error fetching versions:', error)
      }
    }

    fetchFullPaths()
  }, [value])

  const toggleEditModal = (nextState) => {
    setShowEditModal(nextState)
  }

  return (
    <CustomWidgetWrapper
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
          title="Edit Keyword"
          className="kms-concept-selection-widget__edit-button"
          Icon={FaPencilAlt}
          iconTitle="Pencil icon to edit"
          naked
          onClick={() => setShowEditModal(true)}
          size="sm"
        />
      </div>

      <KmsConceptSelectionEditModal
        uuid={value}
        version={version}
        scheme={scheme}
        show={showEditModal}
        toggleModal={toggleEditModal}
        handleAcceptChanges={
          (uuidValue) => {
            onChange(uuidValue)
          }
        }
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
