import React, {
  useState,
  useEffect,
  useRef
} from 'react'
import { Tree } from 'react-arborist'
import PropTypes from 'prop-types'

const iconButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  padding: '0 5px'
}

const nodeTextStyle = {
  fontSize: '14px'
}

const nodeContentStyle = {
  display: 'flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}

const treeContainerStyle = {
  width: '100%',
  height: '500px',
  overflowX: 'auto',
  overflowY: 'auto'
}

const ContextMenu = ({
  x, y, onClose, options, forwardedRef
}) => {
  const style = {
    position: 'absolute',
    top: `${y}px`,
    left: `${x}px`,
    background: 'white',
    border: '1px solid #ccc',
    boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
    zIndex: 1000
  }

  return (
    <div style={style} ref={forwardedRef}>
      {
        options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={
              () => {
                option.action()
                onClose()
              }
            }
            onKeyDown={
              (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  option.action()
                  onClose()
                }
              }
            }
            style={
              {
                padding: '5px 10px',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                width: '100%',
                textAlign: 'left'
              }
            }
          >
            {option.label}
          </button>
        ))
      }
    </div>

  )
}

const CustomNode = ({
  node, style, dragHandle, onAdd, onDelete, setContextMenu
}) => {
  const handleContextMenu = (e) => {
    e.preventDefault()
    const newContextMenu = {
      x: e.clientX,
      y: e.clientY,
      options: [
        {
          id: 'add-child',
          label: 'Add Child',
          action: () => onAdd({
            id: Math.random().toString(36).substr(2, 9),
            title: 'New Child',
            children: []
          }, node.id)
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
      style={
        {
          ...style,
          ...nodeContentStyle
        }
      }
      ref={dragHandle}
      onContextMenu={handleContextMenu}
    >
      {
        node.data.children && node.data.children.length > 0 ? (
          <button type="button" onClick={() => node.toggle()} style={iconButtonStyle}>
            {node.isOpen ? '−' : '+'}
          </button>
        ) : (
          <span style={
            {
              ...iconButtonStyle,
              width: '1.25em',
              display: 'inline-block'
            }
          }
          />
        )
      }
      <span style={nodeTextStyle}>{node.data.title}</span>
    </div>
  )
}

const KeywordTree = ({ data }) => {
  const [treeData, setTreeData] = useState(Array.isArray(data) ? data : [data])
  const [contextMenu, setContextMenu] = useState(null)
  const contextMenuRef = useRef(null)
  const idAccessor = (node) => node.id || node.key || node.title

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

  const handleAdd = (newChild, parentId) => {
    setTreeData((prevData) => {
      const addChildToNode = (node) => {
        if (node.id === parentId || node.key === parentId) {
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
    <div style={treeContainerStyle}>
      <Tree
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
    </div>
  )
}

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

const NodeShape = {
  key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}
NodeShape.children = PropTypes.arrayOf(PropTypes.shape(NodeShape))

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
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  setContextMenu: PropTypes.func.isRequired
}

CustomNode.defaultProps = {
  style: {},
  dragHandle: null
}

KeywordTree.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.shape(NodeShape),
    PropTypes.arrayOf(PropTypes.shape(NodeShape))
  ]).isRequired
}

export default KeywordTree
