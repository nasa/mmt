/* eslint-disable react/jsx-no-constructed-context-values */
import React from 'react'
import {
  render, waitFor, screen
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import {
  BrowserRouter
} from 'react-router-dom'
import CustomDateTimeWidget from '../CustomDateTimeWidget'

describe('Custom Date Time Widget Component', () => {
  it('renders the custom dateTime widget with empty value and not required', async () => {
    const props = {
      label: 'my test data label',
      required: false,
      schema: {},
      onChange: {}
    }
    const { getByTestId, container } = render(
      <BrowserRouter>
        <CustomDateTimeWidget {...props} />
      </BrowserRouter>
    )
    await waitFor(async () => {
      const fieldElement = getByTestId('custom-date-time-widget__my-test-data-label')
      expect(fieldElement).not.toHaveTextContent('*')
    })
    expect(container).toMatchSnapshot()
  })
  it('renders the custom dateTime widget with empty value and required', async () => {
    const props = {
      label: 'my test data label',
      required: true,
      schema: {},
      onChange: {}
    }
    const { getByTestId, container } = render(
      <BrowserRouter>
        <CustomDateTimeWidget {...props} />
      </BrowserRouter>
    )
    await waitFor(async () => {
      const fieldElement = getByTestId('custom-date-time-widget__my-test-data-label')
      expect(fieldElement).toHaveTextContent('my test data label*')
    })

    expect(container).toMatchSnapshot()
  })
  it('makes sure the onChange is working with when a date provided by the user', async () => {
    const mockedOnChange = jest.fn()
    const props = {
      label: 'my test data label',
      require: false,
      schema: {},
      onChange: mockedOnChange,
      options: {
        title: 'Date'
      }
    }
    const { getByTestId, container } = render(
      <BrowserRouter>
        <CustomDateTimeWidget {...props} />
      </BrowserRouter>
    )

    const fieldElement = getByTestId('custom-date-time-widget__my-test-data-label--input-field').querySelector('input')
    expect(mockedOnChange).toHaveBeenCalledTimes(0)
    await waitFor(async () => {
      screen.getByTestId('custom-date-time-widget__my-test-data-label--input-field').querySelector('input').click()
    })
    await act(async () => null) // Popper update() - https://github.com/popperjs/react-popper/issues/350
    userEvent.type(fieldElement, '2022-07-02T00:00:00.000Z')
    expect(mockedOnChange).toHaveBeenCalledWith('2022-07-02T00:00:00.000Z')
    expect(container).toMatchSnapshot()
  })
  it('makes sure the correct date is rendered if date is already set in the draft', async () => {
    const props = {
      label: 'my test data label',
      require: false,
      schema: {},
      onChange: {},
      value: '2020-08-28T00:00:00.000Z',
      options: {
        title: 'Date'
      }
    }
    const { getByTestId, container } = render(
      <BrowserRouter>
        <CustomDateTimeWidget {...props} />
      </BrowserRouter>
    )

    const fieldElement = getByTestId('custom-date-time-widget__my-test-data-label--input-field').querySelector('input')
    expect(fieldElement.value).toBe('2020-08-28T00:00:00.000Z')
    await act(async () => null) // Popper update() - https://github.com/popperjs/react-popper/issues/350
    await waitFor(async () => {
      screen.getByTestId('custom-date-time-widget__my-test-data-label--input-field').querySelector('input').click()
    })
    const monthAndYear = getByTestId('custom-date-time-widget__my-test-data-label--input-field').querySelector('div.react-datepicker__current-month')
    expect(monthAndYear).toHaveTextContent('August 2020')
    expect(container).toMatchSnapshot()
  })
})
