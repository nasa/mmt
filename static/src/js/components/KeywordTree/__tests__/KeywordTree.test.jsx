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
import { v4 as uuidv4 } from 'uuid'
import userEvent from '@testing-library/user-event'
import KeywordTree from '../KeywordTree'

vi.mock('uuid', () => ({
  v4: vi.fn()
}))

vi.mock('uuid', () => ({
  v4: vi.fn()
}))

describe('KeywordTree', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const rootUuid = 'root-uuid'
  const child1Uuid = 'child1-uuid'
  const child2Uuid = 'child2-uuid'

  const mockData = {
    id: rootUuid,
    key: rootUuid,
    title: 'Root',
    children: [
      {
        id: child1Uuid,
        key: child1Uuid,
        title: 'Child 1',
        children: []
      },
      {
        id: child2Uuid,
        key: child2Uuid,
        title: 'Child 2',
        children: []
      }
    ]
  }

  test('renders without crashing', () => {
    render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)
    expect(screen.getByText('Root')).toBeInTheDocument()
  })

  test('renders child nodes', () => {
    render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
  })

  test('calls onNodeDoubleClick when a node is double-clicked', () => {
    const onNodeDoubleClick = vi.fn()
    render(
      <KeywordTree
        data={mockData}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodeEdit={() => {}}
      />
    )

    fireEvent.doubleClick(screen.getByText('Child 1'))
    expect(onNodeDoubleClick).toHaveBeenCalledWith(child1Uuid)
  })

  test('opens context menu on right-click', () => {
    render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

    fireEvent.contextMenu(screen.getByText('Child 1'))
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Add Narrower')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  test('deletes a node', () => {
    render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

    fireEvent.contextMenu(screen.getByText('Child 1'))
    fireEvent.click(screen.getByText('Delete'))

    expect(screen.queryByText('Child 1')).not.toBeInTheDocument()
  })

  test('calls onNodeEdit when edit is selected from context menu', () => {
    const onNodeEdit = vi.fn()
    render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={onNodeEdit} />)

    fireEvent.contextMenu(screen.getByText('Child 1'))
    fireEvent.click(screen.getByText('Edit'))

    expect(onNodeEdit).toHaveBeenCalledWith(child1Uuid)
  })

  test('toggles node expansion', async () => {
    const grandchildUuid = 'grandchild-uuid'
    const nestedMockData = {
      ...mockData,
      children: [
        {
          id: child1Uuid,
          key: child1Uuid,
          title: 'Child 1',
          children: [
            {
              id: grandchildUuid,
              key: grandchildUuid,
              title: 'Grandchild',
              children: []
            }
          ]
        }
      ]
    }

    render(<KeywordTree data={nestedMockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

    // Initially, the grandchild should not be visible
    expect(screen.queryByText('Grandchild')).not.toBeInTheDocument()

    // Find and click the toggle button for 'Child 1'
    const child1Item = screen.getByRole('treeitem', { name: /child 1/i })
    const toggleButton = within(child1Item).getByRole('button')
    fireEvent.click(toggleButton)

    // Wait for the grandchild to appear
    const grandchild = await screen.findByText('Grandchild')
    expect(grandchild).toBeInTheDocument()

    // Click the toggle button again
    fireEvent.click(toggleButton)

    // The grandchild should be hidden again
    await waitFor(() => {
      expect(screen.queryByText('Grandchild')).not.toBeInTheDocument()
    })
  })

  test('closes context menu when clicking outside', () => {
    render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

    fireEvent.contextMenu(screen.getByText('Child 1'))
    expect(screen.getByText('Edit')).toBeInTheDocument()

    // Click outside the context menu
    fireEvent.mouseDown(document.body)

    // Context menu should be closed
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
  })

  test('handles empty data', () => {
    render(
      <KeywordTree
        data={[]}
        onNodeDoubleClick={() => {}}
        onNodeEdit={() => {}}
      />
    )

    // The component should render without crashing
    expect(screen.getByRole('tree')).toBeInTheDocument()
  })

  test('supports keyboard navigation in context menu', () => {
    render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

    fireEvent.contextMenu(screen.getByText('Child 1'))

    const editButton = screen.getByText('Edit')
    editButton.focus()

    // Simulate pressing Enter key
    fireEvent.keyDown(editButton, {
      key: 'Enter',
      code: 'Enter'
    })

    // Context menu should be closed after selection
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
  })

  test('handles add child cancellation', async () => {
    render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

    fireEvent.contextMenu(screen.getByText('Child 1'))
    fireEvent.click(screen.getByText('Add Narrower'))

    // Modal should be open
    expect(screen.getByText('Add Narrower')).toBeInTheDocument()

    // Click Cancel
    fireEvent.click(screen.getByText('Cancel'))

    // Wait for the modal to close
    await waitFor(() => {
      expect(screen.queryByText('Add Narrower')).not.toBeInTheDocument()
    })
  })

  test('resets hovered index when mouse leaves context menu', async () => {
    render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

    // Open context menu
    fireEvent.contextMenu(screen.getByText('Child 1'))

    // Hover over an option
    const editOption = screen.getByText('Edit')
    fireEvent.mouseEnter(editOption)

    // Check that the option has the 'hovered' class
    expect(editOption).toHaveClass('hovered')

    // Move mouse out of the context menu
    const contextMenu = screen.getByRole('menu')
    fireEvent.mouseLeave(contextMenu)

    // Wait for any asynchronous updates
    await waitFor(() => {
      expect(editOption).not.toHaveClass('hovered')
    })
  })

  test('handles ArrowDown key in context menu', () => {
    render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

    fireEvent.contextMenu(screen.getByText('Child 1'))

    const contextMenu = screen.getByRole('menu')
    const editOption = screen.getByText('Edit')
    const addOption = screen.getByText('Add Narrower')
    const deleteOption = screen.getByText('Delete')

    contextMenu.focus()

    // Press ArrowDown
    fireEvent.keyDown(contextMenu, {
      key: 'ArrowDown',
      code: 'ArrowDown'
    })

    expect(editOption).toHaveClass('focused')
    expect(addOption).not.toHaveClass('focused')
    expect(deleteOption).not.toHaveClass('focused')

    // Press ArrowDown again
    fireEvent.keyDown(contextMenu, {
      key: 'ArrowDown',
      code: 'ArrowDown'
    })

    expect(editOption).not.toHaveClass('focused')
    expect(addOption).toHaveClass('focused')
    expect(deleteOption).not.toHaveClass('focused')

    // Press ArrowDown on the last item
    fireEvent.keyDown(contextMenu, {
      key: 'ArrowDown',
      code: 'ArrowDown'
    })

    expect(editOption).not.toHaveClass('focused')
    expect(addOption).not.toHaveClass('focused')
    expect(deleteOption).toHaveClass('focused')

    // Press ArrowDown again to wrap to the first item
    fireEvent.keyDown(contextMenu, {
      key: 'ArrowDown',
      code: 'ArrowDown'
    })

    expect(editOption).toHaveClass('focused')
    expect(addOption).not.toHaveClass('focused')
    expect(deleteOption).not.toHaveClass('focused')
  })

  test('handles ArrowUp key in context menu', () => {
    render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

    fireEvent.contextMenu(screen.getByText('Child 1'))

    const contextMenu = screen.getByRole('menu')
    const editOption = screen.getByText('Edit')
    const addOption = screen.getByText('Add Narrower')
    const deleteOption = screen.getByText('Delete')

    contextMenu.focus()

    // Press ArrowUp (should highlight the last item)
    fireEvent.keyDown(contextMenu, {
      key: 'ArrowUp',
      code: 'ArrowUp'
    })

    expect(editOption).not.toHaveClass('focused')
    expect(addOption).not.toHaveClass('focused')
    expect(deleteOption).toHaveClass('focused')

    // Press ArrowUp again
    fireEvent.keyDown(contextMenu, {
      key: 'ArrowUp',
      code: 'ArrowUp'
    })

    expect(editOption).not.toHaveClass('focused')
    expect(addOption).toHaveClass('focused')
    expect(deleteOption).not.toHaveClass('focused')

    // Press ArrowUp to wrap to the last item
    fireEvent.keyDown(contextMenu, {
      key: 'ArrowUp',
      code: 'ArrowUp'
    })

    expect(editOption).toHaveClass('focused')
    expect(addOption).not.toHaveClass('focused')
    expect(deleteOption).not.toHaveClass('focused')

    // Press ArrowUp again to wrap to the last item
    fireEvent.keyDown(contextMenu, {
      key: 'ArrowUp',
      code: 'ArrowUp'
    })

    expect(editOption).not.toHaveClass('focused')
    expect(addOption).not.toHaveClass('focused')
    expect(deleteOption).toHaveClass('focused')
  })

  test('calls action and closes context menu when Enter is pressed on focused item', () => {
    const onNodeEdit = vi.fn()
    render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={onNodeEdit} />)

    // Open context menu
    fireEvent.contextMenu(screen.getByText('Child 1'))

    const contextMenu = screen.getByRole('menu')

    // Focus the context menu
    contextMenu.focus()

    // Press ArrowDown to focus on the first item (Edit)
    fireEvent.keyDown(contextMenu, {
      key: 'ArrowDown',
      code: 'ArrowDown'
    })

    // Press Enter to select the focused item
    fireEvent.keyDown(contextMenu, {
      key: 'Enter',
      code: 'Enter'
    })

    // Check if the action was called
    expect(onNodeEdit).toHaveBeenCalledWith(child1Uuid)

    // Check if the context menu was closed
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  test('closes context menu when Escape is pressed and does nothing for other keys', () => {
    render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

    // Open context menu
    fireEvent.contextMenu(screen.getByText('Child 1'))

    const contextMenu = screen.getByRole('menu')

    // Verify context menu is open
    expect(contextMenu).toBeInTheDocument()

    // Press Escape key
    fireEvent.keyDown(contextMenu, {
      key: 'Escape',
      code: 'Escape'
    })

    // Check if the context menu was closed
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    // Open context menu again
    fireEvent.contextMenu(screen.getByText('Child 1'))

    const newContextMenu = screen.getByRole('menu')

    // Press an unhandled key
    fireEvent.keyDown(newContextMenu, {
      key: 'a',
      code: 'KeyA'
    })

    // Check if the context menu is still open (default case)
    expect(newContextMenu).toBeInTheDocument()
  })

  test('node changes background color on hover', async () => {
    render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

    const node = screen.getByText('Child 1')

    // Check initial background color
    expect(node).toHaveStyle('background-color: rgba(0, 0, 0, 0)')

    // Simulate mouse enter
    fireEvent.mouseEnter(node)

    // Check background color after hover
    expect(node).toHaveStyle('background-color: #cce5ff')

    // Simulate mouse leave
    fireEvent.mouseLeave(node)

    // Check background color after mouse leave
    expect(node).toHaveStyle('background-color: rgba(0, 0, 0, 0)')
  })

  test('handles cancelling add new child', async () => {
    const user = userEvent.setup()

    render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

    // Open context menu for 'Child 1'
    fireEvent.contextMenu(screen.getByText('Child 1'))

    // Click 'Add' in the context menu
    await user.click(screen.getByText('Add Narrower'))

    // Check if the modal is open
    expect(screen.getByText('Add Narrower')).toBeInTheDocument()

    // Type new keyword
    await user.type(screen.getByPlaceholderText('Enter Keyword'), 'Cancelled Child')

    // Click 'Cancel' button
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    // Check if the modal is closed
    expect(screen.queryByText('Add Narrower')).not.toBeInTheDocument()

    // Check that the new child was not added
    expect(screen.queryByText('Cancelled Child')).not.toBeInTheDocument()
  })

  test('prevents adding empty keyword', async () => {
    const user = userEvent.setup()

    render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

    // Open context menu for 'Child 1'
    fireEvent.contextMenu(screen.getByText('Child 1'))

    // Click 'Add' in the context menu
    await user.click(screen.getByText('Add Narrower'))

    // Check if the modal is open
    expect(screen.getByText('Add Narrower')).toBeInTheDocument()

    // Don't type anything (leave input empty)

    // Click 'Add' button
    await user.click(screen.getByRole('button', { name: 'Add' }))

    // Check that the modal is still open (add was not performed)
    expect(screen.getByText('Add Narrower')).toBeInTheDocument()

    // Close the modal
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
  })

  test('adds new child node', async () => {
    const user = userEvent.setup()
    const newChildUuid = 'new-child-uuid'
    uuidv4.mockReturnValue(newChildUuid)

    const { rerender } = render(
      <KeywordTree
        data={mockData}
        onNodeDoubleClick={() => {}}
        onNodeEdit={() => {}}
      />
    )

    // Open context menu for 'Child 1'
    fireEvent.contextMenu(screen.getByText('Child 1'))

    // Click 'Add' in the context menu
    await user.click(screen.getByText('Add Narrower'))

    // Check if the modal is open
    expect(screen.getByText('Add Narrower')).toBeInTheDocument()

    // Type new keyword
    await user.type(screen.getByPlaceholderText('Enter Keyword'), 'New Child')

    // Click 'Add' button
    await user.click(screen.getByRole('button', { name: 'Add' }))

    // Check if the modal is closed
    await waitFor(() => {
      expect(screen.queryByText('Add Narrower')).not.toBeInTheDocument()
    })

    // Wait for any asynchronous updates
    await waitFor(() => {})

    // Force a re-render with the updated data
    rerender(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

    // Find the tree item containing 'Child 1'
    const treeItem = within(screen.getByRole('tree')).getByRole('treeitem', { name: /Child 1/i })

    // Check if there's any clickable element within this tree item
    const possibleExpandButtons = within(treeItem).queryAllByRole('button')

    // Find the first button that might be used for expanding (usually the first button in the tree item)
    const possibleExpandButton = possibleExpandButtons.length > 0 ? possibleExpandButtons[0] : null

    // If there's a clickable element, click it to potentially expand 'Child 1'
    if (possibleExpandButton) {
      await user.click(possibleExpandButton)
    }

    // Check that the new child is visible
    await waitFor(() => {
      const newChildNode = screen.getByText('New Child')
      expect(newChildNode).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  test('handles adding child to a parent with leaf sibling nodes', async () => {
    const user = userEvent.setup()

    // Create a mock data structure with a leaf node
    const mockDataWithLeaf = {
      id: 'root',
      key: 'root',
      title: 'Root',
      children: [
        {
          id: 'parent',
          key: 'parent',
          title: 'Parent',
          children: []
        },
        {
          id: 'leaf',
          key: 'leaf',
          title: 'Leaf',
          children: undefined // This is a leaf node
        }
      ]
    }

    const { rerender } = render(
      <KeywordTree
        data={mockDataWithLeaf}
        onNodeDoubleClick={() => {}}
        onNodeEdit={() => {}}
      />
    )

    // Open context menu for 'Parent'
    fireEvent.contextMenu(screen.getByText('Parent'))

    // Click 'Add Narrower' in the context menu
    await user.click(screen.getByText('Add Narrower'))

    // Check if the modal is open
    expect(screen.getByText('Add Narrower')).toBeInTheDocument()

    // Type new keyword
    await user.type(screen.getByPlaceholderText('Enter Keyword'), 'New Child')

    // Click 'Add' button
    await user.click(screen.getByRole('button', { name: 'Add' }))

    // Check if the modal is closed
    await waitFor(() => {
      expect(screen.queryByText('Add Narrower')).not.toBeInTheDocument()
    })

    // Wait for any asynchronous updates
    await waitFor(() => {})

    // Force a re-render with the updated data
    rerender(
      <KeywordTree
        data={mockDataWithLeaf}
        onNodeDoubleClick={() => {}}
        onNodeEdit={() => {}}
      />
    )

    // Find the 'Parent' node container
    const parentNodeContainer = screen.getByRole('treeitem', { name: /Parent/i })

    // Find the toggle button for 'Parent' node
    const toggleButton = within(parentNodeContainer).getByRole('button')

    // Click the toggle button to expand 'Parent' node
    await user.click(toggleButton)

    // Now check that the new child was added to 'Parent'
    await waitFor(() => {
      expect(screen.getByText('New Child')).toBeInTheDocument()
    })

    // Check that 'Leaf' node still exists and wasn't modified
    expect(screen.getByText('Leaf')).toBeInTheDocument()
  })

  test('shows and hides add child modal', async () => {
    const user = userEvent.setup()

    render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

    // Initially, the modal should not be in the document
    expect(screen.queryByText('Add Narrower')).not.toBeInTheDocument()

    // Open context menu for 'Child 1'
    fireEvent.contextMenu(screen.getByText('Child 1'))

    // Click 'Add Narrower' in the context menu
    await user.click(screen.getByText('Add Narrower'))

    // Check if the modal is open
    expect(screen.getByText('Add Narrower')).toBeInTheDocument()

    // Close the modal
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    // Check if the modal is closed
    await waitFor(() => {
      expect(screen.queryByText('Add Narrower')).not.toBeInTheDocument()
    })
  })
})
