import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import ObjectField from '../ObjectField'

class TestComponent extends ObjectField {
  handleChange = (e) => {
    const { value } = e.target
    this.onPropertyChange('Name')(value, {}, 'mock-id')
  }

  render() {
    return (
      <input
        name="mock-input"
        onChange={this.handleChange}
        required={this.isRequired('Name')}
      />
    )
  }
}

describe('ObjectField', () => {
  describe('calling onPropertyChange', () => {
    test('updated the formData', async () => {
      const onChange = jest.fn()
      render(
        <TestComponent
          onChange={onChange}
          formData={
            {
              Test: 'mockTest'
            }
          }
          errorSchema={{}}
          schema={{}}
        />
      )

      const field = screen.getByRole('textbox')

      await userEvent.type(field, 'N')

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith({
        Name: 'N',
        Test: 'mockTest'
      }, { Name: {} }, 'mock-id')
    })
  })

  describe('when a field is required', () => {
    test('return the required attribute', () => {
      const onChange = jest.fn()
      render(
        <TestComponent
          onChange={onChange}
          formData={
            {
              Test: 'mockTest'
            }
          }
          errorSchema={{}}
          schema={
            {
              type: 'object',
              additionalProperties: false,
              description: 'Test Description',
              properties: {
                Name: {
                  description: 'Name Field Description',
                  type: 'string',
                  minLength: 1,
                  maxLength: 80
                }
              },
              required: [
                'Name'
              ]
            }
          }
        />
      )

      const field = screen.getByRole('textbox')

      expect(field).toHaveAttribute('required')
    })
  })

  describe('when a field is not required', () => {
    test('return no required attribute', () => {
      const onChange = jest.fn()
      render(
        <TestComponent
          onChange={onChange}
          formData={
            {
              Test: 'mockTest'
            }
          }
          errorSchema={{}}
          schema={
            {
              type: 'object',
              additionalProperties: false,
              description: 'Test Description',
              properties: {
                Name: {
                  description: 'Name Field Description',
                  type: 'string',
                  minLength: 1,
                  maxLength: 80
                }
              }
            }
          }
        />
      )

      const field = screen.getByRole('textbox')

      expect(field).not.toHaveAttribute('required')
    })
  })
})
