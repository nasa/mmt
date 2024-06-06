import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomArrayFieldTemplate from '../CustomArrayFieldTemplate'

const setup = (overrideProps = {}) => {
  const items = [{
    children: (
      <span>
        mock child
      </span>
    ),
    className: 'array-item',
    key: 'mock-key',
    length: '1',
    onDropIndexClick: vi.fn(() => vi.fn())
  }]

  const props = {
    canAdd: true,
    items,
    onAddClick: vi.fn(),
    required: false,
    schema: {
      description: 'Test Description'
    },
    title: 'Array Field Test',
    uiSchema: {
      'ui:heading-level': 'h3'
    },
    ...overrideProps
  }

  const user = userEvent.setup()

  render(
    <CustomArrayFieldTemplate {...props} />
  )

  return {
    props,
    user
  }
}

describe('CustomArrayFieldTemplate', () => {
  describe('When a array field given', () => {
    test('renders the children', () => {
      setup()

      expect(screen.getByRole('heading')).toHaveTextContent('Array Field Test')
      expect(screen.getByText('mock child')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
    })
  })

  describe('When a array field is required', () => {
    test('renders the required icon', () => {
      setup({
        required: true
      })

      expect(screen.getByRole('heading')).toHaveTextContent('Array Field Test')
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
      const { props, user } = setup()

      const addButton = screen.getByRole('button', { name: 'Plus icon in a circle Add Another Array Field Test' })

      await user.click(addButton)

      expect(props.onAddClick).toHaveBeenCalledTimes(1)

      expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledTimes(1)
      expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    })
  })

  describe('When removing a array item', () => {
    test('removes a array field', async () => {
      const { props, user } = setup()

      const remove = screen.getByRole('button', { name: 'Minus icon in a circle Remove' })

      await user.click(remove)

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

      expect(screen.getByRole('heading')).toHaveTextContent('New Custom Title')
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
