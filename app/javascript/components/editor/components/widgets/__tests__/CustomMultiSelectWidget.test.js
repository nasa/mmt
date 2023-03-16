import React from 'react'
import {
  render, fireEvent, screen
} from '@testing-library/react'
import { createSchemaUtils } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'
import CustomMultiSelectWidget from '../CustomMultiSelectWidget'

describe('Custom Multi Select Widget Component', () => {
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
        schemaUtils: createSchemaUtils(validator, schema)
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
        schemaUtils: createSchemaUtils(validator, {})
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
        schemaUtils: createSchemaUtils(validator, schema)
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
        schemaUtils: createSchemaUtils(validator, schema)
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
        schemaUtils: createSchemaUtils(validator, schema)
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
})
