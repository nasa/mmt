import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
// Import Select from 'react-select'

import CustomSelectWidget from '../CustomSelectWidget'
import CustomWidgetWrapper from '../../CustomWidgetWrapper/CustomWidgetWrapper'
import useControlledKeywords from '../../../hooks/useControlledKeywords'

jest.mock('../../CustomWidgetWrapper/CustomWidgetWrapper')
jest.mock('../../../hooks/useControlledKeywords')
// Jest.mock('react-select', () => jest.fn(({ children }) => (
//   <mock-Component data-testid="react-select">
//     {children}
//   </mock-Component>
// )))

const setup = (overrideProps = {}) => {
  useControlledKeywords.mockReturnValue({
    keywords: [
      {
        value: 'application/gml+xml',
        label: 'application/gml+xml'
      },
      {
        value: 'application/gzip',
        label: 'application/gzip'
      },
      {
        value: 'application/json',
        label: 'application/json'
      },
      {
        value: 'application/msword',
        label: 'application/msword'
      },
      {
        value: 'application/octet-stream',
        label: 'application/octet-stream'
      },
      {
        value: 'application/opensearchdescription+xml',
        label: 'application/opensearchdescription+xml'
      },
      {
        value: 'application/pdf',
        label: 'application/pdf'
      },
      {
        value: 'application/tar',
        label: 'application/tar'
      },
      {
        value: 'application/tar+gzip',
        label: 'application/tar+gzip'
      },
      {
        value: 'application/tar+zip',
        label: 'application/tar+zip'
      },
      {
        value: 'application/vnd.google-earth.kml+xml',
        label: 'application/vnd.google-earth.kml+xml'
      },
      {
        value: 'application/vnd.google-earth.kmz',
        label: 'application/vnd.google-earth.kmz'
      },
      {
        value: 'application/vnd.ms-excel',
        label: 'application/vnd.ms-excel'
      },
      {
        value: 'application/vnd.opendap.dap4.dmrpp+xml',
        label: 'application/vnd.opendap.dap4.dmrpp+xml'
      },
      {
        value: 'application/x-bufr',
        label: 'application/x-bufr'
      },
      {
        value: 'application/x-hdf',
        label: 'application/x-hdf'
      },
      {
        value: 'application/x-hdf5',
        label: 'application/x-hdf5'
      },
      {
        value: 'application/x-hdfeos',
        label: 'application/x-hdfeos'
      },
      {
        value: 'application/x-netcdf',
        label: 'application/x-netcdf'
      },
      {
        value: 'application/x-tar-gz',
        label: 'application/x-tar-gz'
      },
      {
        value: 'application/x-vnd.iso.19139-2+xml',
        label: 'application/x-vnd.iso.19139-2+xml'
      },
      {
        value: 'application/xml',
        label: 'application/xml'
      },
      {
        value: 'application/zip',
        label: 'application/zip'
      },
      {
        value: 'image/bmp',
        label: 'image/bmp'
      },
      {
        value: 'image/gif',
        label: 'image/gif'
      },
      {
        value: 'image/jpeg',
        label: 'image/jpeg'
      },
      {
        value: 'image/png',
        label: 'image/png'
      },
      {
        value: 'image/tiff',
        label: 'image/tiff'
      },
      {
        value: 'image/vnd.collada+xml',
        label: 'image/vnd.collada+xml'
      },
      {
        value: 'text/css',
        label: 'text/css'
      },
      {
        value: 'text/csv',
        label: 'text/csv'
      },
      {
        value: 'text/html',
        label: 'text/html'
      },
      {
        value: 'text/javascript',
        label: 'text/javascript'
      },
      {
        value: 'text/markdown',
        label: 'text/markdown'
      },
      {
        value: 'text/plain',
        label: 'text/plain'
      },
      {
        value: 'text/xml',
        label: 'text/xml'
      }
    ],
    isLoading: false
  })

  const formContext = {
    focusField: '',
    setFocusField: jest.fn()
  }

  const props = {
    disabled: false,
    id: 'mock-id',
    label: 'Test Field',
    onBlur: jest.fn(),
    onChange: jest.fn(),
    placeholder: 'Test Placeholder',
    registry: {
      formContext,
      schemaUtils: {
        retrieveSchema: jest.fn().mockReturnValue({})
      }
    },
    required: false,
    schema: {
      description: 'Test Description'
    },
    uiSchema: {},
    value: undefined,
    ...overrideProps
  }

  render(
    <BrowserRouter>
      <CustomSelectWidget {...props} />
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

describe('CustomSelectWidget', () => {
  describe('when the field is required', () => {
    test.only('renders a select element', async () => {
      const { user } = setup({
        required: true
      })

      const field = screen.getByRole('combobox')
      screen.debug()
      await user.click(field)

      expect(field).toHaveAttribute('id', 'react-select-2-input')
      // Expect(field).toHaveAttribute('name', 'Test Field')
      expect(field).toHaveAttribute('placeholder', 'Test Placeholder')
      expect(field).toHaveAttribute('options', 'text')
      // Expect(field).toHaveAttribute('value', '')

      // expect(Select).toHaveBeenCalledTimes(2)
      // expect(Select).toHaveBeenCalledWith()

      expect(CustomWidgetWrapper).toHaveBeenCalledTimes(1)
      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        description: null,
        headerClassName: null,
        label: 'Test Field',
        maxLength: null,
        required: true,
        title: 'Test Field'
      }), {})
    })
  })

  describe('when the field has a value', () => {
    test('renders a select element', () => {
      setup({
        value: 'Test Value'
      })

      const field = screen.getByRole('textbox')

      expect(field).toHaveAttribute('id', 'mock-id')
      expect(field).toHaveAttribute('name', 'Test Field')
      expect(field).toHaveAttribute('placeholder', 'Test Placeholder')
      expect(field).toHaveAttribute('type', 'text')
      expect(field).toHaveAttribute('value', 'Test Value')

      expect(CustomWidgetWrapper).toHaveBeenCalledTimes(1)
      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        charsUsed: 10,
        description: null,
        headerClassName: null,
        label: 'Test Field',
        maxLength: null,
        required: false,
        title: 'Test Field'
      }), {})
    })
  })

  describe('when the field is focused', () => {
    test('shows the field description', async () => {
      setup()

      const field = screen.getByRole('textbox')

      await waitFor(async () => {
        field.focus()
      })

      expect(field).toHaveFocus()

      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        description: 'Test Description'
      }), {})
    })
  })

  describe('when the field is blurred', () => {
    test('clears the focusField and calls onBlur', async () => {
      const { props } = setup()

      const field = screen.getByRole('textbox')

      await waitFor(async () => {
        field.focus()
        field.blur()
      })

      expect(props.registry.formContext.setFocusField).toHaveBeenCalledTimes(1)
      expect(props.registry.formContext.setFocusField).toHaveBeenCalledWith(null)

      expect(props.onBlur).toHaveBeenCalledTimes(1)
      expect(props.onBlur).toHaveBeenCalledWith('mock-id')

      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        description: null
      }), {})
    })
  })

  describe('when the field is changed', () => {
    test('updates the charsUsed and calls onChange', async () => {
      const { props, user } = setup()

      const field = screen.getByRole('textbox')

      await user.type(field, 'New Value')

      expect(props.onChange).toHaveBeenCalledTimes(9)
      expect(props.onChange).toHaveBeenCalledWith('New Value')

      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        charsUsed: 9
      }), {})
    })
  })

  describe('when the field is cleared', () => {
    test('removes the value and sets charsUsed to 0', async () => {
      const { props, user } = setup({
        value: 'Test Value'
      })

      const field = screen.getByRole('textbox')

      await user.clear(field)

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith(undefined)

      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        charsUsed: 0
      }), {})
    })
  })

  describe('when the field should be focused', () => {
    test('focuses the field', async () => {
      setup({
        registry: {
          formContext: {
            focusField: 'mock-id'
          }
        }
      })

      const field = screen.getByRole('textbox')

      expect(field).toHaveFocus()
    })
  })

  describe('when the field has a schema title', () => {
    test('uses the schema title', () => {
      setup({
        uiSchema: {
          'ui:title': 'Schema Title'
        }
      })

      expect(CustomWidgetWrapper).toHaveBeenCalledTimes(1)
      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        charsUsed: 0,
        description: null,
        headerClassName: null,
        label: 'Test Field',
        maxLength: null,
        required: false,
        title: 'Schema Title'
      }), {})
    })
  })
})
