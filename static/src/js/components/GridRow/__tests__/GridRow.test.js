import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import GridRow from '../GridRow'
import GridLayout from '../../GridLayout/GridLayout'
import GridGroupedSinglePanel from '../../GridGroupedSinglePanel/GridGroupedSinglePanel'
import GridCheckboxPanel from '../../GridCheckboxPanel/GridCheckboxPanel'

jest.mock('../../GridLayout/GridLayout')
jest.mock('../../GridGroupedSinglePanel/GridGroupedSinglePanel')
jest.mock('../../GridCheckboxPanel/GridCheckboxPanel')

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
    uiSchema: {},
    layout: {
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
    },
    registry: {
      formContext: {},
      schemaUtils: {
        retrieveSchema: () => schema
      },
      fields: {
        TitleField: jest.fn(),
        SchemaField: jest.fn()
      }
    },
    formData: {
      Name: 'mock name',
      LongName: 'mock long name',
      Type: 'mock type',
      URL: {
        Description: 'mock url description'
      }
    },
    schema,
    idSchema: {
      $id: 'root',
      Name: { $id: 'root_Name' },
      LongName: { $id: 'root_LongName' },
      Type: { $id: 'root_Type' },
      URL: {
        $id: 'root_URL',
        Description:
        { $id: 'root_URL_Description' }
      }
    },
    errorSchema: {},
    onBlur: jest.fn(),
    onFocus: jest.fn(),
    onChange: jest.fn(),
    disabled: false,
    readonly: false,
    ...overrideProps
  }

  const component = render(
    <GridRow {...props} />
  )
  const { container } = component

  return {
    container,
    props,
    user: userEvent.setup()
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
            md: 12,
            children: [
              'Name'
            ]
          }
        },
        schema: props.schema,
        onChange: props.onChange
      }), {})
    })
  })
})

describe('does not render anything if hide returns true', () => {
  test('renders null', () => {
    const { container } = setup({
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
    expect(container.childElementCount).toEqual(0)
    expect(GridLayout).toHaveBeenCalledTimes(0)
  })
})

describe('when there is a group title', () => {
  test('renders the title, description, and then the rows', () => {
    const { container, props } = setup({
      layout: {
        'ui:group': 'mock group',
        'ui:group-description': true,
        'ui:group-classname': 'mock-group-class-name',
        'ui:group-box-classname': 'mock-group-box-classname',
        'ui:required': true,
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
    expect(props.registry.fields.TitleField).toHaveBeenCalledWith(expect.objectContaining({
      name: 'mock group',
      title: 'mock group',
      className: 'mock-group-class-name',
      required: false,
      requiredUI: true
    }), {})

    expect(container).toHaveTextContent('mock tool description')
  })

  describe('when it should render the row as a single panel', () => {
    test('renders the collapsible single panel', () => {
      setup({
        layout: {
          'ui:group': 'mock group name',
          'ui:group-single-panel': 'mock single panel title',
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

      // We are just passing through all the props, so need to check.
      expect(GridGroupedSinglePanel).toHaveBeenCalledTimes(1)
    })
  })

  describe('when it should render the row as a checkbox panel', () => {
    test('renders the checkbox panel', () => {
      setup({
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

      // We are just passing through all the props, so need to check.
      expect(GridCheckboxPanel).toHaveBeenCalledTimes(1)
    })
  })
})
