import React, {
  useState,
  useEffect,
  useRef
} from 'react'
import { Tree } from 'react-arborist'
import CustomModal from '@/js/components/CustomModal/CustomModal'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid'
import {
  KeywordTreeContextMenu
} from '@/js/components/KeywordTreeContextMenu/KeywordTreeContextMenu'
import { KeywordTreeCustomNode } from '@/js/components/KeywordTreeCustomNode/KeywordTreeCustomNode'

import './KeywordTree.scss'

/**
 * KeywordTree Component
 *
 * This component renders a tree structure of keywords with the ability to add, edit, and delete nodes.
 * It uses react-arborist for the tree structure and provides context menu functionality.
 *
 * @component
 * @param {Object|Array} props.data - The initial tree data structure
 * @param {Function} props.onNodeClick - Callback function when a node is clicked
 * @param {Function} props.onNodeEdit - Callback function when a node is edited
 * @param {Function} props.onAddNarrower - Callback function when a narrower keyword is added
 *
 * @example
 * const treeData = [
 *   {
 *     id: '1',
 *     key: '1',
 *     title: 'Root',
 *     children: [
 *       {
 *         id: '2',
 *         key: '2',
 *         title: 'Child 1',
 *         children: []
 *       },
 *       {
 *         id: '3',
 *         key: '3',
 *         title: 'Child 2',
 *         children: []
 *       }
 *     ]
 *   }
 * ];
 *
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
 *     data={treeData}
 *     onNodeClick={handleNodeClick}
 *     onNodeEdit={handleNodeEdit}
 *     onAddNarrower={handleAddNarrower}
 *   />
 * );
 */
export const KeywordTree = ({
  data, onAddNarrower, onNodeClick, onNodeEdit, searchTerm, selectedNodeId, showContextMenu, openAll
}) => {
  const [treeData, setTreeData] = useState(Array.isArray(data) ? data : [data])
  const treeRef = useRef(null)
  const [contextMenu, setContextMenu] = useState(null)
  const contextMenuRef = useRef(null)
  const idAccessor = (node) => node.id || node.key || node.title
  const [showAddNarrowerPopup, setShowAddNarrowerPopup] = useState(false)
  const [newNarrowerTitle, setNewNarrowerTitle] = useState('')
  const [addNarrowerParentId, setAddNarrowerParentId] = useState(null)

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
    if (treeRef.current && treeData.length > 0) {
      if (openAll) {
        treeRef.current.openAll()
      } else if (selectedNodeId) {
        treeRef.current.openParents(selectedNodeId)
        setTimeout(() => { // Delay to potentially allow tree updates
          const node = treeRef.current.get(selectedNodeId)
          if (node) {
            treeRef.current.select(selectedNodeId)
            treeRef.current.scrollTo(selectedNodeId, 'center')
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
      setTreeData((prevData) => {
        const addChildToNode = (node) => {
          if (node.id === addNarrowerParentId || node.key === addNarrowerParentId) {
            return {
              ...node,
              children: [...(node.children || []), newChild],
              isOpen: true
            }
          }

          if (node.children) {
            return {
              ...node,
              children: node.children.map(addChildToNode)
            }
          }

          return node
        }

        return prevData.map(addChildToNode)
      })

      // Expand the parent node
      if (treeRef.current) {
        const parentNode = treeRef.current.get(addNarrowerParentId)
        if (parentNode && !parentNode.isOpen) {
          parentNode.toggle()
        }
      }

      // Notify the parent component about the new keyword
      onAddNarrower(addNarrowerParentId, newChild)

      setShowAddNarrowerPopup(false)
      setNewNarrowerTitle('')
      setAddNarrowerParentId(null)
    }
  }

  const modalActions = [
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

  const handleDelete = (nodeId) => {
    setTreeData((prevData) => {
      const deleteNode = (nodes) => nodes.filter((node) => node.id !== nodeId)
        .map((node) => ({
          ...node,
          children: node.children ? deleteNode(node.children) : undefined
        }))

      return deleteNode(prevData)
    })
  }

  return (
    <div className="keyword-tree__container">
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
              searchTerm={searchTerm}
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
              <Form.Label htmlFor="newChildKeyword">Narrower Keyword:</Form.Label>
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
        actions={modalActions}
        toggleModal={setShowAddNarrowerPopup}
      />

    </div>
  )
}

const NodeShape = {
  key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}
NodeShape.children = PropTypes.arrayOf(PropTypes.shape(NodeShape))

KeywordTree.defaultProps = {
  searchTerm: null,
  selectedNodeId: null,
  showContextMenu: true,
  openAll: false
}

KeywordTree.propTypes = {
  selectedNodeId: PropTypes.string,
  data: PropTypes.oneOfType([
    PropTypes.shape(NodeShape),
    PropTypes.arrayOf(PropTypes.shape(NodeShape))
  ]).isRequired,
  onAddNarrower: PropTypes.func.isRequired,
  onNodeClick: PropTypes.func.isRequired,
  onNodeEdit: PropTypes.func.isRequired,
  searchTerm: PropTypes.string,
  showContextMenu: PropTypes.bool,
  openAll: PropTypes.bool
}
