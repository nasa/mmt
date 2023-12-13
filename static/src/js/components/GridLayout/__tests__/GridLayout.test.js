import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import GridRow from '../../GridRow/GridRow'
import GridCol from '../../GridCol/GridCol'
import GridField from '../../GridField/GridField'
import GridControlledField from '../../GridControlledField/GridControlledField'
import GridLayout from '../GridLayout'

jest.mock('../../GridRow/GridRow')
jest.mock('../../GridCol/GridCol')
jest.mock('../../GridField/GridField')
jest.mock('../../GridControlledField/GridControlledField')

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
    uiSchema: {
      'ui:field': 'layout',
      'ui:mapping': {
        name: 'cmr-mock-name'
      },
      'ui:onHandleChange': jest.fn(),
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Tool Information',
            'ui:required': true,
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['Name']
                      }
                    }
                  ]
                },
                {
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: ['LongName']
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      Name: {
        'ui:widget': 'textarea'
      }
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
      LongName: 'mock long name'
    },
    schema,
    idSchema: {
      $id: 'root',
      Name: { $id: 'root_Name' },
      LongName: { $id: 'root_LongName' }
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
    <GridLayout {...props} />
  )
  const { container } = component

  return {
    container,
    props,
    user: userEvent.setup()
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
        uiSchema: props.uiSchema.Name,
        name: 'Name',
        onSelectValue: props.uiSchema['ui:onHandleChange'],
        mapping: props.uiSchema['ui:controlled']
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
        uiSchema: props.uiSchema,
        layout: 'Name'
      }), {})

      expect(GridField).toHaveBeenCalledTimes(1)
    })
  })
})
