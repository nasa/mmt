import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useAccessibleEvent from '../useAccessibleEvent'

afterEach(() => {
  jest.clearAllMocks()
})

const TestComponent = ({
  // eslint-disable-next-line react/prop-types
  callback
}) => {
  const accessibleEventProps = useAccessibleEvent((event) => {
    event.preventDefault()
    callback()
  })

  return (
    <div
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...accessibleEventProps}
    >
      Test Button
    </div>
  )
}

describe('useAccessibleEvent', () => {
  describe('when the button is clicked', () => {
    test('calls the callback function', async () => {
      const mockCallback = jest.fn()

      render(
        <TestComponent
          callback={mockCallback}
        />
      )

      const button = screen.getByText('Test Button')
      await userEvent.click(button)

      expect(mockCallback).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the enter key is pressed', () => {
    test('calls the callback function', async () => {
      const mockCallback = jest.fn()

      render(
        <TestComponent
          callback={mockCallback}
        />
      )

      screen.getByText('Test Button').focus()
      await userEvent.keyboard('{Enter}')

      expect(mockCallback).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the spacebar is pressed', () => {
    test('calls the callback function', async () => {
      const mockCallback = jest.fn()

      render(
        <TestComponent
          callback={mockCallback}
        />
      )

      screen.getByText('Test Button').focus()
      await userEvent.keyboard(' ')

      expect(mockCallback).toHaveBeenCalledTimes(1)
    })
  })
})
