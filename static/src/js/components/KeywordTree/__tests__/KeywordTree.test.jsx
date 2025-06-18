import React from 'react'
import {
  render,
  fireEvent,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import {
  describe,
  test,
  expect,
  vi,
  beforeEach
} from 'vitest'
import getKmsKeywordTree from '@/js/utils/getKmsKeywordTree'
import { KeywordTree } from '../KeywordTree'

// Mock the getKmsKeywordTree function
vi.mock('@/js/utils/getKmsKeywordTree')

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

describe('KeywordTree component', () => {
  const mockOnNodeClick = vi.fn()
  const mockOnNodeEdit = vi.fn()
  const mockOnAddNarrower = vi.fn()
  const mockSelectedVersion = { id: 'v1' }
  const mockSelectedScheme = { id: 's1' }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('when rendering tree', () => {
    test('should render placeholder when no version or scheme selected', () => {
      render(<KeywordTree onNodeClick={mockOnNodeClick} />)
      expect(screen.getByText('Select a version and scheme to load the tree')).toBeInTheDocument()
    })

    test('should render loading state when fetching tree data', async () => {
      getKmsKeywordTree.mockResolvedValueOnce([])
      render(
        <KeywordTree
          onNodeClick={mockOnNodeClick}
          selectedVersion={mockSelectedVersion}
          selectedScheme={mockSelectedScheme}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument()
      })
    })
  })

  describe('when fetching tree', () => {
    test('should fetch tree data when version and scheme are selected', async () => {
      const mockTreeData = [{
        id: '1',
        title: 'Root',
        children: []
      }]
      getKmsKeywordTree.mockResolvedValueOnce(mockTreeData)

      render(
        <KeywordTree
          onNodeClick={mockOnNodeClick}
          selectedVersion={mockSelectedVersion}
          selectedScheme={mockSelectedScheme}
        />
      )

      await waitFor(() => {
        expect(getKmsKeywordTree).toHaveBeenCalledWith(mockSelectedVersion, mockSelectedScheme, '')
      })

      expect(screen.getByText('Root')).toBeInTheDocument()
    })

    test('should handle error when fetching tree data fails', async () => {
      getKmsKeywordTree.mockRejectedValueOnce(new Error('Fetch error'))

      render(
        <KeywordTree
          onNodeClick={mockOnNodeClick}
          selectedVersion={mockSelectedVersion}
          selectedScheme={mockSelectedScheme}
        />
      )

      await waitFor(() => {
        expect(screen.getByText(/Failed to load the tree/i)).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    test('should set tree data to null when refreshTree is called without version and scheme', async () => {
      const mockTreeData = [{
        id: '1',
        title: 'Root',
        children: []
      }]
      getKmsKeywordTree.mockResolvedValueOnce(mockTreeData)

      const { rerender } = render(
        <KeywordTree
          onNodeClick={mockOnNodeClick}
          selectedVersion={{ id: 'v1' }}
          selectedScheme={{ id: 's1' }}
        />
      )

      // Wait for the initial render with data
      await waitFor(() => {
        expect(screen.getByText('Root')).toBeInTheDocument()
      })

      // Clear the selected version and scheme and call refreshTree
      const ref = { current: null }
      rerender(
        <KeywordTree
          ref={ref}
          onNodeClick={mockOnNodeClick}
          selectedVersion={null}
          selectedScheme={null}
        />
      )

      // Call refreshTree directly
      await ref.current.refreshTree()

      // Check that the tree data has been cleared
      await waitFor(() => {
        expect(screen.queryByText('Root')).not.toBeInTheDocument()
      })

      // Verify that the placeholder message is shown
      expect(screen.getByText('Select a version and scheme to load the tree')).toBeInTheDocument()
    })
  })

  describe('when searching', () => {
    test('should update search pattern when apply button is clicked', async () => {
      const mockTreeData = [{
        id: '1',
        title: 'Root',
        children: []
      }]
      getKmsKeywordTree.mockResolvedValue(mockTreeData)

      render(
        <KeywordTree
          onNodeClick={mockOnNodeClick}
          selectedVersion={mockSelectedVersion}
          selectedScheme={mockSelectedScheme}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Root')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText('Search by Pattern or UUID')
      const applyButton = screen.getByText('Apply')

      fireEvent.change(searchInput, { target: { value: 'test' } })
      fireEvent.click(applyButton)

      await waitFor(() => {
        expect(getKmsKeywordTree).toHaveBeenCalledWith(mockSelectedVersion, mockSelectedScheme, 'test')
      })
    })

    test('should update search pattern when Enter key is pressed', async () => {
      const mockTreeData = [{
        id: '1',
        title: 'Root',
        children: []
      }]
      getKmsKeywordTree.mockResolvedValue(mockTreeData)

      render(
        <KeywordTree
          onNodeClick={mockOnNodeClick}
          selectedVersion={mockSelectedVersion}
          selectedScheme={mockSelectedScheme}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Root')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText('Search by Pattern or UUID')

      fireEvent.change(searchInput, { target: { value: 'test' } })
      fireEvent.keyDown(searchInput, {
        key: 'Enter',
        code: 'Enter'
      })

      await waitFor(() => {
        expect(getKmsKeywordTree).toHaveBeenCalledWith(mockSelectedVersion, mockSelectedScheme, 'test')
      })
    })

    test('should clear search pattern when input is cleared', async () => {
      const mockTreeData = [{
        id: '1',
        key: '1',
        title: 'Root',
        children: []
      }]
      getKmsKeywordTree.mockResolvedValue(mockTreeData)

      render(
        <KeywordTree
          onNodeClick={mockOnNodeClick}
          selectedVersion={mockSelectedVersion}
          selectedScheme={mockSelectedScheme}
        />
      )

      // Wait for the component to render
      await waitFor(() => {
        expect(screen.getByText('Root')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText('Search by Pattern or UUID')

      // Set an initial search pattern
      fireEvent.change(searchInput, { target: { value: 'test' } })

      // Clear the input
      fireEvent.change(searchInput, { target: { value: '' } })

      // Verify that getKmsKeywordTree is called with an empty string
      await waitFor(() => {
        expect(getKmsKeywordTree).toHaveBeenCalledWith(mockSelectedVersion, mockSelectedScheme, '')
      })
    })
  })

  describe('when clicking on nodes in tree', () => {
    test('should call onNodeClick when a node is clicked', async () => {
      const mockTreeData = [{
        id: '1',
        key: '1',
        title: 'Root',
        children: [{
          id: '2',
          key: '2',
          title: 'Child',
          children: []
        }]
      }]

      getKmsKeywordTree.mockResolvedValue(mockTreeData)

      render(
        <KeywordTree
          onNodeClick={mockOnNodeClick}
          selectedVersion={mockSelectedVersion}
          selectedScheme={mockSelectedScheme}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Child')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Child'))

      await waitFor(() => {
        expect(mockOnNodeClick).toHaveBeenCalledWith('2')
      })
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

      // Mock the getKmsKeywordTree to return our test data
      getKmsKeywordTree.mockResolvedValue(dataWithGrandchildren)

      render(
        <KeywordTree
          onNodeClick={vi.fn()}
          onNodeEdit={vi.fn()}
          onAddNarrower={vi.fn()}
          selectedVersion={mockSelectedVersion}
          selectedScheme={mockSelectedScheme}
        />
      )

      // Wait for the initial render
      await waitFor(() => {
        expect(screen.getByText('Root')).toBeInTheDocument()
      })

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

    test('should handle node click on leaf nodes', async () => {
      getKmsKeywordTree.mockResolvedValue(mockData)

      render(
        <KeywordTree
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
          selectedVersion={mockSelectedVersion}
          selectedScheme={mockSelectedScheme}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Child 1')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Child 1'))
      expect(mockOnNodeClick).toHaveBeenCalledWith('2')
    })

    test('should handle node click on parent nodes', async () => {
      const mockTreeData = [{
        id: '1',
        key: '1',
        title: 'Root',
        children: []
      }]
      getKmsKeywordTree.mockResolvedValue(mockTreeData)

      render(
        <KeywordTree
          onNodeClick={mockOnNodeClick}
          selectedVersion={mockSelectedVersion}
          selectedScheme={mockSelectedScheme}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Root')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Root'))

      await waitFor(() => {
        expect(mockOnNodeClick).toHaveBeenCalledWith('1')
      })
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

      getKmsKeywordTree.mockResolvedValue(nestedData)

      render(
        <KeywordTree
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
          selectedVersion={mockSelectedVersion}
          selectedScheme={mockSelectedScheme}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Root')).toBeInTheDocument()
      })

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
      await waitFor(() => {
        expect(screen.queryByText('Child 1')).not.toBeInTheDocument()
      })

      expect(screen.queryByText('Child 2')).not.toBeInTheDocument()
    })
  })

  describe('when showing context menu', () => {
    test('should display context menu on right-click', async () => {
      const mockTreeData = [{
        id: '1',
        title: 'Root',
        children: []
      }]
      getKmsKeywordTree.mockResolvedValue(mockTreeData)

      render(
        <KeywordTree
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
          selectedVersion={mockSelectedVersion}
          selectedScheme={mockSelectedScheme}
          showContextMenu
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Root')).toBeInTheDocument()
      })

      fireEvent.contextMenu(screen.getByText('Root'))

      expect(screen.getByRole('menu')).toBeInTheDocument()
    })

    test('should not display context menu when showContextMenu is false', async () => {
      const mockTreeData = [{
        id: '1',
        title: 'Root',
        children: []
      }]
      getKmsKeywordTree.mockResolvedValue(mockTreeData)

      render(
        <KeywordTree
          onNodeClick={mockOnNodeClick}
          selectedVersion={mockSelectedVersion}
          selectedScheme={mockSelectedScheme}
          showContextMenu={false}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Root')).toBeInTheDocument()
      })

      fireEvent.contextMenu(screen.getByText('Root'))

      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })

    test('should close context menu when clicking outside', async () => {
      const mockTreeData = [{
        id: '1',
        key: '1',
        title: 'Root',
        children: []
      }]
      getKmsKeywordTree.mockResolvedValue(mockTreeData)

      render(
        <KeywordTree
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
          selectedVersion={mockSelectedVersion}
          selectedScheme={mockSelectedScheme}
          showContextMenu
        />
      )

      // Wait for the tree to render
      await waitFor(() => {
        expect(screen.getByText('Root')).toBeInTheDocument()
      })

      // Open the context menu
      fireEvent.contextMenu(screen.getByText('Root'))

      // Verify that the context menu is open
      expect(screen.getByRole('menu')).toBeInTheDocument()

      // Click outside the context menu
      fireEvent.mouseDown(document.body)

      // Verify that the context menu is closed
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      })
    })
  })

  describe('when adding a narrower', () => {
    test('should open Add Narrower modal when selected from context menu', async () => {
      const mockTreeData = [{
        id: '1',
        title: 'Root',
        children: []
      }]
      getKmsKeywordTree.mockResolvedValue(mockTreeData)

      render(
        <KeywordTree
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
          selectedVersion={mockSelectedVersion}
          selectedScheme={mockSelectedScheme}
          showContextMenu
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Root')).toBeInTheDocument()
      })

      fireEvent.contextMenu(screen.getByText('Root'))
      fireEvent.click(screen.getByText('Add Narrower'))

      expect(screen.getByText('Add Narrower')).toBeInTheDocument()
    })

    test('should call onAddNarrower when adding a new narrower keyword', async () => {
      const mockTreeData = [{
        id: '1',
        title: 'Root',
        children: []
      }]
      getKmsKeywordTree.mockResolvedValue(mockTreeData)

      render(
        <KeywordTree
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
          selectedVersion={mockSelectedVersion}
          selectedScheme={mockSelectedScheme}
          showContextMenu
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Root')).toBeInTheDocument()
      })

      fireEvent.contextMenu(screen.getByText('Root'))
      fireEvent.click(screen.getByText('Add Narrower'))

      const input = screen.getByPlaceholderText('Enter Keyword')
      fireEvent.change(input, { target: { value: 'New Keyword' } })
      fireEvent.click(screen.getByText('Add'))

      expect(mockOnAddNarrower).toHaveBeenCalledWith('1', expect.objectContaining({
        title: 'New Keyword',
        children: []
      }))
    })

    test('should close Add Narrower modal when cancelled', async () => {
      const mockTreeData = [{
        id: '1',
        title: 'Root',
        children: []
      }]
      getKmsKeywordTree.mockResolvedValue(mockTreeData)

      render(
        <KeywordTree
          onNodeClick={mockOnNodeClick}
          onNodeEdit={mockOnNodeEdit}
          onAddNarrower={mockOnAddNarrower}
          selectedVersion={mockSelectedVersion}
          selectedScheme={mockSelectedScheme}
          showContextMenu
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Root')).toBeInTheDocument()
      })

      fireEvent.contextMenu(screen.getByText('Root'))
      fireEvent.click(screen.getByText('Add Narrower'))

      fireEvent.click(screen.getByText('Cancel'))

      await waitFor(() => {
        expect(screen.queryByText('Add Narrower')).not.toBeInTheDocument()
      })
    })
  })

  describe('when expanding tree', () => {
    test('should open all nodes when openAll prop is true', async () => {
      const mockTreeData = [
        {
          id: '1',
          title: 'Root',
          children: [
            {
              id: '2',
              title: 'Parent',
              children: [{
                id: '3',
                title: 'Child',
                children: []
              }]
            }
          ]
        }
      ]
      getKmsKeywordTree.mockResolvedValue(mockTreeData)

      render(
        <KeywordTree
          onNodeClick={mockOnNodeClick}
          selectedVersion={mockSelectedVersion}
          selectedScheme={mockSelectedScheme}
          openAll
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Root')).toBeInTheDocument()
      })

      expect(screen.getByText('Parent')).toBeInTheDocument()
      expect(screen.getByText('Child')).toBeInTheDocument()
    })

    test('should open parents of selected node when selectedNodeId is provided', async () => {
      const mockTreeData = [
        {
          id: '1',
          title: 'Root',
          children: [
            {
              id: '2',
              title: 'Parent',
              children: [{
                id: '3',
                title: 'Child',
                children: []
              }]
            }
          ]
        }
      ]
      getKmsKeywordTree.mockResolvedValue(mockTreeData)

      render(
        <KeywordTree
          onNodeClick={mockOnNodeClick}
          selectedVersion={mockSelectedVersion}
          selectedScheme={mockSelectedScheme}
          selectedNodeId="3"
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Root')).toBeInTheDocument()
      })

      expect(screen.getByText('Parent')).toBeInTheDocument()
      expect(screen.getByText('Child')).toBeInTheDocument()
    })
  })

  describe('when refreshing tree', () => {
    test('should refresh tree when refreshTree is called', async () => {
      const mockTreeData1 = [{
        id: '1',
        key: '1',
        title: 'Root 1',
        children: []
      }]
      const mockTreeData2 = [{
        id: '2',
        key: '2',
        title: 'Root 2',
        children: []
      }]

      getKmsKeywordTree.mockResolvedValueOnce(mockTreeData1)
      getKmsKeywordTree.mockResolvedValueOnce(mockTreeData2)

      const { rerender } = render(
        <KeywordTree
          onNodeClick={mockOnNodeClick}
          selectedVersion={mockSelectedVersion}
          selectedScheme={mockSelectedScheme}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Root 1')).toBeInTheDocument()
      })

      rerender(
        <KeywordTree
          onNodeClick={mockOnNodeClick}
          selectedVersion={
            {
              ...mockSelectedVersion,
              id: 'v2'
            }
          }
          selectedScheme={mockSelectedScheme}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Root 2')).toBeInTheDocument()
      }, { timeout: 3000 })

      expect(screen.queryByText('Root 1')).not.toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    test('should handle empty tree data', async () => {
      getKmsKeywordTree.mockResolvedValue([])

      render(
        <KeywordTree
          onNodeClick={mockOnNodeClick}
          selectedVersion={mockSelectedVersion}
          selectedScheme={mockSelectedScheme}
        />
      )

      await waitFor(() => {
        expect(screen.getByRole('tree')).toBeInTheDocument()
      })

      expect(screen.queryByRole('treeitem')).not.toBeInTheDocument()
    })

    test('should handle very long node titles', async () => {
      const longTitle = 'A'.repeat(100)
      const mockTreeData = [{
        id: '1',
        title: longTitle,
        children: []
      }]
      getKmsKeywordTree.mockResolvedValue(mockTreeData)

      render(
        <KeywordTree
          onNodeClick={mockOnNodeClick}
          selectedVersion={mockSelectedVersion}
          selectedScheme={mockSelectedScheme}
        />
      )

      await waitFor(() => {
        expect(screen.getByText(longTitle)).toBeInTheDocument()
      })
    })
  })
})
