import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import GridField from '../GridField'

const setup = (overrideProps = {}) => {
  const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    properties: {
      LongName: {
        description: 'The long name of the downloadable tool or web user interface.',
        type: 'string',
        minLength: 1,
        maxLength: 1024
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
      URL: {
        $id: 'root_URL',
        Description: {
          $id: 'root_URL_Description'
        }
      }
    },
    layout: 'LongName',
    onBlur: jest.fn(),
    onFocus: jest.fn(),
    readonly: false,
    registry: {
      fields: {
        SchemaField: jest.fn(),
        TitleField: jest.fn()
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

  render(
    <GridField {...props} />
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('GridField', () => {
  describe('when there is valid field name', () => {
    test('renders the field', () => {
      const { props } = setup()

      expect(props.registry.fields.SchemaField).toBeCalledWith(
        expect.objectContaining({
          name: 'LongName',
          required: false,
          schema: {
            description: 'The long name of the downloadable tool or web user interface.',
            type: 'string',
            minLength: 1,
            maxLength: 1024
          },
          idSchema:
          {
            $id: 'LongName'
          },
          formData: props.formData.LongName,
          registry: props.registry,
          disabled: false,
          readonly: false
        }),
        {}
      )
    })
  })

  describe('when there is illegal field name', () => {
    test('renders nothing', () => {
      const { props } = setup({
        registry: {
          formContext: {},
          schemaUtils: {
            retrieveSchema: () => ({})
          },
          fields: {
            TitleField: jest.fn(),
            SchemaField: jest.fn()
          }
        },
        layout: 'IllegalFieldName'
      })

      expect(props.registry.fields.SchemaField).toBeCalledTimes(0)
    })
  })

  describe('when there is custom component', () => {
    test('renders the custom component', () => {
      setup({
        layout: {
          name: 'Custom Component',
          render: () => (<div>My Mock Component</div>)
        }
      })

      expect(screen.getByText('My Mock Component')).toBeInTheDocument()
    })
  })

  describe('when there is another container', () => {
    test('renders the container', () => {
      const { props } = setup({
        layout: 'URL'
      })

      expect(props.registry.fields.SchemaField).toBeCalledWith(
        expect.objectContaining({
          disabled: false,
          formData: props.formData.URL,
          idSchema: {
            $id: 'URL',
            Description: {
              $id: 'URL_Description'
            }
          },
          name: 'URL',
          readonly: false,
          registry: props.registry,
          required: false,
          schema: props.schema.properties.URL
        }),
        {}
      )
    })
  })
})
