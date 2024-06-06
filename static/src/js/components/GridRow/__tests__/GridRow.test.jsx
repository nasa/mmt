import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import GridCheckboxPanel from '../../GridCheckboxPanel/GridCheckboxPanel'
import GridGroupedSinglePanel from '../../GridGroupedSinglePanel/GridGroupedSinglePanel'
import GridLayout from '../../GridLayout/GridLayout'
import GridRow from '../GridRow'

vi.mock('../../GridLayout/GridLayout')
vi.mock('../../GridGroupedSinglePanel/GridGroupedSinglePanel')
vi.mock('../../GridCheckboxPanel/GridCheckboxPanel')

const setup = (overrideProps = {}) => {
  const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    description: 'mock tool description',
    properties: {
      Name: {
        description: 'The name of the downloadable tool or web user interface.',
        type: 'string',
        minLength: 1,
        maxLength: 85
      },
      LongName: {
        description: 'The long name of the downloadable tool or web user interface.',
        type: 'string',
        minLength: 1,
        maxLength: 1024
      },
      Type: {
        description: 'The type of the downloadable tool or web user interface.',
        $ref: '#/definitions/ToolTypeEnum'
      },
      URL: {
        type: 'object',
        properties: {
          Description: {
            description: 'Description of online resource at this URL.',
            type: 'string',
            minLength: 1,
            maxLength: 4000
          }
        }
      }
    }
  }

  const props = {
    disabled: false,
    errorSchema: {},
    formData: {
      LongName: 'mock long name',
      Name: 'mock name',
      Type: 'mock type',
      URL: {
        Description: 'mock url description'
      }
    },
    idSchema: {
      $id: 'root',
      LongName: {
        $id: 'root_LongName'
      },
      Name: {
        $id: 'root_Name'
      },
      Type: {
        $id: 'root_Type'
      },
      URL: {
        $id: 'root_URL',
        Description: {
          $id: 'root_URL_Description'
        }
      }
    },
    layout: {
      'ui:row': [{
        'ui:col': {
          children: ['Name'],
          md: 12
        }
      }]
    },
    onBlur: vi.fn(),
    onChange: vi.fn(),
    onFocus: vi.fn(),
    readonly: false,
    required: false,
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
    uiSchema: {},
    ...overrideProps
  }

  const user = userEvent.setup()

  const { container } = render(
    <GridRow {...props} />
  )

  return {
    container,
    props,
    user
  }
}

describe('GridRow', () => {
  describe('when row data is in the layout', () => {
    test('renders the row', () => {
      const { props } = setup({})

      expect(GridLayout).toHaveBeenCalledTimes(1)
      expect(GridLayout).toHaveBeenCalledWith(expect.objectContaining({
        layout: {
          'ui:col': {
            children: ['Name'],
            md: 12
          }
        },
        onChange: props.onChange,
        schema: props.schema
      }), {})
    })
  })
})

describe('when ui:hide is true', () => {
  test('renders nothing', () => {
    setup({
      layout: {
        'ui:hide': () => (true),
        'ui:row': [
          {
            'ui:col': {
              md: 12,
              children: [
                'Name'
              ]
            }
          }
        ]
      }
    })

    expect(GridLayout).toHaveBeenCalledTimes(0)
  })
})

describe('when there is a group title', () => {
  test('renders the title, description, and then the rows', () => {
    const { props } = setup({
      layout: {
        'ui:group': 'mock group',
        'ui:group-box-classname': 'mock-group-box-classname',
        'ui:group-classname': 'mock-group-class-name',
        'ui:group-description': true,
        'ui:required': true,
        'ui:row': [{
          'ui:col': {
            children: ['Name'],
            md: 12
          }
        }]
      }
    })

    expect(props.registry.fields.TitleField).toHaveBeenCalledTimes(1)
    expect(props.registry.fields.TitleField).toHaveBeenCalledWith(expect.objectContaining({
      name: 'mock group',
      title: 'mock group',
      className: 'mock-group-class-name',
      required: false,
      requiredUI: true
    }), {})

    expect(screen.getByText('mock tool description')).toBeInTheDocument()
  })

  describe('when it should render the row as a single panel', () => {
    test('renders the collapsible single panel', () => {
      const { props } = setup({
        layout: {
          'ui:group': 'mock group name',
          'ui:group-single-panel': true,
          'ui:row': [{
            'ui:col': {
              children: ['Name'],
              md: 12
            }
          }]
        }
      })

      expect(GridGroupedSinglePanel).toHaveBeenCalledTimes(1)
      expect(GridGroupedSinglePanel).toHaveBeenCalledWith(expect.objectContaining({
        idSchema: props.idSchema,
        onChange: props.onChange,
        schema: props.schema
      }), {})
    })
  })

  describe('when it should render the row as a checkbox panel', () => {
    test('renders the checkbox panel', () => {
      const { props } = setup({
        layout: {
          'ui:group-checkbox': 'mock checkbox title',
          'ui:row': [
            {
              'ui:col': {
                md: 12,
                children: [
                  'Name'
                ]
              }
            }
          ]
        }
      })

      expect(GridCheckboxPanel).toHaveBeenCalledTimes(1)
      expect(GridCheckboxPanel).toHaveBeenCalledWith(expect.objectContaining({
        idSchema: props.idSchema,
        onChange: props.onChange,
        schema: props.schema
      }), {})
    })
  })
})
