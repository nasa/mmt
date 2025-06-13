import PropTypes from 'prop-types'
import React, { useState } from 'react'

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
  searchTerm,
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
        }
      ]
    }
    // Only add the 'Delete' option if the node doesn't have children
    if (!node.data.children || node.data.children.length === 0) {
      newContextMenu.options.push({
        id: 'delete',
        label: 'Delete',
        action: () => onDelete(node)
      })
    }

    setContextMenu(newContextMenu)
  }

  const nodeTextClasses = ['keyword-tree__node-text']
  if (node.isSelected) {
    nodeTextClasses.push('keyword-tree__node-text--selected')
  } else if (isHovered) {
    nodeTextClasses.push('keyword-tree__node-text--hovered')
  }

  const highlightSearchTerm = (text, term) => {
    if (!term) {
      // Return the original text if there is no search term
      return text
    }

    // Define a regular expression to match the search term, case-insensitive
    const regex = new RegExp(`(${term})`, 'gi')
    // Split the text by the search term regex
    const parts = text.split(regex)

    // Map over each part, applying <strong> tags to the matched term parts
    return parts.map((part, index) => {
      const key = `${part}-${index}` // This still uses index but further distinguished with text content

      if (regex.test(part)) {
        return <strong key={key}>{part}</strong>
      }

      return part
    })
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
        <span className={nodeTextClasses.join(' ')}>
          {highlightSearchTerm(node.data.title, searchTerm)}
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
    isSelected: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired
  }).isRequired,
  style: PropTypes.shape({}),
  onDelete: PropTypes.func,
  searchTerm: PropTypes.string,
  setContextMenu: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onNodeClick: PropTypes.func.isRequired
}

KeywordTreeCustomNode.defaultProps = {
  dragHandle: null,
  searchTerm: null,
  style: {},
  onEdit: null,
  onDelete: null
}
