import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GridCheckboxPanel from '../GridCheckboxPanel'

import GridLayout from '../../GridLayout/GridLayout'

vi.mock('../../GridLayout/GridLayout')

const setup = (overrideProps = {}) => {
  const onChange = vi.fn()
  const layout = {
    'ui:group-checkbox': 'Spatial',
    'ui:row': [
      {
        'ui:col': {
          md: 12,
          children: [
            'SpatialSubset'
          ]
        }
      }
    ]
  }
  const schema = {
    description: 'This element is used to identify the set of supported subsetting capabilities, Spatial, Temporal, and Variable.',
    type: 'object',
    additionalProperties: false,
    properties: {
      SpatialSubset: {
        description: 'This element describes what kind of spatial subsetting the service provides. The sub elements provide the details.',
        type: 'object',
        additionalProperties: false,
        properties: {
          Point: {
            description: 'This element describes that the service provides a point spatial subsetting capability.',
            type: 'object',
            additionalProperties: false,
            properties: {
              AllowMultipleValues: {
                description: 'The described service will accept a list of values, such as an array of multiple points, if this element is true. A value of false or the element is not used means the service only accepts a single point.',
                type: 'boolean'
              }
            },
            required: [
              'AllowMultipleValues'
            ]
          }
        }
      }
    }
  }
  const uiSchema = {
    'ui:field': 'layout',
    'ui:layout_grid': {
      'ui:group': 'Subset',
      'ui:group-description': true,
      'ui:row': [
        {
          'ui:col': {
            md: 12,
            children: [
              {
                'ui:group-checkbox': 'Spatial',
                'ui:row': [
                  {
                    'ui:col': {
                      md: 12,
                      children: [
                        'SpatialSubset'
                      ]
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    SpatialSubset: {
      'ui:field': 'layout',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:group-checkbox': 'Point',
                  'ui:row': [
                    {
                      'ui:col': {
                        md: 12,
                        children: [
                          'Point'
                        ]
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      Point: {
        'ui:hide-header': true
      }
    }
  }

  const props = {
    layout,
    formData: {},
    onChange,
    registry: {
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

  const user = userEvent.setup()

  render(
    <GridCheckboxPanel {...props} />
  )

  return {
    props,
    user
  }
}

describe('GridCheckboxPanel', () => {
  describe('when a checkbox is selected', () => {
    test('render the children', async () => {
      const { user } = setup()

      const select = screen.getByRole('checkbox')

      await user.click(select)

      expect(GridLayout).toHaveBeenCalledTimes(1)
      expect(GridLayout).toHaveBeenCalledWith(expect.objectContaining({
        layout: {
          'ui:col': {
            children: ['SpatialSubset'],
            md: 12
          }
        }
      }), {})
    })
  })

  describe('when unselecting the checkbox', () => {
    test('return empty form data', async () => {
      const { props, user } = setup({
        formData: {
          SpatialSubset: {
            Point: {
              AllowMultipleValues: true
            }
          }
        }
      })
      const select = screen.getByRole('checkbox')

      await user.click(select)

      expect(props.formData).toMatchObject({})
    })
  })
})
