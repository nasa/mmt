import React from 'react'
import {
  render, fireEvent, screen, waitFor
} from '@testing-library/react'
import { createSchemaUtils } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import CustomMultiSelectWidget from '../CustomMultiSelectWidget'
import UmmToolsModel from '../../../model/UmmToolsModel'
import MetadataEditor from '../../../MetadataEditor'
import MetadataEditorForm from '../../MetadataEditorForm'

describe('Custom Multi Select Widget Component', () => {
  const model = new UmmToolsModel()
  const editor = new MetadataEditor(model)

  it('renders the custom multi select widget when no enum', async () => {
    const schema = {
      items: {
      }
    }
    const props = {
      label: 'MyTestDataLabel',
      required: false,
      schema,
      registry: {
        schemaUtils: createSchemaUtils(validator, schema),
        formContext: { editor }
      },
      options: {},
      onChange: {},
      value: ['Web', 'Portal']
    }
    HTMLElement.prototype.scrollIntoView = jest.fn()

    const { container } = render(<CustomMultiSelectWidget {...props} />)
    expect(screen.getByTestId('custom-multi-select-widget__my-test-data-label')).not.toHaveTextContent('My Test Data Label*')
    expect(screen.getByTestId('custom-multi-select-widget__my-test-data-label--selector')).toHaveTextContent('Web')
    expect(screen.getByTestId('custom-multi-select-widget__my-test-data-label--selector')).toHaveTextContent('Portal')
    expect(container).toMatchSnapshot()
  })
  it('renders the custom select widget when no value and no enum', async () => {
    const props = {
      label: 'MyTestDataLabel',
      required: false,
      schema: {
      },
      options: {
        title: ''
      },
      registry: {
        schemaUtils: createSchemaUtils(validator, {}),
        formContext: { editor }
      },
      onChange: {},
      value: []
    }
    const { container } = render(<CustomMultiSelectWidget {...props} />)
    expect(screen.getByTestId('custom-multi-select-widget__my-test-data-label')).not.toHaveTextContent('My Test Data Label*')
    expect(screen.getByTestId('custom-multi-select-widget__my-test-data-label--selector')).not.toHaveTextContent('Web')
    expect(container).toMatchSnapshot()
  })
  it('renders the custom multi select widget when required field and label', async () => {
    const schema = {
      items: {}
    }
    const props = {
      label: 'MyTestDataLabel',
      required: true,
      schema,
      registry: {
        schemaUtils: createSchemaUtils(validator, schema),
        formContext: { editor }
      },
      options: {},
      onChange: {},
      value: ['Web', 'Portal']
    }
    HTMLElement.prototype.scrollIntoView = jest.fn()

    const { container } = render(<CustomMultiSelectWidget {...props} />)
    expect(screen.getByTestId('custom-multi-select-widget__my-test-data-label')).toHaveTextContent('MyTestDataLabel')
    expect(screen.getByTestId('custom-multi-select-widget__my-test-data-label--selector')).toHaveTextContent('Web')
    expect(screen.getByTestId('custom-multi-select-widget__my-test-data-label--selector')).toHaveTextContent('Portal')
    expect(container).toMatchSnapshot()
  })
  it('renders the custom multi select widget when required field and title', async () => {
    const schema = {
      items: {
      }
    }
    const props = {
      label: 'MyTestDataLabel',
      required: true,
      schema,
      registry: {
        schemaUtils: createSchemaUtils(validator, schema),
        formContext: { editor }
      },
      options: {
        title: 'My Test Data Label'
      },
      onChange: {},
      value: ['Web', 'Portal']
    }
    HTMLElement.prototype.scrollIntoView = jest.fn()

    const { container } = render(<CustomMultiSelectWidget {...props} />)
    expect(screen.getByTestId('custom-multi-select-widget__my-test-data-label')).toHaveTextContent('My Test Data Label')
    expect(screen.getByTestId('custom-multi-select-widget__my-test-data-label--selector')).toHaveTextContent('Web')
    expect(screen.getByTestId('custom-multi-select-widget__my-test-data-label--selector')).toHaveTextContent('Portal')
    expect(container).toMatchSnapshot()
  })
  it('renders the custom multi select widget when enum item selected', async () => {
    const mockedOnChange = jest.fn()
    const schema = {
      items: {
        $ref: '#/definitions/ToolOrganizationRoleEnum'
      },
      definitions: {
        ToolOrganizationRoleEnum: { enum: ['Web', 'Portal', 'Author', 'Service'] }
      }
    }
    const props = {
      label: 'MyTestDataLabel',
      required: true,
      schema,
      registry: {
        schemaUtils: createSchemaUtils(validator, schema),
        formContext: { editor }
      },
      options: {
        title: 'My Test Data Label'
      },
      onChange: mockedOnChange,
      value: ['Portal']
    }
    HTMLElement.prototype.scrollIntoView = jest.fn()

    const { container, getByText, queryByTestId } = render(<CustomMultiSelectWidget {...props} />)
    const mySelectComponent = queryByTestId('custom-multi-select-widget__my-test-data-label--selector')

    expect(mySelectComponent).toBeDefined()
    expect(mySelectComponent).not.toBeNull()

    expect(screen.getByTestId('custom-multi-select-widget__my-test-data-label')).toHaveTextContent('My Test Data Label')
    expect(screen.getByTestId('custom-multi-select-widget__my-test-data-label--selector')).toHaveTextContent('Portal')
    expect(screen.getByTestId('custom-multi-select-widget__my-test-data-label--selector')).not.toHaveValue('Service')

    fireEvent.keyDown(mySelectComponent.firstChild, { key: 'ArrowDown' })
    fireEvent.click(await getByText('Author'))
    expect(mockedOnChange).toHaveBeenCalledWith(['Portal', 'Author'])

    expect(screen.getByTestId('custom-multi-select-widget__my-test-data-label--selector')).toHaveTextContent('Portal')
    expect(screen.getByTestId('custom-multi-select-widget__my-test-data-label--selector')).toHaveTextContent('Author')

    expect(container).toMatchSnapshot()
  })

  test('testing autofocus against multi select field', async () => {
    const model = new UmmToolsModel()
    model.fullData = {
      MetadataSpecification: {
        URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
        Name: 'UMM-T',
        Version: '1.1'
      },
      Organizations: [
        {
          ShortName: 'AARHUS-HYDRO',
          LongName: 'Hydrogeophysics Group, Aarhus University '
        }
      ]
    }
    const editor = new MetadataEditor(model)
    HTMLElement.prototype.scrollIntoView = jest.fn()
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/2/edit/Tool_Organizations']}>
        <Routes>
          <Route path="/tool_drafts/:id/edit/:sectionName" element={<MetadataEditorForm editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(async () => {
      screen.queryByTestId('error-list-item__roles').click()
      setTimeout(() => {
        expect(HTMLElement.prototype.scrollIntoView).toBeCalled()
      }, 200)
    })

    userEvent.tab()

    expect(container).toMatchSnapshot()
  })
})
