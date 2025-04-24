import React, { useState } from 'react'
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

const CustomNode = ({
  node, style, dragHandle, onAdd
}) => {
  const addChild = () => {
    const newChild = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Child',
      children: []
    }
    onAdd(newChild, node.id)
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
      <button type="button" onClick={addChild} style={iconButtonStyle}>
        ➕
      </button>
    </div>
  )
}

const KeywordTree = ({ data }) => {
  const [treeData, setTreeData] = useState(Array.isArray(data) ? data : [data])

  const idAccessor = (node) => node.id || node.key || node.title

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
        {({ node, ...props }) => <CustomNode {...props} node={node} onAdd={handleAdd} />}
      </Tree>
    </div>
  )
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
  onAdd: PropTypes.func.isRequired
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
