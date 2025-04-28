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

  describe('Rendering', () => {
    test('renders without crashing', () => {
      render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)
      expect(screen.getByText('Root')).toBeInTheDocument()
    })

    test('renders child nodes', () => {
      render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)
      expect(screen.getByText('Child 1')).toBeInTheDocument()
      expect(screen.getByText('Child 2')).toBeInTheDocument()
    })

    test('handles empty data', () => {
      render(
        <KeywordTree
          data={[]}
          onNodeDoubleClick={() => {}}
          onNodeEdit={() => {}}
        />
      )

      expect(screen.getByRole('tree')).toBeInTheDocument()
    })
  })

  describe('Node Interaction', () => {
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

      render(
        <KeywordTree
          data={nestedMockData}
          onNodeDoubleClick={() => {}}
          onNodeEdit={() => {}}
        />
      )

      expect(screen.queryByText('Grandchild')).not.toBeInTheDocument()

      const child1Item = screen.getByRole('treeitem', { name: /child 1/i })
      const toggleButton = within(child1Item).getByRole('button')
      fireEvent.click(toggleButton)

      const grandchild = await screen.findByText('Grandchild')
      expect(grandchild).toBeInTheDocument()

      fireEvent.click(toggleButton)

      await waitFor(() => {
        expect(screen.queryByText('Grandchild')).not.toBeInTheDocument()
      })
    })

    test('node changes background color on hover', async () => {
      render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

      const node = screen.getByText('Child 1')

      expect(node).toHaveStyle('background-color: rgba(0, 0, 0, 0)')

      fireEvent.mouseEnter(node)
      expect(node).toHaveStyle('background-color: #cce5ff')

      fireEvent.mouseLeave(node)
      expect(node).toHaveStyle('background-color: rgba(0, 0, 0, 0)')
    })
  })

  describe('Context Menu', () => {
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

    test('closes context menu when clicking outside', () => {
      render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

      fireEvent.contextMenu(screen.getByText('Child 1'))
      expect(screen.getByText('Edit')).toBeInTheDocument()

      fireEvent.mouseDown(document.body)

      expect(screen.queryByText('Edit')).not.toBeInTheDocument()
    })

    test('resets hovered index when mouse leaves context menu', async () => {
      render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

      fireEvent.contextMenu(screen.getByText('Child 1'))

      const editOption = screen.getByText('Edit')
      fireEvent.mouseEnter(editOption)

      expect(editOption).toHaveClass('hovered')

      const contextMenu = screen.getByRole('menu')
      fireEvent.mouseLeave(contextMenu)

      await waitFor(() => {
        expect(editOption).not.toHaveClass('hovered')
      })
    })
  })

  describe('Keyboard Navigation', () => {
    test('supports keyboard navigation in context menu', () => {
      render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

      fireEvent.contextMenu(screen.getByText('Child 1'))

      const editButton = screen.getByText('Edit')
      editButton.focus()

      fireEvent.keyDown(editButton, {
        key: 'Enter',
        code: 'Enter'
      })

      expect(screen.queryByText('Edit')).not.toBeInTheDocument()
    })

    test('handles ArrowDown key in context menu', () => {
      render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

      fireEvent.contextMenu(screen.getByText('Child 1'))

      const contextMenu = screen.getByRole('menu')
      const editOption = screen.getByText('Edit')
      const addOption = screen.getByText('Add Narrower')
      const deleteOption = screen.getByText('Delete')

      contextMenu.focus()

      fireEvent.keyDown(contextMenu, {
        key: 'ArrowDown',
        code: 'ArrowDown'
      })

      expect(editOption).toHaveClass('focused')

      fireEvent.keyDown(contextMenu, {
        key: 'ArrowDown',
        code: 'ArrowDown'
      })

      expect(addOption).toHaveClass('focused')

      fireEvent.keyDown(contextMenu, {
        key: 'ArrowDown',
        code: 'ArrowDown'
      })

      expect(deleteOption).toHaveClass('focused')

      fireEvent.keyDown(contextMenu, {
        key: 'ArrowDown',
        code: 'ArrowDown'
      })

      expect(editOption).toHaveClass('focused')
    })

    test('handles ArrowUp key in context menu', () => {
      render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

      fireEvent.contextMenu(screen.getByText('Child 1'))

      const contextMenu = screen.getByRole('menu')
      const editOption = screen.getByText('Edit')
      const addOption = screen.getByText('Add Narrower')
      const deleteOption = screen.getByText('Delete')

      contextMenu.focus()

      fireEvent.keyDown(contextMenu, {
        key: 'ArrowUp',
        code: 'ArrowUp'
      })

      expect(deleteOption).toHaveClass('focused')

      fireEvent.keyDown(contextMenu, {
        key: 'ArrowUp',
        code: 'ArrowUp'
      })

      expect(addOption).toHaveClass('focused')

      fireEvent.keyDown(contextMenu, {
        key: 'ArrowUp',
        code: 'ArrowUp'
      })

      expect(editOption).toHaveClass('focused')

      fireEvent.keyDown(contextMenu, {
        key: 'ArrowUp',
        code: 'ArrowUp'
      })

      expect(deleteOption).toHaveClass('focused')
    })

    test('calls action and closes context menu when Enter is pressed on focused item', () => {
      const onNodeEdit = vi.fn()
      render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={onNodeEdit} />)

      fireEvent.contextMenu(screen.getByText('Child 1'))

      const contextMenu = screen.getByRole('menu')
      contextMenu.focus()

      fireEvent.keyDown(contextMenu, {
        key: 'ArrowDown',
        code: 'ArrowDown'
      })

      fireEvent.keyDown(contextMenu, {
        key: 'Enter',
        code: 'Enter'
      })

      expect(onNodeEdit).toHaveBeenCalledWith(child1Uuid)
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })

    test('closes context menu when Escape is pressed and does nothing for other keys', () => {
      render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

      fireEvent.contextMenu(screen.getByText('Child 1'))

      const contextMenu = screen.getByRole('menu')
      expect(contextMenu).toBeInTheDocument()

      fireEvent.keyDown(contextMenu, {
        key: 'Escape',
        code: 'Escape'
      })

      expect(screen.queryByRole('menu')).not.toBeInTheDocument()

      fireEvent.contextMenu(screen.getByText('Child 1'))
      const newContextMenu = screen.getByRole('menu')

      fireEvent.keyDown(newContextMenu, {
        key: 'a',
        code: 'KeyA'
      })

      expect(newContextMenu).toBeInTheDocument()
    })
  })

  describe('Adding Child Nodes', () => {
    test('handles add child cancellation', async () => {
      render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

      fireEvent.contextMenu(screen.getByText('Child 1'))
      fireEvent.click(screen.getByText('Add Narrower'))

      expect(screen.getByText('Add Narrower')).toBeInTheDocument()

      fireEvent.click(screen.getByText('Cancel'))

      await waitFor(() => {
        expect(screen.queryByText('Add Narrower')).not.toBeInTheDocument()
      })
    })

    test('handles cancelling add new child', async () => {
      const user = userEvent.setup()

      render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

      fireEvent.contextMenu(screen.getByText('Child 1'))
      await user.click(screen.getByText('Add Narrower'))

      expect(screen.getByText('Add Narrower')).toBeInTheDocument()

      await user.type(screen.getByPlaceholderText('Enter Keyword'), 'Cancelled Child')
      await user.click(screen.getByRole('button', { name: 'Cancel' }))

      expect(screen.queryByText('Add Narrower')).not.toBeInTheDocument()
      expect(screen.queryByText('Cancelled Child')).not.toBeInTheDocument()
    })

    test('prevents adding empty keyword', async () => {
      const user = userEvent.setup()

      render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

      fireEvent.contextMenu(screen.getByText('Child 1'))
      await user.click(screen.getByText('Add Narrower'))

      expect(screen.getByText('Add Narrower')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Add' }))

      expect(screen.getByText('Add Narrower')).toBeInTheDocument()

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

      fireEvent.contextMenu(screen.getByText('Child 1'))
      await user.click(screen.getByText('Add Narrower'))

      expect(screen.getByText('Add Narrower')).toBeInTheDocument()

      await user.type(screen.getByPlaceholderText('Enter Keyword'), 'New Child')
      await user.click(screen.getByRole('button', { name: 'Add' }))

      await waitFor(() => {
        expect(screen.queryByText('Add Narrower')).not.toBeInTheDocument()
      })

      await waitFor(() => {})

      rerender(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

      const treeItem = within(screen.getByRole('tree')).getByRole('treeitem', { name: /Child 1/i })
      const possibleExpandButtons = within(treeItem).queryAllByRole('button')
      const possibleExpandButton = possibleExpandButtons.length > 0
        ? possibleExpandButtons[0]
        : null

      if (possibleExpandButton) {
        await user.click(possibleExpandButton)
      }

      await waitFor(() => {
        const newChildNode = screen.getByText('New Child')
        expect(newChildNode).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    test('handles adding child to a parent with leaf sibling nodes', async () => {
      const user = userEvent.setup()

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
            children: undefined
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

      fireEvent.contextMenu(screen.getByText('Parent'))
      await user.click(screen.getByText('Add Narrower'))

      expect(screen.getByText('Add Narrower')).toBeInTheDocument()

      await user.type(screen.getByPlaceholderText('Enter Keyword'), 'New Child')
      await user.click(screen.getByRole('button', { name: 'Add' }))

      await waitFor(() => {
        expect(screen.queryByText('Add Narrower')).not.toBeInTheDocument()
      })

      await waitFor(() => {})

      rerender(
        <KeywordTree
          data={mockDataWithLeaf}
          onNodeDoubleClick={() => {}}
          onNodeEdit={() => {}}
        />
      )

      const parentNodeContainer = screen.getByRole('treeitem', { name: /Parent/i })
      const toggleButton = within(parentNodeContainer).getByRole('button')
      await user.click(toggleButton)

      await waitFor(() => {
        expect(screen.getByText('New Child')).toBeInTheDocument()
      })

      expect(screen.getByText('Leaf')).toBeInTheDocument()
    })

    test('shows and hides add child modal', async () => {
      const user = userEvent.setup()

      render(<KeywordTree data={mockData} onNodeDoubleClick={() => {}} onNodeEdit={() => {}} />)

      expect(screen.queryByText('Add Narrower')).not.toBeInTheDocument()

      fireEvent.contextMenu(screen.getByText('Child 1'))
      await user.click(screen.getByText('Add Narrower'))

      expect(screen.getByText('Add Narrower')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Cancel' }))

      await waitFor(() => {
        expect(screen.queryByText('Add Narrower')).not.toBeInTheDocument()
      })
    })
  })
})
