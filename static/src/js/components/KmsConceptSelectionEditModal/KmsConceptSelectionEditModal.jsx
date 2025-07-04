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
 * KmsConceptSelectionEditModal Component
 *
 * This component provides a modal interface for editing keyword selections.
 * It allows users to select a scheme, view a keyword tree, and choose a specific keyword.
 *
 * Features:
 * - Scheme selection using KmsConceptSchemeSelector
 * - Keyword tree visualization and selection using KeywordTree
 * - Ability to accept or cancel changes
 *
 * @component
 * @param {Object} props
 * @param {Function} props.handleAcceptChanges - Callback function when changes are accepted
 * @param {Object} props.scheme - Object containing scheme details (e.g., {name: string})
 * @param {boolean} props.show - Controls the visibility of the modal
 * @param {Function} props.toggleModal - Function to toggle the modal's visibility
 * @param {string} props.uuid - UUID of the initially selected keyword
 * @param {Object} props.version - Object containing version details (e.g., {version: string, version_type: string})
 *
 * @example
 * const handleAcceptChanges = (selectedKeyword) => {
 *   console.log('Selected keyword:', selectedKeyword);
 * };
 *
 * return (
 *   <KmsConceptSelectionEditModal
 *     handleAcceptChanges={handleAcceptChanges}
 *     scheme={{name: 'Example Scheme'}}
 *     show={true}
 *     toggleModal={(show) => setShowModal(show)}
 *     uuid="example-uuid"
 *     version={{version: '1.0', version_type: 'draft'}}
 *   />
 * );
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
