import React from 'react'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import CustomRadioWidget from '../CustomRadioWidget'
import CustomWidgetWrapper from '../../CustomWidgetWrapper/CustomWidgetWrapper'

jest.mock('../../CustomWidgetWrapper/CustomWidgetWrapper')

const setupCustomRadioWidget = (overrideProps = {}) => {
  const props = {
    label: 'label',
    id: 'id',
    registry: {
      formContext: {
        focusField: '',
        setFocusField: jest.fn()
      }
    },
    required: true,
    schema: {
      description: 'description'
    },
    uiSchema: {
      'ui:title': 'Title Page'
    },
    value: false,
    ...overrideProps
  }

  render(
    <BrowserRouter>
      <CustomRadioWidget {...props} />
    </BrowserRouter>
  )

  return {
    props,
    user: userEvent.setup()
  }
}

beforeEach(() => {
  CustomWidgetWrapper.mockImplementation(
    jest.requireActual('../../CustomWidgetWrapper/CustomWidgetWrapper').default
  )
})

describe('CustomRadioWidget', () => {
  describe('when radio buttons are required', () => {
    test('renders a radio button element with required icon', async () => {
      const { user } = setupCustomRadioWidget({
        required: true
      })
      const radioButtons = screen.getAllByRole('radio')
      const trueRadio = radioButtons[0]
      const falseRadio = radioButtons[1]
      const clearButton = screen.getByRole('link')

      expect(screen.getByRole('img')).toBeInTheDocument()
      expect(clearButton).toBeInTheDocument()
      expect(screen.getByRole('radiogroup')).toBeInTheDocument()
      expect(trueRadio).toBeInTheDocument()
      await user.click(trueRadio)
      expect(falseRadio).toBeInTheDocument()
      await user.click(falseRadio)
      await user.click(clearButton)
    })
  })
})
