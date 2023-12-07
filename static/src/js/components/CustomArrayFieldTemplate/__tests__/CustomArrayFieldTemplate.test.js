import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { userEvent } from '@testing-library/user-event'
import CustomArrayFieldTemplate from '../CustomArrayFieldTemplate'

const setup = (overrideProps = {}) => {
  const items = [{
    key: 'mock-key',
    className: 'array-item',
    length: '1',
    children: (
      <span>
        mock child
      </span>
    ),
    onDropIndexClick: jest.fn()
  }]

  const onAddClick = jest.fn()

  const props = {
    items,
    canAdd: true,
    title: 'Array Field Test',
    uiSchema: {},
    schema: {
      description: 'Test Description'
    },
    required: false,
    onAddClick,
    ...overrideProps
  }

  render(
    <BrowserRouter>
      <CustomArrayFieldTemplate {...props} />
    </BrowserRouter>
  )

  return {
    props,
    user: userEvent.setup()
  }
}

jest.useFakeTimers()

describe('CustomArrayFieldTemplate', () => {
  describe('When a array field given', () => {
    test('renders the children', () => {
      setup({
        required: true
      })

      expect(screen.queryByRole('heading')).toHaveTextContent('Array Field Test')
      expect(screen.getByText('mock child')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
    })
  })

  describe('When a array field is required', () => {
    test('renders the required icon', () => {
      setup({
        required: true
      })

      expect(screen.queryByRole('heading')).toHaveTextContent('Array Field Test')
      expect(screen.getByText('mock child')).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Required' })).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
    })
  })

  describe('When no items in the array are added', () => {
    test('renders only a add button', () => {
      setup({
        items: []
      })

      expect(screen.queryByTitle('mock child')).toBeNull()
    })
  })

  describe('When adding another array item', () => {
    test('adds another array field', async () => {
      const { props } = setup()

      const addButton = screen.getAllByRole('button')[1]

      await waitFor(async () => {
        addButton.click()
      })

      jest.runAllTimers()

      expect(props.onAddClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('When removing a array item', () => {
    test('removes a array field', async () => {
      const { props } = setup()

      const addButton = screen.getAllByRole('button')[0]

      await waitFor(async () => {
        addButton.click()
      })

      expect(props.items[0].onDropIndexClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('When an array item can not be added', () => {
    test('renders no add button', async () => {
      setup({
        uiSchema: {
          'ui:canAdd': false
        }
      })

      expect(screen.queryByTitle('Add Another')).toBeNull()
    })
  })

  describe('When custom title provided', () => {
    test('renders the custom title', async () => {
      setup({
        uiSchema: {
          'ui:title': 'New Custom Title'
        }
      })

      expect(screen.queryByRole('heading')).toHaveTextContent('New Custom Title')
    })
  })

  describe('When a header is hidden', () => {
    test('renders no header', async () => {
      setup({
        uiSchema: {
          'ui:hide-header': true
        }
      })

      expect(screen.queryByTitle('Array Field Test')).toBeNull()
    })
  })
})
