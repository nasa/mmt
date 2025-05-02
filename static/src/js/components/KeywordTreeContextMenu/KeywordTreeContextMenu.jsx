import React, { useState } from 'react'
import PropTypes from 'prop-types'

import './KeywordTreeContextMenu.scss'

/**
 * ContextMenu Component
 *
 * This component renders a context menu at the specified coordinates with given options.
 * It supports keyboard navigation and accessibility features.
 *
 * @component
 * @param {Object} props
 * @param {number} props.x - The x-coordinate for positioning the context menu
 * @param {number} props.y - The y-coordinate for positioning the context menu
 * @param {Function} props.onClose - Callback function to close the context menu
 * @param {Array} props.options - An array of option objects for the context menu
 * @param {React.Ref} props.forwardedRef - Ref to be forwarded to the context menu container
 *
 * @example
 * const contextMenuOptions = [
 *   { id: 'edit', label: 'Edit', action: () => console.log('Edit clicked') },
 *   { id: 'delete', label: 'Delete', action: () => console.log('Delete clicked') }
 * ];
 *
 * const handleClose = () => {
 *   setShowContextMenu(false);
 * };
 *
 * return (
 *   showContextMenu && (
 *     <ContextMenu
 *       x={mousePosition.x}
 *       y={mousePosition.y}
 *       onClose={handleClose}
 *       options={contextMenuOptions}
 *       forwardedRef={contextMenuRef}
 *     />
 *   )
 * );
 */
export const KeywordTreeContextMenu = ({
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

KeywordTreeContextMenu.propTypes = {
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
