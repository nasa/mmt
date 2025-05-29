import PropTypes from 'prop-types'
import React, {
  useCallback,
  useState,
  useRef
} from 'react'

import CustomModal from '@/js/components/CustomModal/CustomModal'
import { KeywordTree } from '@/js/components/KeywordTree/KeywordTree'
import KmsConceptSchemeSelector from '@/js/components/KmsConceptSchemeSelector/KmsConceptSchemeSelector'

import './KmsConceptSelectionEditModal.scss'

/**
 * KmsConceptSelectionEditModal component provides an interface to edit keyword selections
 * within a modal. It allows users to select a scheme, search for keywords, and apply their changes.
 *
 * @param {Object} props - React component props.
 * @param {boolean} props.show - Determines if the modal is visible.
 * @param {Function} props.toggleModal - Function to toggle the modal visibility.
 * @param {string} props.uuid - UUID of the selected keyword.
 * @param {Object} props.version - Object containing version details like version and version_type.
 * @param {Object} props.scheme - Object containing scheme details.
 * @param {Function} props.handleAcceptChanges - Callback function when changes are accepted.
 * @returns {JSX.Element} The complete modal component for editing keyword selections.
 */
export const KmsConceptSelectionEditModal = ({
  handleAcceptChanges,
  scheme,
  show,
  toggleModal,
  uuid,
  version
}) => {
  const [selectedScheme, setSelectedScheme] = useState(scheme)
  const [selectedKeyword, setSelectedKeyword] = useState(uuid)
  const keywordTreeRef = useRef(null)

  const onSchemeSelect = useCallback((schemeInfo) => {
    setSelectedScheme(schemeInfo)
  }, [])

  const onHandleSelectKeyword = (value) => {
    setSelectedKeyword(value)
  }

  const onHandleAcceptChanges = () => {
    handleAcceptChanges(selectedKeyword)
    toggleModal(false)
  }

  const renderTree = () => {
    const schemeSelectorId = selectedScheme?.name

    return (
      <div>
        <div className="kms-concept-selection-edit-modal__scheme-selector">
          <label
            htmlFor={schemeSelectorId}
            className="kms-concept-selection-edit-modal__label"
          >
            Scheme:
          </label>
          <KmsConceptSchemeSelector
            defaultScheme={selectedScheme || scheme}
            id={uuid}
            key={uuid}
            onSchemeSelect={onSchemeSelect}
            version={version}
          />
        </div>
        <KeywordTree
          ref={keywordTreeRef}
          key={`${version?.version}-${selectedScheme?.name}`}
          onNodeClick={onHandleSelectKeyword}
          selectedNodeId={uuid}
          showContextMenu={false}
          selectedScheme={selectedScheme}
          selectedVersion={version}
        />
      </div>
    )
  }

  return (
    <CustomModal
      header="Select Concept"
      message={renderTree()}
      show={show}
      toggleModal={toggleModal}
      actions={
        [
          {
            label: 'Cancel',
            variant: 'secondary',
            onClick: () => { toggleModal(false) }
          },
          {
            label: 'Accept',
            variant: 'primary',
            onClick: onHandleAcceptChanges
          }
        ]
      }
    />
  )
}

KmsConceptSelectionEditModal.propTypes = {
  handleAcceptChanges: PropTypes.func.isRequired,
  scheme: PropTypes.shape({
    name: PropTypes.string
  }).isRequired,
  show: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  uuid: PropTypes.string.isRequired,
  version: PropTypes.shape({
    version: PropTypes.string,
    version_type: PropTypes.string
  }).isRequired
}
