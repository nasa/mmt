import React from 'react'
import {
  fireEvent,
  render, screen
} from '@testing-library/react'
import CustomCountrySelecttWidget from '../CustomCountrySelectWidget'

describe('Custom Country Selector Widget Component', () => {
  it('renders the custom country selector widget', async () => {
    const props = {
      label: 'MyTestDataLabel',
      required: false,
      options: {},
      onChange: {},
      value: 'TZ'
    }
    const { container } = render(<CustomCountrySelecttWidget {...props} />)
    expect(screen.getByTestId('country-select-widget__my-test-data-label')).not.toHaveTextContent('My Test Data Label*')
    expect(screen.getByTestId('country-select-widget__my-test-data-label--selector')).toHaveTextContent('Tanzania, United Republic of')
    expect(container).toMatchSnapshot()
  })

  it('can select option', async () => {
    const mockedOnChange = jest.fn()
    const props = {
      label: 'MyTestDataLabel',
      required: true,
      options: { title: 'Country' },
      onChange: mockedOnChange,
      value: 'TZ'
    }
    const { container } = render(<CustomCountrySelecttWidget {...props} />)
    expect(screen.getByTestId('country-select-widget__my-test-data-label--title')).toHaveTextContent('Country*')
    expect(screen.getByTestId('country-select-widget__my-test-data-label--selector')).toHaveTextContent('Tanzania, United Republic of')

    expect(container).toMatchSnapshot()

    const mySelectComponent = screen.queryByTestId('country-select-widget__my-test-data-label--selector')

    expect(mySelectComponent).toBeDefined()
    expect(mySelectComponent).not.toBeNull()
    expect(mockedOnChange).toHaveBeenCalledTimes(0)

    fireEvent.keyDown(mySelectComponent.firstChild, { key: 'ArrowDown' })
    fireEvent.click(await screen.getByText('United States'))
    expect(mockedOnChange).toHaveBeenCalledWith('US')

    fireEvent.keyDown(mySelectComponent.firstChild, { key: 'ArrowDown' })
    fireEvent.click(await screen.getByText('Afghanistan'))
    expect(mockedOnChange).toHaveBeenCalledWith('AF')

    expect(mockedOnChange).toHaveBeenCalledTimes(2)
    expect(container).toMatchSnapshot()
  })
})
