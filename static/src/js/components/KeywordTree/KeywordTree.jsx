import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef
} from 'react'
import { Tree } from 'react-arborist'
import CustomModal from '@/js/components/CustomModal/CustomModal'
import PropTypes from 'prop-types'
import {
  Button,
  Form,
  Spinner
} from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid'
import {
  KeywordTreeContextMenu
} from '@/js/components/KeywordTreeContextMenu/KeywordTreeContextMenu'
import { KeywordTreeCustomNode } from '@/js/components/KeywordTreeCustomNode/KeywordTreeCustomNode'

import './KeywordTree.scss'
import getKmsKeywordTree from '@/js/utils/getKmsKeywordTree'
import {
  KeywordTreePlaceHolder
} from '@/js/components/KeywordTreePlaceHolder/KeywordTreePlaceHolder'
import { castArray } from 'lodash-es'

/**
 * KeywordTree Component
 *
 * This component renders a tree structure of keywords with the ability to add, edit, and delete nodes.
 * It uses react-arborist for the tree structure and provides context menu functionality.
 *
 * @component
 * @param {Function} props.onAddNarrower - Callback function when a narrower keyword is added
 * @param {Function} props.onNodeClick - Callback function when a node is clicked
 * @param {Function} props.onNodeEdit - Callback function when a node is edited
 * @param {string} props.selectedNodeId - ID of the currently selected node
 * @param {boolean} props.showContextMenu - Whether to show the context menu
 * @param {boolean} props.openAll - Whether to open all nodes in the tree
 * @param {Object} props.selectedVersion - The selected version object
 * @param {Object} props.selectedScheme - The selected scheme object
 *
 * @example
 * const handleNodeClick = (nodeId) => {
 *   console.log('Node clicked:', nodeId);
 * };
 *
 * const handleNodeEdit = (nodeId) => {
 *   console.log('Node edit requested:', nodeId);
 * };
 *
 * const handleAddNarrower = (parentId, newChild) => {
 *   console.log('New narrower added:', newChild, 'to parent:', parentId);
 * };
 *
 * return (
 *   <KeywordTree
 *     onNodeClick={handleNodeClick}
 *     onNodeEdit={handleNodeEdit}
 *     onNodeDelete={handleNodeDelete}
 *     onAddNarrower={handleAddNarrower}
 *     selectedNodeId="1"
 *     showContextMenu={true}
 *     openAll={false}
 *     selectedVersion={{...}}
 *     selectedScheme={{...}}
 *   />
 * );
 */
const KeywordTreeComponent = forwardRef(({
  onAddNarrower,
  onNodeClick,
  onNodeEdit,
  onNodeDelete,
  selectedNodeId: selectedNodeIdProp,
  showContextMenu,
  openAll,
  selectedVersion,
  selectedScheme
}, ref) => {
  const [treeData, setTreeData] = useState(null)
  const [isTreeLoading, setIsTreeLoading] = useState(false)
  const [treeMessage, setTreeMessage] = useState('Select a version and scheme to load the tree')
  const treeRef = useRef(null)
  const [contextMenu, setContextMenu] = useState(null)
  const contextMenuRef = useRef(null)
  const idAccessor = (node) => node.id || node.key || node.title
  const [showAddNarrowerPopup, setShowAddNarrowerPopup] = useState(false)
  const [newNarrowerTitle, setNewNarrowerTitle] = useState('')
  const [addNarrowerParentId, setAddNarrowerParentId] = useState(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [nodeToDelete, setNodeToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [selectedNodeId, setSelectedNodeId] = useState(selectedNodeIdProp)

  const [searchPattern, setSearchPattern] = useState('')
  const searchInputRef = useRef(null)

  /**
     * Fetches the keyword tree data based on the selected version and scheme
     * @param {object} version - The selected version object
     * @param {object} scheme - The selected scheme object
     */
  const refreshTree = async () => {
    if (selectedVersion && selectedScheme) {
      setIsTreeLoading(true)
      try {
        const kmsTree = castArray(await getKmsKeywordTree(
          selectedVersion,
          selectedScheme,
          searchPattern
        ))
        setTreeData(kmsTree)
      } catch (error) {
        console.error('Error fetching keyword tree:', error)
        setTreeData(null)
        setTreeMessage('Failed to load the tree. Please try again.')
      } finally {
        setIsTreeLoading(false)
      }
    } else {
      setTreeData(null)
    }
  }

  // Effect to fetch tree data when version and scheme are selected
  useEffect(() => {
    if (selectedVersion && selectedScheme) {
      setTreeMessage('Loading...')
      refreshTree()
    } else {
      setTreeMessage('Select a version and scheme to load the tree')
    }
  }, [selectedVersion, selectedScheme, searchPattern, selectedNodeId])

  // Expose the refreshTree function to the parent component
  useImperativeHandle(ref, () => ({
    refreshTree
  }))

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setContextMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Effect to manage tree expansion or node selection
  useEffect(() => {
    const shouldOpenAll = openAll || (searchPattern && searchPattern.trim() !== '')

    if (treeRef.current && treeData.length > 0) {
      if (shouldOpenAll) {
        treeRef.current.openAll()
      } else if (selectedNodeId) {
        treeRef.current?.openParents(selectedNodeId)
        setTimeout(() => { // Delay to potentially allow tree updates
          if (treeRef.current) {
            const node = treeRef.current.get(selectedNodeId)
            if (node) {
              treeRef.current.select(selectedNodeId)
              treeRef.current.scrollTo(selectedNodeId, 'center')
              node.open()
            }
          }
        }, 0)
      } else {
        const tree = treeRef.current
        const rootNode = tree.get(treeData[0].id)
        if (rootNode) {
          rootNode.open()
        }
      }
    }
  }, [treeData, openAll])

  const closeAllDescendants = (node) => {
    if (node.isOpen) {
      node.toggle()
    }

    if (node.children) {
      node.children.forEach(closeAllDescendants)
    }
  }

  const handleToggle = (node) => {
    if (node.isOpen) {
      closeAllDescendants(node)
    } else {
      node.toggle()
    }
  }

  const handleAdd = (parentId) => {
    setAddNarrowerParentId(parentId)
    setShowAddNarrowerPopup(true)
  }

  const handleAddNarrowerConfirm = () => {
    if (newNarrowerTitle.trim()) {
      const newUuid = uuidv4()
      const newChild = {
        id: newUuid,
        key: newUuid,
        title: newNarrowerTitle.trim(),
        children: []
      }

      // Notify the parent component about the new keyword
      onAddNarrower(addNarrowerParentId, newChild)

      setShowAddNarrowerPopup(false)
      setNewNarrowerTitle('')
      setAddNarrowerParentId(null)
    }
  }

  const addModalActions = [
    {
      label: 'Cancel',
      variant: 'secondary',
      onClick: () => setShowAddNarrowerPopup(false)
    },
    {
      label: 'Add',
      variant: 'primary',
      onClick: handleAddNarrowerConfirm
    }
  ]

  const closeDeleteModal = () => {
    setShowDeleteConfirmation(false)
    setNodeToDelete(null)
    setDeleteError(null)
  }

  const handleDeleteConfirmation = async () => {
    if (nodeToDelete) {
      setIsDeleting(true)
      setDeleteError(null)
      try {
        // Notify the parent component about the deletion
        const errorMessage = await onNodeDelete(nodeToDelete.data)
        if (errorMessage) {
          // If there's an error message, set it and keep the modal open
          setDeleteError(errorMessage)
        } else {
          setSelectedNodeId(nodeToDelete.parent.id)

          closeDeleteModal()
        }
      } catch (error) {
        setDeleteError(error.message || 'An error occurred while deleting the node.')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleDelete = (node) => {
    setNodeToDelete(node)
    setShowDeleteConfirmation(true)
  }

  const deleteModalActions = [
    {
      label: 'Cancel',
      variant: 'secondary',
      onClick: closeDeleteModal,
      disabled: isDeleting
    },
    {
      label: 'Delete',
      variant: 'danger',
      onClick: handleDeleteConfirmation,
      disabled: isDeleting
    }
  ]

  if (isTreeLoading) {
    return <KeywordTreePlaceHolder message="Loading..." />
  }

  if (!treeData && treeMessage) {
    return <KeywordTreePlaceHolder message={treeMessage} />
  }

  // New function to handle search input change
  const onHandleSearchInputChange = (event) => {
    if (event.target.value === '') {
      setSearchPattern('')
    }
  }

  const onHandleApplyFilteredSearch = () => {
    setSearchPattern(searchInputRef.current.value)
  }

  const onHandleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSearchPattern(searchInputRef.current.value)
    }
  }

  return (
    <div className="keyword-tree__container">
      <div className="kms-concept-selection-edit-modal__tree-wrapper">
        <input
          className="kms-concept-selection-edit-modal__search-input"
          onChange={onHandleSearchInputChange}
          onKeyDown={onHandleKeyDown}
          placeholder="Search by Pattern or UUID"
          type="text"
          ref={searchInputRef}
          defaultValue={searchPattern}
        />
        <Button
          type="button"
          className="kms-concept-selection-edit-modal__apply-button"
          onClick={onHandleApplyFilteredSearch}
        >
          Apply
        </Button>
      </div>

      <Tree
        ref={treeRef}
        data={treeData}
        openByDefault={false}
        width={1000}
        indent={24}
        rowHeight={36}
        overscanCount={1}
        idAccessor={idAccessor}
      >
        {
          ({ node, ...props }) => (
            <KeywordTreeCustomNode
              {...props}
              node={node}
              onAdd={handleAdd}
              onDelete={handleDelete}
              searchTerm={searchPattern}
              setContextMenu={setContextMenu}
              onToggle={handleToggle}
              onEdit={onNodeEdit}
              onNodeClick={onNodeClick}
              handleAdd={handleAdd}
            />
          )
        }
      </Tree>
      {
        contextMenu && showContextMenu && (
          <KeywordTreeContextMenu
            {...contextMenu}
            onClose={() => setContextMenu(null)}
            forwardedRef={contextMenuRef}
          />
        )
      }
      <CustomModal
        show={showAddNarrowerPopup}
        header="Add Narrower"
        message={
          (
            <Form.Group>
              <Form.Label htmlFor="newNarrowerKeyword">Narrower Keyword:</Form.Label>
              <Form.Control
                id="newNarrowerKeyword"
                type="text"
                value={newNarrowerTitle}
                onChange={(e) => setNewNarrowerTitle(e.target.value)}
                placeholder="Enter Keyword"
              />
            </Form.Group>
          )
        }
        actions={addModalActions}
        toggleModal={setShowAddNarrowerPopup}
      />
      <CustomModal
        show={showDeleteConfirmation}
        header="Confirm Deletion"
        message={
          (
            <div>
              <p>{`Delete "${nodeToDelete?.data.title}"?`}</p>
              {
                isDeleting && (
                  <div className="text-primary mt-2">
                    <Spinner animation="border" size="sm" />
                    {' '}
                    Deleting...
                  </div>
                )
              }
              {deleteError && <div className="text-danger mt-2">{deleteError}</div>}
            </div>
          )
        }
        actions={deleteModalActions}
        toggleModal={closeDeleteModal}
      />

    </div>
  )
})

KeywordTreeComponent.displayName = 'KeywordTree'

const NodeShape = {
  key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}
NodeShape.children = PropTypes.arrayOf(PropTypes.shape(NodeShape))

KeywordTreeComponent.defaultProps = {
  searchTerm: null,
  selectedNodeId: null,
  showContextMenu: true,
  openAll: false,
  onAddNarrower: null,
  onNodeEdit: null,
  selectedVersion: null,
  selectedScheme: null,
  data: null,
  onNodeDelete: null
}

KeywordTreeComponent.propTypes = {
  selectedNodeId: PropTypes.string,
  data: PropTypes.oneOfType([
    PropTypes.shape(NodeShape),
    PropTypes.arrayOf(PropTypes.shape(NodeShape))
  ]),
  onAddNarrower: PropTypes.func,
  onNodeClick: PropTypes.func.isRequired,
  onNodeEdit: PropTypes.func,
  searchTerm: PropTypes.string,
  showContextMenu: PropTypes.bool,
  openAll: PropTypes.bool,
  selectedVersion: PropTypes.shape(),
  selectedScheme: PropTypes.shape(),
  onNodeDelete: PropTypes.func
}

export const KeywordTree = KeywordTreeComponent
