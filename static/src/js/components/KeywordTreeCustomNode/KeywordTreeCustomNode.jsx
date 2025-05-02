import React, { useState } from 'react'
import PropTypes from 'prop-types'

import './KeywordTreeCustomNode.scss'

/**
 * CustomNode Component
 *
 * This component renders a single node in the KeywordTree. It handles node
 * interactions such as toggling, context menu, and hover effects.
 *
 * @component
 * @param {Object} props
 * @param {Function|Object} props.dragHandle - Ref or function for drag handle
 * @param {Function} props.handleAdd - Callback function to add a child node
 * @param {Object} props.node - The node data object
 * @param {Function} props.onDelete - Callback function to delete a node
 * @param {Function} props.onEdit - Callback function to edit a node
 * @param {Function} props.onNodeClick - Callback function for node click
 * @param {Function} props.onToggle - Callback function to toggle node expansion
 * @param {Function} props.setContextMenu - Function to set the context menu
 * @param {Object} props.style - Inline styles for the node
 *
 * @example
 * <CustomNode
 *   dragHandle={dragHandleRef}
 *   handleAdd={(parentId) => console.log('Add child to', parentId)}
 *   node={{
 *     id: '1',
 *     data: { title: 'Node 1', children: [] },
 *     isOpen: false,
 *     toggle: () => {}
 *   }}
 *   onDelete={(id) => console.log('Delete node', id)}
 *   onEdit={(id) => console.log('Edit node', id)}
 *   onNodeClick={(id) => console.log('Click on node', id)}
 *   onToggle={(node) => node.toggle()}
 *   setContextMenu={(menu) => setContextMenu(menu)}
 *   style={{}}
 * />
 */
export const KeywordTreeCustomNode = ({
  dragHandle,
  handleAdd,
  node,
  onDelete,
  onEdit,
  onNodeClick,
  onToggle,
  setContextMenu,
  style
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const handleTriangleClick = (e) => {
    e.stopPropagation()
    onToggle(node)
  }

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
      onClick={() => onNodeClick(node.id)}
      onKeyDown={
        (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onNodeClick(node.id)
          }
        }
      }
      tabIndex={0}
      role="button"
      aria-label={`Keyword: ${node.data.title}`}
    >
      <div className="keyword-tree__icon-wrapper">
        {
          node.data.children && node.data.children.length > 0 ? (
            <button
              type="button"
              onClick={handleTriangleClick}
              className="keyword-tree__icon-button keyword-tree__triangle-icon"
              aria-label={`Toggle ${node.data.title}`}
            >
              {
                node.isOpen ? (
                  <i className="fa fa-caret-down keyword-tree__caret-icon" aria-hidden="true" role="img" />
                ) : (
                  <i className="fa fa-caret-right keyword-tree__caret-icon" aria-hidden="true" role="img" />
                )
              }
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

const NodeShape = {
  key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}
NodeShape.children = PropTypes.arrayOf(PropTypes.shape(NodeShape))

KeywordTreeCustomNode.propTypes = {
  dragHandle: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  handleAdd: PropTypes.func.isRequired,
  node: PropTypes.shape({
    data: PropTypes.shape({
      title: PropTypes.string.isRequired,
      children: NodeShape.children
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onNodeClick: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  setContextMenu: PropTypes.func.isRequired,
  style: PropTypes.shape({})
}

KeywordTreeCustomNode.defaultProps = {
  dragHandle: null,
  style: {}
}
