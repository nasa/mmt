import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import {
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { createSchemaUtils } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import { MetadataService } from '../../../services/MetadataService'
import UmmCollectionModel from '../../../model/UmmCollectionModel'
import MetadataEditor from '../../../MetadataEditor'
import platformKeywords from '../../../data/test/platform_keywords'
import PlatformField from '../PlatformFields'

describe('Platform Keywords test with keywords from CMR', () => {
  const metadataService = new MetadataService('test_token', 'test_drafts', 'test_user', 'provider')

  it('fetches CMR keywords', async () => {
    const model = new UmmCollectionModel()
    const editor = new MetadataEditor(model)

    const uiSchema = {
      'ui:controlled': {
        name: 'platforms',
        controlName: ['basis', 'category', 'short_name', 'long_name']
      },

      'ui:service': metadataService
    }

    jest.spyOn(MetadataService.prototype, 'fetchCmrKeywords').mockResolvedValue(platformKeywords)
    const mockedOnChange = jest.fn()

    const props = {
      onChange: mockedOnChange,
      uiSchema,
      required: true,
      registry: {
        schemaUtils: createSchemaUtils(validator, {}),
        formContext: { editor }
      }
    }
    const { container } = render(
      <BrowserRouter>
        <PlatformField {...props} />
      </BrowserRouter>
    )

    await act((async () => null))

    const shortName = screen.queryByTestId('platform-field__short-name--selector').firstChild

    await waitFor(async () => {
      await userEvent.tab(shortName)

      const selectAircraft = screen.queryByTestId('platform-field-select-option__Aircraft,AIRCRAFT')
      await userEvent.click(selectAircraft)

      expect(screen.queryByTestId('platform-field__long-name')).toHaveValue('No available Long Name')
      expect(screen.queryByTestId('platform-field__type')).toHaveValue('Aircraft')
    })

    await waitFor(async () => {
      await userEvent.tab(shortName)

      const selectJet = screen.queryByTestId('platform-field-select-option__Jet,A340-600')
      await userEvent.click(selectJet)

      expect(screen.queryByTestId('platform-field__long-name')).toHaveValue('Airbus A340-600')
      expect(screen.queryByTestId('platform-field__type')).toHaveValue('Jet')
    })

    expect(container).toMatchSnapshot()
  })

  it('failed fetching CMR keyword', async () => {
    const model = new UmmCollectionModel()
    const editor = new MetadataEditor(model)

    const uiSchema = {
      'ui:controlled': {
        name: 'platforms',
        controlName: ['basis', 'category', 'short_name', 'long_name']
      },

      'ui:service': metadataService
    }

    jest.spyOn(MetadataService.prototype, 'fetchCmrKeywords').mockRejectedValue('Error retrieving keywords')
    const status = jest.spyOn(MetadataEditor.prototype, 'status', 'set')

    const props = {
      uiSchema,
      required: true,
      registry: {
        schemaUtils: createSchemaUtils(validator, {}),
        formContext: { editor }
      }
    }
    const { container } = render(
      <BrowserRouter>
        <PlatformField {...props} />
      </BrowserRouter>
    )

    await act((async () => null))
    expect(status).toBeCalledWith({
      type: 'warning',
      message: 'Error retrieving platforms keywords'
    })

    expect(container).toMatchSnapshot()
  })

  it('renders correct value when ShortName, Type and LongName are in formData', async () => {
    const model = new UmmCollectionModel()
    const editor = new MetadataEditor(model)

    jest.spyOn(MetadataService.prototype, 'fetchCmrKeywords').mockResolvedValue(platformKeywords)
    const mockedOnChange = jest.fn()

    const props = {
      onChange: mockedOnChange,
      formData: {
        Type: 'Jet',
        ShortName: 'A340-600',
        LongName: 'Airbus A340-600'
      },
      required: true,
      registry: {
        schemaUtils: createSchemaUtils(validator, {}),
        formContext: { editor }
      }
    }
    const { container } = render(
      <BrowserRouter>
        <PlatformField {...props} />
      </BrowserRouter>
    )

    expect(screen.queryByTestId('platform-field__short-name--selector')).toHaveTextContent('A340-600')
    expect(screen.queryByTestId('platform-field__long-name')).toHaveValue('Airbus A340-600')
    expect(screen.queryByTestId('platform-field__type')).toHaveValue('Jet')

    expect(container).toMatchSnapshot()
  })

  it('clears the selected values', async () => {
    const model = new UmmCollectionModel()
    const editor = new MetadataEditor(model)

    jest.spyOn(MetadataService.prototype, 'fetchCmrKeywords').mockResolvedValue(platformKeywords)
    const mockedOnChange = jest.fn()

    const props = {
      onChange: mockedOnChange,
      formData: {
        Type: 'Jet',
        ShortName: 'A340-600',
        LongName: 'Airbus A340-600'
      },
      required: true,
      registry: {
        schemaUtils: createSchemaUtils(validator, {}),
        formContext: { editor }
      }
    }
    const { container } = render(
      <BrowserRouter>
        <PlatformField {...props} />
      </BrowserRouter>
    )
    const shortName = screen.queryByTestId('platform-field__short-name--selector').firstChild

    expect(screen.queryByTestId('platform-field__short-name--selector')).toHaveTextContent('A340-600')
    expect(screen.queryByTestId('platform-field__long-name')).toHaveValue('Airbus A340-600')
    expect(screen.queryByTestId('platform-field__type')).toHaveValue('Jet')

    await waitFor(async () => {
      await userEvent.tab(shortName)
      const clearOption = screen.queryByTestId('platform-field-clear-option')
      fireEvent.click(clearOption)
    })

    expect(screen.queryByTestId('platform-field__short-name--selector')).toHaveTextContent('Select Short Name')
    expect(screen.queryByTestId('platform-field__long-name')).toHaveValue('')
    expect(screen.queryByTestId('platform-field__type')).toHaveValue('')

    expect(container).toMatchSnapshot()
  })
})
