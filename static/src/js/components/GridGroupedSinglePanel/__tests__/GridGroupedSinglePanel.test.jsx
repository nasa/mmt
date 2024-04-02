import React from 'react'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import GridGroupedSinglePanel from '../GridGroupedSinglePanel'

vi.mock('../../CustomWidgetWrapper/CustomWidgetWrapper')

const setup = (overrideProps = {}) => {
  const onChange = vi.fn()
  const layout = {
    'ui:group': 'Index Ranges',
    'ui:group-description': true,
    'ui:group-single-panel': true,
    'ui:row': [
      {
        'ui:col': {
          md: 12,
          children: [{
            'ui:row': [{
              'ui:col': {
                md: 12,
                children: ['LatRange']
              }
            }]
          }, {
            'ui:row': [{
              'ui:col': {
                md: 12,
                children: ['LonRange']
              }
            }]
          }]
        }
      }
    ]
  }

  const uiSchema = {
    'ui:field': 'layout',
    'ui:title': 'Index Ranges',
    'ui:layout_grid': {
      'ui:group': 'Index Ranges',
      'ui:group-description': true,
      'ui:group-single-panel': true,
      'ui:row': [{
        'ui:col': {
          md: 12,
          children: [{
            'ui:row': [{
              'ui:col': {
                md: 12,
                children: ['LatRange']
              }
            }]
          }, {
            'ui:row': [{
              'ui:col': {
                md: 12,
                children: ['LonRange']
              }
            }]
          }]
        }
      }]
    },
    LatRange: {
      'ui:canAdd': false,
      items: { 'ui:type': 'number' }
    },
    LonRange: {
      'ui:canAdd': false,
      items: { 'ui:type': 'number' }
    }
  }

  const schema = {
    type: 'object',
    additionalProperties: false,
    description: 'This element describes the x and y dimension ranges for this variable. Typically these values are 2 latitude and longitude ranges, but they dont necessarily have to be.',
    properties: {
      LatRange: {
        description: 'The LatRange consists of an index range for latitude.',
        type: 'array',
        items: { type: 'number' },
        minItems: 2,
        maxItems: 2
      },
      LonRange: {
        description: 'The LonRange consists of an index range for longitude.',
        type: 'array',
        items: { type: 'number' },
        minItems: 2,
        maxItems: 2
      }
    },
    required: ['LatRange', 'LonRange']
  }

  const props = {
    layout,
    formData: {},
    onChange,
    registry: {
      fields: {
        SchemaField: vi.fn(),
        TitleField: vi.fn()
      },
      formContext: {},
      schemaUtils: {
        retrieveSchema: () => schema
      }
    },
    schema,
    idSchema: {},
    errorSchema: {},
    uiSchema,
    ...overrideProps
  }

  render(
    <GridGroupedSinglePanel {...props} />
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('GridGroupedSinglePanel', () => {
  describe('when initial rendering', () => {
    test('renders the add group button', async () => {
      const { user } = setup()
      expect(screen.getByText('Add Index Ranges')).toBeInTheDocument()
      const addButton = screen.getByRole('button', { name: 'Plus icon in a circle Add Index Ranges' })
      await user.click(addButton)
      expect(screen.getByText('Remove Index Ranges')).toBeInTheDocument()
    })
  })

  describe('when add button clicked', () => {
    test('renders the remove group button', async () => {
      const { user } = setup()
      const addButton = screen.getByRole('button', { name: 'Plus icon in a circle Add Index Ranges' })
      await user.click(addButton)
      const removeButton = screen.getByRole('button', { name: 'Minus icon in a circle Remove Index Ranges' })
      await user.click(removeButton)
      expect(screen.getByText('Add Index Ranges')).toBeInTheDocument()
    })
  })

  describe('when change form data', () => {
    test('renders updated data', async () => {
      const formData = {
        LatRange: [
          1,
          2
        ],
        LonRange: [
          3,
          4
        ]
      }

      const { user } = setup({ formData })
      expect(screen.getByText('Remove Index Ranges')).toBeInTheDocument()
      const removeButton = screen.getByRole('button', { name: 'Minus icon in a circle Remove Index Ranges' })
      await user.click(removeButton)
      expect(screen.getByText('Add Index Ranges')).toBeInTheDocument()
    })
  })
})
