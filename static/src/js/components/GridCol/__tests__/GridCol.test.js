import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import GridCol from '../GridCol'

jest.mock('../../GridLayout/GridLayout', () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="mock-row">Mock Row</div>
  ))
}))

const setup = (overrideProps = {}) => {
  const registry = {
    schemaUtils: {
      retrieveSchema: jest.fn().mockReturnValue({
        type: 'object',
        additionalProperties: false,
        description: 'Test Description'
      })
    },
    fields: {
      TitleField: () => (<div>Mock Title</div>)
    }
  }

  const layout = {
    'ui:col': {
      children: ['TestField']
    }
  }

  const props = {
    required: false,
    registry,
    schema: { description: 'Test Description' },
    layout,
    uiSchema: {},
    onChange: jest.fn(),
    ...overrideProps
  }

  render(
    <GridCol {...props} />
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('GridCol', () => {
  describe('when showing the column', () => {
    test('shows the column with the row', () => {
      setup()

      expect(screen.getByTestId('mock-row')).toBeInTheDocument()
    })
  })

  describe('when showing ui:group', () => {
    test('shows the group title and group description', () => {
      setup({
        layout: {
          'ui:group': 'Mock Group',
          'ui:group-description': true,
          'ui:col': {
            children: ['TestField']
          }
        }
      })

      expect(screen.getByText('Mock Title')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByTestId('mock-row')).toBeInTheDocument()
    })
  })
})
