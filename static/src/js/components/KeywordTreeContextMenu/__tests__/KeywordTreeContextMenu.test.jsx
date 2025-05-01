import React from 'react'
import {
  render,
  fireEvent,
  screen
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  describe,
  test,
  expect,
  vi
} from 'vitest'
import { KeywordTreeContextMenu } from '../KeywordTreeContextMenu'

describe('KeywordTreeContextMenu', () => {
  const mockOptions = [
    {
      id: 'edit',
      label: 'Edit',
      action: vi.fn()
    },
    {
      id: 'delete',
      label: 'Delete',
      action: vi.fn()
    }
  ]

  const mockOnClose = vi.fn()
  const mockRef = { current: null }

  const renderComponent = () => render(
    <KeywordTreeContextMenu
      x={100}
      y={100}
      onClose={mockOnClose}
      options={mockOptions}
      forwardedRef={mockRef}
    />
  )

  test('renders the context menu with correct options', () => {
    renderComponent()
    expect(screen.getByText('Edit')).toBeDefined()
    expect(screen.getByText('Delete')).toBeDefined()
  })

  test('positions the context menu correctly', () => {
    renderComponent()
    const menu = screen.getByRole('menu')
    expect(menu.style.top).toBe('100px')
    expect(menu.style.left).toBe('100px')
  })

  test('calls action and onClose when an option is clicked', () => {
    renderComponent()
    fireEvent.click(screen.getByText('Edit'))
    expect(mockOptions[0].action).toHaveBeenCalled()
    expect(mockOnClose).toHaveBeenCalled()
  })

  test('handles keyboard navigation', () => {
    renderComponent()
    const menu = screen.getByRole('menu')

    // Focus the menu
    fireEvent.focus(menu)

    // Press arrow down
    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    expect(screen.getByText('Edit').classList.contains('focused')).toBe(true)

    // Press arrow down again
    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    expect(screen.getByText('Delete').classList.contains('focused')).toBe(true)

    // Press arrow up
    fireEvent.keyDown(menu, { key: 'ArrowUp' })
    expect(screen.getByText('Edit').classList.contains('focused')).toBe(true)
  })

  test('selects option with Enter key', () => {
    renderComponent()
    const menu = screen.getByRole('menu')

    fireEvent.focus(menu)
    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    fireEvent.keyDown(menu, { key: 'Enter' })

    expect(mockOptions[0].action).toHaveBeenCalled()
    expect(mockOnClose).toHaveBeenCalled()
  })

  test('closes menu with Escape key', () => {
    renderComponent()
    const menu = screen.getByRole('menu')

    fireEvent.keyDown(menu, { key: 'Escape' })
    expect(mockOnClose).toHaveBeenCalled()
  })

  test('selects option with Enter or Space key on individual menu item', async () => {
    const user = userEvent.setup()

    const mockPreventDefault = vi.fn()
    const originalPreventDefault = Event.prototype.preventDefault
    Event.prototype.preventDefault = mockPreventDefault

    renderComponent()
    const editOption = screen.getByText('Edit')

    // Test Enter key
    await user.type(editOption, '{Enter}')

    expect(mockPreventDefault).toHaveBeenCalled()
    expect(mockOptions[0].action).toHaveBeenCalled()
    expect(mockOnClose).toHaveBeenCalled()

    // Reset mocks
    mockPreventDefault.mockClear()
    mockOptions[0].action.mockClear()
    mockOnClose.mockClear()

    // Test Space key
    await user.type(editOption, ' ')

    expect(mockPreventDefault).toHaveBeenCalled()
    expect(mockOptions[0].action).toHaveBeenCalled()
    expect(mockOnClose).toHaveBeenCalled()

    // Restore original preventDefault
    Event.prototype.preventDefault = originalPreventDefault
  })

  test('resets hovered state on mouse leave', () => {
    render(
      <KeywordTreeContextMenu
        x={100}
        y={100}
        onClose={mockOnClose}
        options={mockOptions}
        forwardedRef={mockRef}
      />
    )

    const menuContainer = screen.getByRole('menu')
    const editOption = screen.getByText('Edit')

    // Simulate mouse enter on an option
    fireEvent.mouseEnter(editOption)
    expect(editOption).toHaveClass('hovered')

    // Simulate mouse leave on the entire menu
    fireEvent.mouseLeave(menuContainer)

    // Check that the hovered class is removed
    expect(editOption).not.toHaveClass('hovered')
  })

  test('does not change state for unhandled keys', () => {
    render(
      <KeywordTreeContextMenu
        x={100}
        y={100}
        onClose={mockOnClose}
        options={mockOptions}
        forwardedRef={mockRef}
      />
    )

    const menuContainer = screen.getByRole('menu')

    // Spy on console.log to check if any unexpected logging occurs
    const consoleSpy = vi.spyOn(console, 'log')

    // Trigger an unhandled key event
    fireEvent.keyDown(menuContainer, { key: 'A' })

    // Verify that onClose was not called
    expect(mockOnClose).not.toHaveBeenCalled()

    // Verify that no options were activated
    mockOptions.forEach((option) => {
      expect(option.action).not.toHaveBeenCalled()
    })

    // Verify that no unexpected console logs occurred
    expect(consoleSpy).not.toHaveBeenCalled()

    // Clean up the spy
    consoleSpy.mockRestore()
  })
})
