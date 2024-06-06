import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import GridCol from '../../GridCol/GridCol'
import GridControlledField from '../../GridControlledField/GridControlledField'
import GridField from '../../GridField/GridField'
import GridLayout from '../GridLayout'
import GridRow from '../../GridRow/GridRow'

vi.mock('../../GridRow/GridRow')
vi.mock('../../GridCol/GridCol')
vi.mock('../../GridField/GridField')
vi.mock('../../GridControlledField/GridControlledField')

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
      }
    }
  }

  const props = {
    disabled: false,
    errorSchema: {},
    formData: {
      LongName: 'mock long name',
      Name: 'mock name'
    },
    idSchema: {
      $id: 'root',
      LongName: {
        $id: 'root_LongName'
      },
      Name: {
        $id: 'root_Name'
      }
    },
    onBlur: vi.fn(),
    onChange: vi.fn(),
    onFocus: vi.fn(),
    readonly: false,
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
    uiSchema: {
      Name: {
        'ui:widget': 'textarea'
      },
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [{
          'ui:col': {
            children: [{
              'ui:row': [{
                'ui:col': {
                  children: ['Name'],
                  md: 12
                }
              }]
            }, {
              'ui:row': [{
                'ui:col': {
                  children: ['LongName'],
                  md: 12
                }
              }]
            }],
            md: 12
          },
          'ui:group': 'Tool Information',
          'ui:required': true
        }]
      },
      'ui:mapping': {
        name: 'cmr-mock-name'
      },
      'ui:onHandleChange': vi.fn()
    },
    ...overrideProps
  }

  const user = userEvent.setup()

  render(
    <GridLayout {...props} />
  )

  return {
    props,
    user
  }
}

describe('GridLayout', () => {
  describe('when provided a ui schema layout initially', () => {
    test('renders the row or column in root of the ui schema', () => {
      const { props } = setup({})

      expect(GridRow).toHaveBeenCalledWith(expect.objectContaining({
        layout: props.uiSchema['ui:layout_grid']
      }), {})

      expect(GridRow).toHaveBeenCalledTimes(1)
    })
  })

  describe('when provided a layout column', () => {
    test('renders the column', () => {
      const layout = {
        'ui:col': {
          md: 12,
          children: ['Name']
        }
      }

      setup({ layout })

      expect(GridCol).toHaveBeenCalledWith(expect.objectContaining({
        layout
      }), {})

      expect(GridCol).toHaveBeenCalledTimes(1)
    })
  })

  describe('when provided a layout row', () => {
    test('renders the row ', () => {
      const layout = {
        'ui:row': [
          {
            'ui:col': {
              md: 12,
              children: ['Name']
            }
          }
        ]
      }

      setup({ layout })

      expect(GridRow).toHaveBeenCalledWith(expect.objectContaining({
        layout
      }), {})

      expect(GridRow).toHaveBeenCalledTimes(1)
    })
  })

  describe('when provided layout links to a controlled vocabulary name', () => {
    test('renders the GridControlledField', () => {
      const { props } = setup({
        controlName: 'mock-name',
        layout: 'Name'
      })

      expect(GridControlledField).toHaveBeenCalledWith(expect.objectContaining({
        controlName: 'mock-name',
        mapping: props.uiSchema['ui:controlled'],
        name: 'Name',
        onSelectValue: props.uiSchema['ui:onHandleChange'],
        uiSchema: props.uiSchema.Name
      }), {})

      expect(GridControlledField).toHaveBeenCalledTimes(1)
    })
  })

  describe('when provided a layout is just a normal field name', () => {
    test('renders the GridField', () => {
      const { props } = setup({
        layout: 'Name'
      })

      expect(GridField).toHaveBeenCalledWith(expect.objectContaining({
        layout: 'Name',
        uiSchema: props.uiSchema
      }), {})

      expect(GridField).toHaveBeenCalledTimes(1)
    })
  })
})
