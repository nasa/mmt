import React, {
  useState,
  useEffect,
  useRef
} from 'react'
import { Tree } from 'react-arborist'
import PropTypes from 'prop-types'
import {
  Modal,
  Form,
  Button
} from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid'

import './KeywordTree.scss'

const ContextMenu = ({
  x, y, onClose, options, forwardedRef
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [focusedIndex, setFocusedIndex] = useState(null)

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex((prev) => ((prev === null || prev === options.length - 1) ? 0 : prev + 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex((prev) => ((prev === null || prev === 0) ? options.length - 1 : prev - 1))
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (focusedIndex !== null) {
          options[focusedIndex].action()
          onClose()
        }

        break
      case 'Escape':
        e.preventDefault()
        onClose()
        break
      default:
        break
    }
  }

  return (
    <div
      className="keyword-tree__context-menu"
      style={
        {
          top: `${y}px`,
          left: `${x}px`
        }
      }
      ref={forwardedRef}
      role="menu"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {
        options.map((option, index) => (
          <div
            key={option.id}
            role="menuitem"
            tabIndex={-1}
            onClick={
              () => {
                option.action()
                onClose()
              }
            }
            onKeyDown={
              (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  option.action()
                  onClose()
                }
              }
            }
            onMouseEnter={() => setHoveredIndex(index)}
            className={
              `keyword-tree__context-menu-item ${
                focusedIndex === index ? 'focused' : ''
              } ${hoveredIndex === index ? 'hovered' : ''}`
            }
          >
            {option.label}
          </div>
        ))
      }
    </div>
  )
}

const CustomNode = ({
  node, style, dragHandle, onDelete, setContextMenu, onToggle, onEdit, onNodeDoubleClick, handleAdd
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const handleContextMenu = (e) => {
    e.preventDefault()
    const newContextMenu = {
      x: e.clientX,
      y: e.clientY,
      options: [
        {
          id: 'edit',
          label: 'Edit',
          action: () => onEdit(node.id)
        },
        {
          id: 'add-child',
          label: 'Add Narrower',
          action: () => handleAdd(node.id)
        },
        {
          id: 'delete',
          label: 'Delete',
          action: () => onDelete(node.id)
        }
      ]
    }
    setContextMenu(newContextMenu)
  }

  return (
    <div
      className="keyword-tree__node-content"
      style={style}
      ref={dragHandle}
      onContextMenu={handleContextMenu}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={() => onNodeDoubleClick(node.id)}
    >
      <div className="keyword-tree__icon-wrapper">
        {
          node.data.children && node.data.children.length > 0 ? (
            <button
              type="button"
              onClick={() => onToggle(node)}
              className="keyword-tree__icon-button keyword-tree__triangle-icon"
            >
              {node.isOpen ? <i className="fa fa-caret-down keyword-tree__caret-icon" aria-hidden="true" /> : <i className="fa fa-caret-right keyword-tree__caret-icon" aria-hidden="true" />}
            </button>
          ) : (
            <span className="keyword-tree__icon-button" />
          )
        }
      </div>
      <div className="keyword-tree__text-wrapper">
        <span
          className="keyword-tree__node-text"
          style={
            {
              backgroundColor: isHovered ? '#cce5ff' : 'transparent'
            }
          }
        >
          {node.data.title}
        </span>
      </div>
    </div>
  )
}

const KeywordTree = ({ data, onNodeDoubleClick, onNodeEdit }) => {
  const [treeData, setTreeData] = useState(Array.isArray(data) ? data : [data])
  const treeRef = useRef(null)
  const [contextMenu, setContextMenu] = useState(null)
  const contextMenuRef = useRef(null)
  const idAccessor = (node) => node.id || node.key || node.title
  const [showAddChildPopup, setShowAddChildPopup] = useState(false)
  const [newChildTitle, setNewChildTitle] = useState('')
  const [addChildParentId, setAddChildParentId] = useState(null)

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

  useEffect(() => {
    if (treeRef.current && treeData.length > 0) {
      const tree = treeRef.current
      const rootNode = tree.get(treeData[0].id)
      if (rootNode) {
        rootNode.open()
      }
    }
  }, [treeData])

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
    setAddChildParentId(parentId)
    setShowAddChildPopup(true)
  }

  const handleAddChildConfirm = () => {
    if (newChildTitle.trim()) {
      const newUuid = uuidv4()
      const newChild = {
        id: newUuid,
        key: newUuid,
        title: newChildTitle.trim(),
        children: []
      }
      setTreeData((prevData) => {
        const addChildToNode = (node) => {
          if (node.id === addChildParentId || node.key === addChildParentId) {
            return {
              ...node,
              children: [...(node.children || []), newChild]
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

      setShowAddChildPopup(false)
      setNewChildTitle('')
      setAddChildParentId(null)
    }
  }

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
        onchange={setTreeData}
      >
        {
          ({ node, ...props }) => (
            <CustomNode
              {...props}
              node={node}
              onAdd={handleAdd}
              onDelete={handleDelete}
              setContextMenu={setContextMenu}
              onToggle={handleToggle}
              onDoubleClick={onNodeDoubleClick}
              onEdit={onNodeEdit}
              onNodeDoubleClick={onNodeDoubleClick}
              handleAdd={handleAdd}
            />
          )
        }
      </Tree>
      {
        contextMenu && (
          <ContextMenu
            {...contextMenu}
            onClose={() => setContextMenu(null)}
            forwardedRef={contextMenuRef}
          />
        )
      }
      <Modal show={showAddChildPopup} onHide={() => setShowAddChildPopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Narrower</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              type="text"
              value={newChildTitle}
              onChange={(e) => setNewChildTitle(e.target.value)}
              placeholder="Enter Keyword"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddChildPopup(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddChildConfirm}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  )
}

const NodeShape = {
  key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}
NodeShape.children = PropTypes.arrayOf(PropTypes.shape(NodeShape))

ContextMenu.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired
  })).isRequired,
  forwardedRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]).isRequired
}

CustomNode.propTypes = {
  node: PropTypes.shape({
    data: PropTypes.shape({
      title: PropTypes.string.isRequired,
      children: NodeShape.children
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired
  }).isRequired,
  style: PropTypes.shape({}),
  dragHandle: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  onDelete: PropTypes.func.isRequired,
  setContextMenu: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onNodeDoubleClick: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired
}

CustomNode.defaultProps = {
  style: {},
  dragHandle: null
}

KeywordTree.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.shape(NodeShape),
    PropTypes.arrayOf(PropTypes.shape(NodeShape))
  ]).isRequired,
  onNodeDoubleClick: PropTypes.func.isRequired,
  onNodeEdit: PropTypes.func.isRequired
}

export default KeywordTree
