import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import StreetAddressField from '../StreetAddressField'

const setup = (overrideProps = {}) => {
  const props = {
    formData: [
      'my first line',
      'my second line',
      'my third line'
    ],
    onChange: jest.fn(),
    registry: {
      formContext: {
        focusField: '',
        setFocusField: jest.fn()
      }
    },
    schema: {
      description: 'The street address description',
      maxLength: 80
    },
    uiSchema: {},
    ...overrideProps
  }

  render(
    <StreetAddressField {...props} />
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('StreetAddressField', () => {
  describe('when data is given', () => {
    test('renders the component', () => {
      setup()

      const line1 = screen.getByLabelText('Address Line 1')
      expect(line1).toHaveValue('my first line')

      const line2 = screen.getByLabelText('Address Line 2')
      expect(line2).toHaveValue('my second line')

      const line3 = screen.getByLabelText('Address Line 3')
      expect(line3).toHaveValue('my third line')
    })
  })

  describe('when change address line', () => {
    test('renders the component with updated data', async () => {
      const { props, user } = setup()

      const line1 = screen.getByLabelText('Address Line 1')
      expect(line1).toHaveValue('my first line')
      await user.type(line1, 'B')

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith(['my first lineB', 'my second line', 'my third line'])
    })
  })
})
