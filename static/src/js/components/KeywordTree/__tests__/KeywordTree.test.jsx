import React from 'react'
import {
  render,
  fireEvent,
  screen,
  within,
  waitFor
} from '@testing-library/react'
import {
  describe,
  test,
  expect,
  vi
} from 'vitest'
import { KeywordTree } from '../KeywordTree'

describe('KeywordTree component', () => {
  const mockData = [
    {
      id: '1',
      key: '1',
      title: 'Root',
      children: [
        {
          id: '2',
          key: '2',
          title: 'Child 1',
          children: []
        },
        {
          id: '3',
          key: '3',
          title: 'Child 2',
          children: []
        }
      ]
    }
  ]

  const mockOnNodeClick = vi.fn()
  const mockOnNodeEdit = vi.fn()
  const mockOnAddNarrower = vi.fn()
  let consoleErrorSpy

  beforeAll(() => {
    // Suppress console.error for all tests in this file
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    // Restore console.error after all tests
    consoleErrorSpy.mockRestore()
  })

  describe('when rendering', () => {
    test('should render KeywordTree component', () => {
      render(
        <KeywordTree
          data={mockData}
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
        />
      )

      expect(screen.getByText('Root')).toBeTruthy()
    })

    test('should expand root node on initial render', () => {
      render(
        <KeywordTree
          data={mockData}
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
        />
      )

      expect(screen.getByText('Child 1')).toBeTruthy()
      expect(screen.getByText('Child 2')).toBeTruthy()
    })

    test('should handle empty data gracefully', () => {
      render(
        <KeywordTree
          data={[]}
          onNodeClick={vi.fn()}
          onNodeEdit={vi.fn()}
          onAddNarrower={vi.fn()}
        />
      )

      // Check if the tree container is rendered
      const treeContainer = screen.getByRole('tree')
      expect(treeContainer).toBeInTheDocument()

      // Check that no nodes are rendered
      const nodes = screen.queryAllByRole('button', { name: /Keyword:/i })
      expect(nodes).toHaveLength(0)
    })
  })

  describe('when node interaction', () => {
    test('should call onNodeClick when a node is clicked', () => {
      render(
        <KeywordTree
          data={mockData}
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
        />
      )

      fireEvent.click(screen.getByText('Child 1'))
      expect(mockOnNodeClick).toHaveBeenCalledWith('2')
    })

    test('should toggle node expansion when clicked', async () => {
      const dataWithGrandchildren = [
        {
          id: '1',
          key: '1',
          title: 'Root',
          children: [
            {
              id: '2',
              key: '2',
              title: 'Child 1',
              children: [
                {
                  id: '4',
                  key: '4',
                  title: 'Grandchild 1',
                  children: []
                }
              ]
            }
          ]
        }
      ]

      render(
        <KeywordTree
          data={dataWithGrandchildren}
          onNodeClick={vi.fn()}
          onNodeEdit={vi.fn()}
          onAddNarrower={vi.fn()}
        />
      )

      // Find the root node
      const rootNode = screen.getByRole('button', { name: /Keyword: Root/i })
      expect(rootNode).toBeInTheDocument()

      // Find Child 1 node (it should be visible initially as the root is expanded by default)
      const child1Node = screen.getByRole('button', { name: /Keyword: Child 1/i })
      expect(child1Node).toBeInTheDocument()

      // Initially, Grandchild 1 should not be visible
      expect(screen.queryByRole('button', { name: /Keyword: Grandchild 1/i })).not.toBeInTheDocument()

      // Find the toggle button for Child 1
      const child1Toggle = within(child1Node).getByRole('button', { name: /Toggle Child 1/i })
      expect(child1Toggle).toBeInTheDocument()

      // Click on the toggle button to expand Child 1
      fireEvent.click(child1Toggle)

      // After clicking, Grandchild 1 should become visible
      await waitFor(() => {
        const grandchild1Node = screen.getByRole('button', { name: /Keyword: Grandchild 1/i })
        expect(grandchild1Node).toBeInTheDocument()
      })

      // Click on the toggle button again to collapse Child 1
      fireEvent.click(child1Toggle)

      // After collapsing, Grandchild 1 should not be visible again
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /Keyword: Grandchild 1/i })).not.toBeInTheDocument()
      })
    })

    test('should handle node click on leaf nodes', () => {
      render(
        <KeywordTree
          data={mockData}
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
        />
      )

      fireEvent.click(screen.getByText('Child 1'))
      expect(mockOnNodeClick).toHaveBeenCalledWith('2')
    })

    test('should handle node click on parent nodes', () => {
      render(
        <KeywordTree
          data={mockData}
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
        />
      )

      fireEvent.click(screen.getByText('Root'))
      expect(mockOnNodeClick).toHaveBeenCalledWith('1')
    })

    test('should handle rapid expansion and collapse of nodes', async () => {
      const nestedData = [
        {
          id: '1',
          key: '1',
          title: 'Root',
          children: [
            {
              id: '2',
              key: '2',
              title: 'Parent 1',
              children: [
                {
                  id: '3',
                  key: '3',
                  title: 'Child 1',
                  children: []
                }
              ]
            },
            {
              id: '4',
              key: '4',
              title: 'Parent 2',
              children: [
                {
                  id: '5',
                  key: '5',
                  title: 'Child 2',
                  children: []
                }
              ]
            }
          ]
        }
      ]

      render(
        <KeywordTree
          data={nestedData}
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
        />
      )

      const parent1Node = screen.getByText('Parent 1')
      const parent2Node = screen.getByText('Parent 2')

      // Rapidly expand and collapse nodes
      fireEvent.click(parent1Node)
      fireEvent.click(parent2Node)
      fireEvent.click(parent1Node)
      fireEvent.click(parent2Node)

      // Check if the tree structure is maintained
      expect(screen.getByText('Root')).toBeInTheDocument()
      expect(screen.getByText('Parent 1')).toBeInTheDocument()
      expect(screen.getByText('Parent 2')).toBeInTheDocument()

      // Check if child nodes are not visible (as parents should be collapsed after the last click)
      expect(screen.queryByText('Child 1')).not.toBeInTheDocument()
      expect(screen.queryByText('Child 2')).not.toBeInTheDocument()
    })
  })

  describe('when context menu', () => {
    test('should display context menu when right click', () => {
      render(
        <KeywordTree
          data={mockData}
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
        />
      )

      fireEvent.contextMenu(screen.getByText('Child 1'))
      expect(screen.getByRole('menu')).toBeTruthy()
    })

    test('should close context menu when clicking outside', () => {
      render(
        <KeywordTree
          data={mockData}
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
        />
      )

      fireEvent.contextMenu(screen.getByText('Child 1'))
      expect(screen.getByRole('menu')).toBeTruthy()

      fireEvent.mouseDown(document.body)
      expect(screen.queryByRole('menu')).toBeFalsy()
    })

    test('should handles multiple context menu opens without clicking', () => {
      render(
        <KeywordTree
          data={mockData}
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
        />
      )

      fireEvent.contextMenu(screen.getByText('Root'))
      fireEvent.contextMenu(screen.getByText('Child 1'))
      fireEvent.contextMenu(screen.getByText('Child 2'))

      // Only the last context menu should be open
      expect(screen.getAllByRole('menu')).toHaveLength(1)
    })
  })

  describe('when adding nodes', () => {
    test('should add a new node when "Add Narrower" is used', async () => {
      render(
        <KeywordTree
          data={mockData}
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
        />
      )

      // Open context menu
      fireEvent.contextMenu(screen.getByText('Root'))

      // Click "Add Narrower" option
      fireEvent.click(screen.getByText('Add Narrower'))

      // Check if modal is open
      expect(screen.getByText('Add Narrower')).toBeInTheDocument()

      // Enter new node title
      fireEvent.change(screen.getByPlaceholderText('Enter Keyword'), {
        target: { value: 'New Child' }
      })

      // Click "Add" button
      fireEvent.click(screen.getByText('Add'))

      // Check if new node is added
      await waitFor(() => {
        expect(screen.getByText('New Child')).toBeInTheDocument()
      })

      // Check if onAddNarrower was called
      expect(mockOnAddNarrower).toHaveBeenCalled()
    })

    test('should close "Add Narrower" modal when Cancel is clicked', async () => {
      render(
        <KeywordTree
          data={mockData}
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
        />
      )

      // Open context menu
      fireEvent.contextMenu(screen.getByText('Root'))

      // Click "Add Narrower" option
      fireEvent.click(screen.getByText('Add Narrower'))

      // Check if modal is open
      expect(screen.getByText('Add Narrower')).toBeInTheDocument()

      // Click "Cancel" button
      fireEvent.click(screen.getByText('Cancel'))

      // Check if modal is closed
      await waitFor(() => {
        expect(screen.queryByText('Add Narrower')).not.toBeInTheDocument()
      })
    })

    test('should handle adding a node with empty title', async () => {
      render(
        <KeywordTree
          data={mockData}
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
        />
      )

      // Open context menu
      fireEvent.contextMenu(screen.getByText('Root'))
      // Click "Add Narrower" option
      fireEvent.click(screen.getByText('Add Narrower'))

      // Check if modal is open
      expect(screen.getByText('Add Narrower')).toBeInTheDocument()

      // Don't enter any title (leave it empty)

      // Click "Add" button
      fireEvent.click(screen.getByText('Add'))

      // Check if modal is still open (because empty title should not be added)
      expect(screen.getByText('Add Narrower')).toBeInTheDocument()
    })

    test('should expand parent node when a new child is added', async () => {
      const collapsedData = [
        {
          id: '1',
          key: '1',
          title: 'Root',
          children: [
            {
              id: '2',
              key: '2',
              title: 'Collapsed Parent',
              children: []
            }
          ]
        }
      ]

      render(
        <KeywordTree
          data={collapsedData}
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
        />
      )

      // Open context menu for Collapsed Parent
      fireEvent.contextMenu(screen.getByText('Collapsed Parent'))

      // Click "Add Narrower" option
      fireEvent.click(screen.getByText('Add Narrower'))

      // Enter new node title
      fireEvent.change(screen.getByPlaceholderText('Enter Keyword'), {
        target: { value: 'New Child' }
      })

      // Click "Add" button
      fireEvent.click(screen.getByText('Add'))

      // Check if new node is added and visible (parent should be expanded)
      await waitFor(() => {
        expect(screen.getByText('New Child')).toBeInTheDocument()
      })
    })

    test('should handle adding a node with a very long title', async () => {
      render(
        <KeywordTree
          data={mockData}
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
        />
      )

      fireEvent.contextMenu(screen.getByText('Root'))
      fireEvent.click(screen.getByText('Add Narrower'))
      fireEvent.change(screen.getByPlaceholderText('Enter Keyword'), {
        target: { value: 'This is a very long title for a new node that might cause issues with layout or display' }
      })

      fireEvent.click(screen.getByText('Add'))

      await waitFor(() => {
        expect(screen.getByText('This is a very long title for a new node that might cause issues with layout or display')).toBeInTheDocument()
      })
    })

    test('should handle nodes with very long titles', async () => {
      const longTitleData = [
        {
          id: '1',
          key: '1',
          title: 'Root',
          children: [
            {
              id: '2',
              key: '2',
              title: 'This is a very long title that might cause issues with layout or display',
              children: []
            }
          ]
        }
      ]

      render(
        <KeywordTree
          data={longTitleData}
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
        />
      )

      expect(screen.getByText('This is a very long title that might cause issues with layout or display')).toBeInTheDocument()
    })
  })

  describe('when editing and deleting nodes', () => {
    test('deletes a node when "Delete" is used', async () => {
      render(
        <KeywordTree
          data={mockData}
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
        />
      )

      // Open context menu for Child 1
      fireEvent.contextMenu(screen.getByText('Child 1'))

      // Click "Delete" option
      fireEvent.click(screen.getByText('Delete'))

      // Check if node is deleted
      await waitFor(() => {
        expect(screen.queryByText('Child 1')).not.toBeInTheDocument()
      })
    })

    test('should edit a node when "Edit" is used', () => {
      render(
        <KeywordTree
          data={mockData}
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
        />
      )

      // Open context menu for Child 1
      fireEvent.contextMenu(screen.getByText('Child 1'))

      // Click "Edit" option
      fireEvent.click(screen.getByText('Edit'))

      // Check if onNodeEdit was called with correct id
      expect(mockOnNodeEdit).toHaveBeenCalledWith('2')
    })
  })

  describe('when tree state management', () => {
    test('should maintain tree state when nodes are added or deleted', async () => {
      render(
        <KeywordTree
          data={mockData}
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
        />
      )

      // Add a new node
      fireEvent.contextMenu(screen.getByText('Root'))
      fireEvent.click(screen.getByText('Add Narrower'))
      fireEvent.change(screen.getByPlaceholderText('Enter Keyword'), {
        target: { value: 'New Child' }
      })

      fireEvent.click(screen.getByText('Add'))

      await waitFor(() => {
        expect(screen.getByText('New Child')).toBeInTheDocument()
      })

      // Delete an existing node
      fireEvent.contextMenu(screen.getByText('Child 1'))
      fireEvent.click(screen.getByText('Delete'))

      await waitFor(() => {
        expect(screen.queryByText('Child 1')).not.toBeInTheDocument()
      })

      // Check if other nodes still exist
      expect(screen.getByText('Root')).toBeInTheDocument()
      expect(screen.getByText('Child 2')).toBeInTheDocument()
      expect(screen.getByText('New Child')).toBeInTheDocument()
    })

    test('should handle concurrent add and delete operations', async () => {
      render(
        <KeywordTree
          data={mockData}
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
        />
      )

      // Add a new node
      fireEvent.contextMenu(screen.getByText('Root'))
      fireEvent.click(screen.getByText('Add Narrower'))
      fireEvent.change(screen.getByPlaceholderText('Enter Keyword'), {
        target: { value: 'New Node' }
      })

      fireEvent.click(screen.getByText('Add'))

      // Delete an existing node
      fireEvent.contextMenu(screen.getByText('Child 1'))
      fireEvent.click(screen.getByText('Delete'))

      // Check if the new node is added and the deleted node is removed
      await waitFor(() => {
        expect(screen.getByText('New Node')).toBeInTheDocument()
      })

      expect(screen.queryByText('Child 1')).not.toBeInTheDocument()

      // Check if other existing nodes are still present
      expect(screen.getByText('Root')).toBeInTheDocument()
      expect(screen.getByText('Child 2')).toBeInTheDocument()
    })

    test('should not modify nodes that are not the target parent and have no children', async () => {
      const dataWithLeafNodes = [
        {
          id: '1',
          key: '1',
          title: 'Root',
          children: [
            {
              id: '2',
              key: '2',
              title: 'Leaf Node 1'
            },
            {
              id: '3',
              key: '3',
              title: 'Leaf Node 2'
            }
          ]
        }
      ]

      render(
        <KeywordTree
          data={dataWithLeafNodes}
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
        />
      )

      // Attempt to add a child to Leaf Node 1
      fireEvent.contextMenu(screen.getByText('Leaf Node 1'))
      fireEvent.click(screen.getByText('Add Narrower'))
      fireEvent.change(screen.getByPlaceholderText('Enter Keyword'), {
        target: { value: 'New Child' }
      })

      fireEvent.click(screen.getByText('Add'))

      // Wait for the new node to be added
      await waitFor(() => {
        expect(screen.getByText('New Child')).toBeInTheDocument()
      })

      // Verify that Leaf Node 2 remains unchanged
      expect(screen.getByText('Leaf Node 2')).toBeInTheDocument()

      // Verify that Leaf Node 2 still doesn't have any children
      const leafNode2 = screen.getByRole('treeitem', { name: /Leaf Node 2/i })
      expect(within(leafNode2).queryByRole('group')).not.toBeInTheDocument()
    })
  })

  describe('when edge cases and performance', () => {
    test('should handle nodes with empty children array', () => {
      const dataWithEmptyChildren = [
        {
          id: '1',
          key: '1',
          title: 'Root',
          children: [
            {
              id: '2',
              key: '2',
              title: 'Node with empty children',
              children: []
            }
          ]
        }
      ]

      render(
        <KeywordTree
          data={dataWithEmptyChildren}
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
        />
      )

      expect(screen.getByText('Node with empty children')).toBeInTheDocument()
    })

    test('should handle very large number of operations without crashing', async () => {
      render(
        <KeywordTree
          data={mockData}
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
        />
      )

      const root = screen.getByText('Root')

      // Perform a large number of expand/collapse operations
      for (let i = 0; i < 1000; i += 1) {
        fireEvent.click(root)
      }

      // The component should still be responsive after many operations
      fireEvent.click(root)
      await waitFor(() => {
        expect(screen.getByText('Child 1')).toBeInTheDocument()
      })
    })
  })
})
