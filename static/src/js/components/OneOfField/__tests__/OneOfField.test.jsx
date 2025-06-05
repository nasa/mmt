import React from 'react'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Select from 'react-select'
import OneOfField from '../OneOfField'

class TestComponent extends OneOfField {
  handleChange = (e) => {
    this.onOptionChange(e)
  }

  render() {
    const { options } = this.props

    return (
      <Select
        options={options}
        placeholder="Test Placeholder"
        onChange={this.handleChange}
      />
    )
  }
}

const setup = (overrideProps = {}) => {
  const options = [
    {
      additionalProperties: false,
      title: 'Points',
      properties: {
        SpatialPoints: {
          description: 'The spatial extent of the layer, feature type or coverage described by a point.',
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            description: 'The coordinates consist of a latitude and longitude.',
            properties: {
              Latitude: {
                description: 'The latitude of the point.',
                type: 'number'
              },
              Longitude: {
                description: 'The longitude of the point.',
                type: 'number'
              }
            },
            required: [
              'Latitude',
              'Longitude'
            ]
          },
          minItems: 1
        }
      },
      required: [
        'SpatialPoints'
      ]
    },
    {
      additionalProperties: false,
      title: 'Line String',
      properties: {
        SpatialLineStrings: {
          description: 'The spatial extent of the layer, feature type or coverage described by a line string.',
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            description: 'The line string consists of two points: a start point and an end ppint.',
            properties: {
              StartPoint: {
                type: 'object',
                additionalProperties: false,
                description: 'The start point of the line string.',
                properties: {
                  Latitude: {
                    description: 'The latitude of the point.',
                    type: 'number'
                  },
                  Longitude: {
                    description: 'The longitude of the point.',
                    type: 'number'
                  }
                },
                required: [
                  'Latitude',
                  'Longitude'
                ]
              }
            },
            required: [
              'StartPoint'
            ]
          },
          minItems: 1
        }
      },
      required: [
        'SpatialLineStrings'
      ]
    }
  ]
  const schema = {
    type: 'object',
    description: 'The spatial extent of the coverage available from the service. These are coordinate pairs which describe either the point, line string, or polygon representing the spatial extent. The bounding box is described by the west, south, east and north ordinates',
    oneOf: [
      {
        additionalProperties: false,
        title: 'Points',
        properties: {
          SpatialPoints: {
            description: 'The spatial extent of the layer, feature type or coverage described by a point.',
            type: 'array',
            items: {
              $ref: '#/definitions/CoordinatesType'
            },
            minItems: 1
          }
        },
        required: [
          'SpatialPoints'
        ]
      },
      {
        additionalProperties: false,
        title: 'Line String',
        properties: {
          SpatialLineStrings: {
            description: 'The spatial extent of the layer, feature type or coverage described by a line string.',
            type: 'array',
            items: {
              $ref: '#/definitions/LineStringType'
            },
            minItems: 1
          }
        },
        required: [
          'SpatialLineStrings'
        ]
      }
    ]
  }

  const registry = {
    schemaUtils: {
      retrieveSchema: () => schema,
      getClosestMatchingOption: vi.fn(),
      sanitizeDataForNewSchema: vi.fn(),
      getDefaultFormState: vi.fn(),
      getDisplayLabel: vi.fn()
    },
    fields: {}
  }

  const props = {
    formData: {},
    options,
    registry,
    idSchema: { $id: 'mock_id' },
    schema,
    onChange: vi.fn(),
    name: 'mock_name',
    disabled: false,
    onBlur: vi.fn(),
    onFocus: vi.fn(),
    uiSchema: {},
    formContext: {},
    ...overrideProps
  }

  const user = userEvent.setup()

  render(
    <TestComponent {...props} />
  )

  return {
    props,
    user
  }
}

describe('OneOfField', () => {
  describe('calling onOptionChange', () => {
    test('expect onChange to be called', async () => {
      const { props } = setup()
      expect(screen.getByText('Test Placeholder').className).toContain('placeholder')

      const select = screen.getByRole('combobox')
      await userEvent.click(select)
      const option = screen.getAllByRole('option')
      await userEvent.click(option[0])
      expect(props.onChange).toHaveBeenCalledTimes(1)
    })
  })
})
