import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import NavigationItemError from '../NavigationItemError'

const setup = (overrideProps = {}) => {
  const props = {
    className: null,
    error: {},
    setFocusField: jest.fn(),
    ...overrideProps
  }

  render(
    <NavigationItemError {...props} />
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('NavigationItemError', () => {
  describe('when the error does not have sub-errors', () => {
    test('displays the error message', () => {
      setup({
        error: {
          message: 'must have required property \'Field Name\'',
          property: '.FieldName',
          visited: false
        }
      })

      expect(screen.getByText('Must have required property \'Field Name\'')).toBeInTheDocument()
    })

    describe('when hovering on the error', () => {
      test('calls setFocusField', async () => {
        const { user } = setup({
          error: {
            message: 'must have required property \'Field Name\'',
            property: '.FieldName',
            visited: false
          }
        })

        const error = screen.getByRole('button')

        await user.hover(error)

        expect(error).toHaveClass('navigation-item-error__item--isFocused')
      })
    })

    describe('when hovering off the error', () => {
      test('calls setFocusField', async () => {
        const { user } = setup({
          error: {
            message: 'must have required property \'Field Name\'',
            property: '.FieldName',
            visited: false
          }
        })

        const error = screen.getByRole('button')

        await user.hover(error)

        expect(error).toHaveClass('navigation-item-error__item--isFocused')

        await user.unhover(error)

        expect(error).not.toHaveClass('navigation-item-error__item--isFocused')
      })
    })

    describe('when clicking on the error', () => {
      test('calls setFocusField', async () => {
        const { props, user } = setup({
          error: {
            message: 'must have required property \'Field Name\'',
            property: '.FieldName',
            visited: false
          }
        })

        const error = screen.getByRole('button')

        await user.click(error)

        expect(props.setFocusField).toHaveBeenCalledTimes(1)
        expect(props.setFocusField).toHaveBeenCalledWith('FieldName')
      })
    })
  })

  describe('when the error has sub-errors', () => {
    test('displays the sub error messages', () => {
      setup({
        error: {
          errors: [{
            message: 'must have required property \'Field Name\'',
            property: '.FieldName',
            visited: false
          }],
          fieldName: 'Mock Field'
        }
      })

      expect(screen.getByRole('button', { name: 'Mock Field' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Must have required property \'Field Name\'' })).toBeInTheDocument()
    })
  })
})
