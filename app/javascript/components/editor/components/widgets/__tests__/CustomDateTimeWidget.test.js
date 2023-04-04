/* eslint-disable react/jsx-no-constructed-context-values */
import React from 'react'
import {
  render, waitFor, screen
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  BrowserRouter, MemoryRouter, Route, Routes
} from 'react-router-dom'
import CustomDateTimeWidget from '../CustomDateTimeWidget'
import UmmToolsModel from '../../../model/UmmToolsModel'
import MetadataEditor from '../../../MetadataEditor'
import MetadataEditorForm from '../../MetadataEditorForm'

describe('Custom Date Time Widget Component', () => {
  it('renders the custom dateTime widget with empty value and not required', async () => {
    const props = {
      label: 'my test data label',
      required: false,
      schema: {},
      onChange: {},
      options: {},
      registry: { formContext: {} }
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
      onChange: {},
      options: {},
      registry: { formContext: {} }
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
      },
      registry: { formContext: {} }
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
    await waitFor(async () => {
      userEvent.type(fieldElement, '2022-07-02T00:00:00.000Z')
      expect(mockedOnChange).toHaveBeenCalledWith('2022-07-02T00:00:00.000Z')
    })
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
      },
      registry: { formContext: {} }
    }
    const { getByTestId, container } = render(
      <BrowserRouter>
        <CustomDateTimeWidget {...props} />
      </BrowserRouter>
    )

    const fieldElement = getByTestId('custom-date-time-widget__my-test-data-label--input-field').querySelector('input')
    expect(fieldElement.value).toBe('2020-08-28T00:00:00.000Z')
    await waitFor(async () => {
      screen.getByTestId('custom-date-time-widget__my-test-data-label--input-field').querySelector('input').click()
    })
    const monthAndYear = getByTestId('custom-date-time-widget__my-test-data-label--input-field').querySelector('div.react-datepicker__current-month')
    expect(monthAndYear).toHaveTextContent('August 2020')
    expect(container).toMatchSnapshot()
  })

  test('testing autofocus against multi select field', async () => {
    const model = new UmmToolsModel()
    model.fullData = {
      LastUpdatedDate: '2020-08-28T00:00:00.000Z',
      MetadataSpecification: {
        URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
        Name: 'UMM-T',
        Version: '1.1'
      }
    }
    const editor = new MetadataEditor(model)
    HTMLElement.prototype.scrollIntoView = jest.fn()
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/2/edit/Tool_Information']}>
        <Routes>
          <Route path="/tool_drafts/:id/edit/:sectionName" element={<MetadataEditorForm editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(async () => {
      screen.getByTestId('custom-date-time-widget__last-updated-date--input-field').querySelector('input').click()
    })
    const monthAndYear = document.querySelector('div.react-datepicker__current-month')
    expect(monthAndYear).toHaveTextContent('August 2020')
    await waitFor(async () => {
      const input = screen.getByTestId('custom-text-widget__name--text-input')
      userEvent.type(input, 'abc')
      userEvent.clear(screen.getByTestId('custom-date-time-widget__last-updated-date--input-field').querySelector('input'))
    })
    expect(container).toMatchSnapshot()
  })
})
