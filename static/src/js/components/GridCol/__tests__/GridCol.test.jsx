import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import GridCol from '../GridCol'

vi.mock('../../GridLayout/GridLayout', () => ({
  __esModule: true,
  default: vi.fn(() => (
    <div data-testid="mock-row">Mock Row</div>
  ))
}))

const setup = (overrideProps = {}) => {
  const registry = {
    schemaUtils: {
      retrieveSchema: vi.fn().mockReturnValue({
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
    layout,
    onChange: vi.fn(),
    registry,
    required: false,
    schema: {
      description: 'Test Description'
    },
    uiSchema: {},
    ...overrideProps
  }

  const user = userEvent.setup()

  render(
    <GridCol {...props} />
  )

  return {
    props,
    user
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
