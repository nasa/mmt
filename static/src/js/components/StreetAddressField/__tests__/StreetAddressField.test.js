import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

import StreetAddressField from '../StreetAddressField'

const setup = (overrideProps = {}) => {
  const props = {
    schema: {
      maxLength: 80,
      description: 'The street address description'
    },
    uiSchema: {},
    registry: {
      formContext: {
        focusField: '',
        setFocusField: jest.fn()
      }
    },
    onChange: jest.fn(),
    formData: ['my first line', 'my second line', 'my third line'],
    noLines: 4,
    ...overrideProps
  }

  const component = render(
    <BrowserRouter>
      <StreetAddressField {...props} />
    </BrowserRouter>
  )

  return {
    component,
    props,
    user: userEvent.setup()
  }
}

describe('StreetAddressField', () => {
  describe('when data is given', () => {
    test('renders the component', () => {
      const { component } = setup()
      const line0 = component.container.querySelector('#f1_0')
      expect(line0).toHaveValue('my first line')
      const line1 = component.container.querySelector('#f1_1')
      expect(line1).toHaveValue('my second line')
      const line2 = component.container.querySelector('#f1_2')
      expect(line2).toHaveValue('my third line')
      const line3 = component.container.querySelector('#f1_3')
      expect(line3).toHaveValue('')
    })
  })

  describe('when change address line', () => {
    test('renders the component with updated data', async () => {
      const {
        component,
        user,
        props
      } = setup()
      const line0 = component.container.querySelector('#f2_0')
      expect(line0).toHaveValue('my first line')
      await user.type(line0, 'B')

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith(['my first lineB', 'my second line', 'my third line', ''])
    })
  })
})
