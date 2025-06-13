import React from 'react'
import {
  render,
  fireEvent,
  screen,
  within
} from '@testing-library/react'
import { vi } from 'vitest'
import { KeywordTreeCustomNode } from '../KeywordTreeCustomNode'
import '../KeywordTreeCustomNode.scss'

describe('KeywordTreeCustomNode component', () => {
  const defaultProps = {
    node: {
      id: '1',
      data: {
        title: 'Node 1',
        children: []
      },
      isOpen: false,
      isSelected: false,
      toggle: vi.fn()
    },
    style: {},
    dragHandle: { current: document.createElement('div') },
    onDelete: vi.fn(),
    setContextMenu: vi.fn(),
    onToggle: vi.fn(),
    onEdit: vi.fn(),
    onNodeClick: vi.fn(),
    handleAdd: vi.fn()
  }
  describe('When rendering', () => {
    test('should render node title correctly', () => {
      render(<KeywordTreeCustomNode {...defaultProps} />)
      expect(screen.getByText('Node 1')).toBeInTheDocument()
    })

    test('should render caret-down icon when node is open', () => {
      const nodeWithChildren = {
        ...defaultProps.node,
        isOpen: true,
        data: {
          ...defaultProps.node.data,
          children: [{
            id: 'child1',
            title: 'Child 1'
          }]
        }
      }
      render(<KeywordTreeCustomNode {...defaultProps} node={nodeWithChildren} />)

      const toggleButton = screen.getByRole('button', { name: /Toggle Node 1/i })

      expect(toggleButton).toHaveClass('keyword-tree__triangle-icon')
      expect(toggleButton).toHaveTextContent('') // The button should be empty (icon is not text)

      const caretIcon = within(toggleButton).getByRole('img', { hidden: true })
      expect(caretIcon).toHaveClass('fa-caret-down', 'keyword-tree__caret-icon')
    })

    test('should render caret-right icon when node is closed', () => {
      const nodeWithChildren = {
        ...defaultProps.node,
        data: {
          ...defaultProps.node.data,
          children: [{
            id: 'child1',
            title: 'Child 1'
          }]
        }
      }
      render(<KeywordTreeCustomNode {...defaultProps} node={nodeWithChildren} />)

      const toggleButton = screen.getByRole('button', { name: /Toggle Node 1/i })

      expect(toggleButton).toHaveClass('keyword-tree__triangle-icon')
      expect(toggleButton).toHaveTextContent('') // The button should be empty (icon is not text)

      const caretIcon = within(toggleButton).getByRole('img', { hidden: true })
      expect(caretIcon).toHaveClass('fa-caret-right', 'keyword-tree__caret-icon')
    })

    test('should not render toggle button for nodes without children', () => {
      render(<KeywordTreeCustomNode {...defaultProps} />)
      expect(screen.queryByRole('button', { name: /Toggle Node 1/i })).not.toBeInTheDocument()
    })
  })

  describe('when interactions', () => {
    test('should call onToggle when triangle icon is clicked', () => {
      const nodeWithChildren = {
        ...defaultProps.node,
        data: {
          ...defaultProps.node.data,
          children: [{
            id: 'child1',
            title: 'Child 1'
          }]
        }
      }
      render(<KeywordTreeCustomNode {...defaultProps} node={nodeWithChildren} />)

      const nodeContent = screen.getByRole('button', { name: /Keyword: Node 1/i })
      const triangleIcon = within(nodeContent).getByRole('button', { name: /Toggle Node 1/i })

      fireEvent.click(triangleIcon)
      expect(defaultProps.onToggle).toHaveBeenCalledWith(nodeWithChildren)
    })

    test('should call onNodeClick when node is clicked', () => {
      render(<KeywordTreeCustomNode {...defaultProps} />)
      const nodeContent = screen.getByRole('button', { name: /Keyword: Node 1/i })
      fireEvent.click(nodeContent)
      expect(defaultProps.onNodeClick).toHaveBeenCalledWith('1')
    })

    test('should show context menu on right click', () => {
      render(<KeywordTreeCustomNode {...defaultProps} />)
      const nodeContent = screen.getByRole('button', { name: /Keyword: Node 1/i })
      fireEvent.contextMenu(nodeContent)
      expect(defaultProps.setContextMenu).toHaveBeenCalled()
    })

    test('should change background color on hover', () => {
      render(<KeywordTreeCustomNode {...defaultProps} />)
      const nodeContent = screen.getByRole('button', { name: /Keyword: Node 1/i })
      const nodeText = within(nodeContent).getByText('Node 1')

      // Check initial state (not hovered)
      expect(nodeText).not.toHaveClass('keyword-tree__node-text--hovered')

      // Hover
      fireEvent.mouseEnter(nodeContent)
      expect(nodeText).toHaveClass('keyword-tree__node-text--hovered')

      // Un-hover
      fireEvent.mouseLeave(nodeContent)
      expect(nodeText).not.toHaveClass('keyword-tree__node-text--hovered')
    })

    test('should call onNodeClick when Enter key is pressed', () => {
      render(<KeywordTreeCustomNode {...defaultProps} />)
      const nodeContent = screen.getByRole('button', { name: /Keyword: Node 1/i })
      fireEvent.keyDown(nodeContent, { key: 'Enter' })
      expect(defaultProps.onNodeClick).toHaveBeenCalledWith('1')
    })

    test('should call onNodeClick when Space key is pressed', () => {
      render(<KeywordTreeCustomNode {...defaultProps} />)
      const nodeContent = screen.getByRole('button', { name: /Keyword: Node 1/i })
      fireEvent.keyDown(nodeContent, { key: ' ' })
      expect(defaultProps.onNodeClick).toHaveBeenCalledWith('1')
    })

    test('should not call onNodeClick for other key presses', () => {
      render(<KeywordTreeCustomNode {...defaultProps} />)
      const nodeContent = screen.getByRole('button', { name: /Keyword: Node 1/i })
      fireEvent.keyDown(nodeContent, { key: 'A' })
      expect(defaultProps.onNodeClick).not.toHaveBeenCalled()
    })
  })

  describe('when rendering Context Menu', () => {
    test('should render correct context menu options', () => {
      render(<KeywordTreeCustomNode {...defaultProps} />)
      const nodeContent = screen.getByRole('button', { name: /Keyword: Node 1/i })
      fireEvent.contextMenu(nodeContent)

      expect(defaultProps.setContextMenu).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.arrayContaining([
            expect.objectContaining({
              id: 'edit',
              label: 'Edit'
            }),
            expect.objectContaining({
              id: 'add-child',
              label: 'Add Narrower'
            }),
            expect.objectContaining({
              id: 'delete',
              label: 'Delete'
            })
          ])
        })
      )
    })

    test('should include delete option in context menu for nodes without children', () => {
      render(<KeywordTreeCustomNode {...defaultProps} />)
      const nodeContent = screen.getByRole('button', { name: /Keyword: Node 1/i })
      fireEvent.contextMenu(nodeContent)

      expect(defaultProps.setContextMenu).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.arrayContaining([
            expect.objectContaining({
              id: 'delete',
              label: 'Delete'
            })
          ])
        })
      )

      // Verify that the delete action calls onDelete with the entire node
      const deleteAction = defaultProps.setContextMenu.mock.calls[0][0].options.find((option) => option.id === 'delete').action
      deleteAction()
      expect(defaultProps.onDelete).toHaveBeenCalledWith(defaultProps.node)
    })

    test('should not include delete option in context menu for nodes with children', () => {
      const nodeWithChildren = {
        ...defaultProps.node,
        data: {
          ...defaultProps.node.data,
          children: [{
            id: 'child1',
            title: 'Child 1'
          }]
        }
      }
      render(<KeywordTreeCustomNode {...defaultProps} node={nodeWithChildren} />)
      const nodeContent = screen.getByRole('button', { name: /Keyword: Node 1/i })
      fireEvent.contextMenu(nodeContent)

      expect(defaultProps.setContextMenu).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.not.arrayContaining([
            expect.objectContaining({
              id: 'delete',
              label: 'Delete'
            })
          ])
        })
      )
    })

    test('should call onEdit when click on context menu edit', () => {
      render(<KeywordTreeCustomNode {...defaultProps} />)
      const nodeContent = screen.getByRole('button', { name: /Keyword: Node 1/i })
      fireEvent.contextMenu(nodeContent)

      const editAction = defaultProps.setContextMenu.mock.calls[0][0].options.find((option) => option.id === 'edit').action
      editAction()
      expect(defaultProps.onEdit).toHaveBeenCalledWith('1')
    })

    test('should call handleAdd when click on context menu add narrower', () => {
      render(<KeywordTreeCustomNode {...defaultProps} />)
      const nodeContent = screen.getByRole('button', { name: /Keyword: Node 1/i })
      fireEvent.contextMenu(nodeContent)

      const addChildAction = defaultProps.setContextMenu.mock.calls[0][0].options.find((option) => option.id === 'add-child').action
      addChildAction()
      expect(defaultProps.handleAdd).toHaveBeenCalledWith('1')
    })

    test('should call onDelete when click on context menu delete', () => {
      render(<KeywordTreeCustomNode {...defaultProps} />)
      const nodeContent = screen.getByRole('button', { name: /Keyword: Node 1/i })
      fireEvent.contextMenu(nodeContent)

      const deleteAction = defaultProps.setContextMenu.mock.calls[0][0].options.find((option) => option.id === 'delete').action
      deleteAction()
      expect(defaultProps.onDelete).toHaveBeenCalledWith(defaultProps.node)
    })
  })

  describe('when a search pattern is provided', () => {
    describe('when a match occurs', () => {
      test('should highlight matched search term in node title', () => {
        const propsWithSearchTerm = {
          ...defaultProps,
          searchTerm: 'Node'
        }
        render(<KeywordTreeCustomNode {...propsWithSearchTerm} />)

        const highlightedText = screen.getByText((content, element) => element.tagName.toLowerCase() === 'strong' && content === 'Node')

        expect(highlightedText).toBeInTheDocument()
      })
    })

    describe('when a match does not occur', () => {
      test('renders node title without changes', () => {
        const propsWithNoMatchTerm = {
          ...defaultProps,
          searchTerm: 'NoMatch'
        }
        render(<KeywordTreeCustomNode {...propsWithNoMatchTerm} />)

        const regularText = screen.getByText('Node 1')

        expect(regularText).toBeInTheDocument()
        expect(regularText.tagName.toLowerCase()).not.toBe('strong')
      })
    })

    describe('when search term is empty', () => {
      test('should render node title without changes', () => {
        const propsWithEmptySearchTerm = {
          ...defaultProps,
          searchTerm: ''
        }
        render(<KeywordTreeCustomNode {...propsWithEmptySearchTerm} />)

        const regularText = screen.getByText('Node 1')

        expect(regularText).toBeInTheDocument()
        expect(regularText.tagName.toLowerCase()).not.toBe('strong')
      })
    })
  })

  describe('when node is selected', () => {
    test('should have selected class when selected', () => {
      const selectedNodeProps = {
        ...defaultProps,
        node: {
          ...defaultProps.node,
          isSelected: true
        }
      }
      render(<KeywordTreeCustomNode {...selectedNodeProps} />)

      const nodeContent = screen.getByRole('button', { name: /Keyword: Node 1/i })
      const nodeText = within(nodeContent).getByText('Node 1')

      expect(nodeText).toHaveClass('keyword-tree__node-text--selected')
    })

    test('should not have selected class when not selected', () => {
      render(<KeywordTreeCustomNode {...defaultProps} />)

      const nodeContent = screen.getByRole('button', { name: /Keyword: Node 1/i })
      const nodeText = within(nodeContent).getByText('Node 1')

      expect(nodeText).not.toHaveClass('keyword-tree__node-text--selected')
    })
  })
})
