import PropTypes from 'prop-types'
import React, {
  useCallback,
  useEffect,
  useState
} from 'react'

import CustomModal from '@/js/components/CustomModal/CustomModal'
import { KeywordTree } from '@/js/components/KeywordTree/KeywordTree'
import KmsConceptSchemeSelector from '@/js/components/KmsConceptSchemeSelector/KmsConceptSchemeSelector'
import getKmsKeywordTree from '@/js/utils/getKmsKeywordTree'

import './KmsConceptSelectionEditModal.scss'
import {
  KeywordTreePlaceHolder
} from '@/js/components/KeywordTreePlaceHolder/KeywordTreePlaceHolder'

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
  const [treeData, setTreeData] = useState(null)
  const [selectedScheme, setSelectedScheme] = useState(scheme)
  const [selectedKeyword, setSelectedKeyword] = useState(uuid)
  const [isTreeLoading, setIsTreeLoading] = useState(false)
  const [treeMessage, setTreeMessage] = useState('')
  const [searchPattern, setSearchPattern] = useState('')
  const [searchPatternApplied, setSearchPatternApplied] = useState('')

  const fetchTreeData = async () => {
    if (version && scheme) {
      setIsTreeLoading(true)

      try {
        const data = await getKmsKeywordTree(version, selectedScheme, searchPatternApplied)
        if (data) {
          setTreeData(data)
        } else {
          setTreeData(null)
          setTreeMessage('No results.')
        }
      } catch (error) {
        console.error('Error fetching keyword tree:', error)
        setTreeData(null)
        setTreeMessage('Failed to load the tree. Please try again.')
      } finally {
        setIsTreeLoading(false)
      }
    } else {
      setTreeMessage('Select a version and scheme to load the tree')
    }
  }

  useEffect(() => {
    if (version && selectedScheme) {
      setTreeMessage('Loading...')
      fetchTreeData(version, selectedScheme, searchPatternApplied)
    }
  }, [show, version, selectedScheme, searchPatternApplied])

  const onSchemeSelect = useCallback((schemeInfo) => {
    setSelectedScheme(schemeInfo)
    setTreeData(null)
  }, [])

  useEffect(() => {
    if (show) {
      setTreeMessage('Loading...')
      fetchTreeData(version, selectedScheme, searchPatternApplied)
    }
  }, [show])

  const onHandleSelectKeyword = (value) => {
    setSelectedKeyword(value)
  }

  const onHandleAcceptChanges = () => {
    handleAcceptChanges(selectedKeyword)
    toggleModal(false)
  }

  // New function to handle search input change
  const onHandleSearchInputChange = (event) => {
    setSearchPattern(event.target.value)

    if (event.target.value === '') {
      setSearchPatternApplied('')
    }
  }

  const onHandleApplyFilteredSearch = () => {
    setSearchPatternApplied(searchPattern)
  }

  const onHandleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSearchPatternApplied(searchPattern)
    }
  }

  const renderTree = () => {
    if (isTreeLoading) {
      return <KeywordTreePlaceHolder message="Loading..." />
    }

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
            defaultScheme={scheme}
            id={uuid}
            key={uuid}
            onSchemeSelect={onSchemeSelect}
            version={version}
          />
        </div>
        <div className="kms-concept-selection-edit-modal__tree-wrapper">
          <input
            className="kms-concept-selection-edit-modal__search-input"
            onChange={onHandleSearchInputChange}
            onKeyDown={onHandleKeyDown}
            placeholder="Search by Pattern or UUID"
            type="text"
            value={searchPattern}
          />
          <button
            type="button"
            className="kms-concept-selection-edit-modal__apply-button"
            onClick={onHandleApplyFilteredSearch}
          >
            Apply
          </button>
        </div>
        {
          treeData ? (
            <KeywordTree
              data={treeData}
              key={`${uuid}`}
              onNodeClick={onHandleSelectKeyword}
              openAll={!!searchPatternApplied && searchPatternApplied.trim() !== ''}
              searchTerm={searchPatternApplied}
              selectedNodeId={uuid}
              showContextMenu={false}
            />
          ) : <KeywordTreePlaceHolder message={treeMessage} />
        }
      </div>
    )
  }

  return (
    <CustomModal
      header="Edit Keyword"
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
