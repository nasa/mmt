import React from 'react'
import {
  render, screen
} from '@testing-library/react'
import Form from '@rjsf/bootstrap-4'
import validator from '@rjsf/validator-ajv8'
import LayoutGridField from '../LayoutGridField'
import CustomTitleFieldTemplate from '../CustomTitleFieldTemplate'
import MetadataEditor from '../../MetadataEditor'
import UmmToolsModel from '../../model/UmmToolsModel'

const schema = {
  title: 'Todo',
  type: 'object',
  required: ['title'],
  properties: {
    password: {
      type: 'string',
      title: 'Password'
    },
    lastName: {
      type: 'string',
      title: 'Last name'
    },
    bio: {
      type: 'string',
      title: 'Bio'
    },
    firstName: {
      type: 'string',
      title: 'First name'
    },
    age: {
      type: 'integer',
      title: 'Age'
    }
  }
}
const fields = {
  layout_grid: LayoutGridField,
  TitleField: CustomTitleFieldTemplate
}
const model = new UmmToolsModel()
const editor = new MetadataEditor(model)
LayoutGridField.defaultProps = { options: { editor } }
describe('Layout Grid Field Component', () => {
  it('renders a basic form', async () => {
    const uiSchema = {
      'ui:field': 'layout_grid',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:row': [
                    { 'ui:col': { md: 6, children: ['firstName'] } },
                    { 'ui:col': { md: 6, children: ['lastName'] } }
                  ]
                },
                {
                  'ui:row': [
                    { 'ui:col': { md: 6, children: ['password'] } },
                    { 'ui:col': { md: 6, children: ['age'] } }
                  ]
                },
                {
                  'ui:row': [
                    { 'ui:col': { md: 12, children: ['bio'] } }
                  ]
                }
              ]
            }
          }
        ]
      }
    }

    const { container } = render(<Form validator={validator} schema={schema} uiSchema={uiSchema} fields={fields} />)
    expect(screen.getByTestId('layout-grid-field__schema-field--first-name')).toHaveTextContent('First name')
    expect(screen.getByTestId('layout-grid-field__schema-field--last-name')).toHaveTextContent('Last name')
    expect(screen.getByTestId('layout-grid-field__schema-field--password')).toHaveTextContent('Password')
    expect(screen.getByTestId('layout-grid-field__schema-field--age')).toHaveTextContent('Age')
    expect(screen.getByTestId('layout-grid-field__schema-field--bio')).toHaveTextContent('Bio')
    expect(container).toMatchSnapshot()
  })

  it('renders a group row title', async () => {
    const uiSchema = {
      'ui:field': 'layout_grid',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:group': 'Full Name',
                  'ui:row': [
                    { 'ui:col': { md: 6, children: ['firstName'] } },
                    { 'ui:col': { md: 6, children: ['lastName'] } }
                  ]
                }]
            }
          }
        ]
      }
    }
    const { container } = render(<Form validator={validator} schema={schema} uiSchema={uiSchema} fields={fields} />)
    expect(screen.getByTestId('layout-grid-field__schema-field--first-name')).toHaveTextContent('First name')
    expect(screen.getByTestId('layout-grid-field__schema-field--last-name')).toHaveTextContent('Last name')
    expect(screen.getByTestId('layout-grid-field__row-title-field--full-name')).toHaveTextContent('Full Name')
    expect(container).toMatchSnapshot()
  })

  it('renders a group row title which is undefined', async () => {
    const uiSchema = {
      'ui:field': 'layout_grid',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:col': {
              md: 12,
              children: [
                {
                  'ui:group': {},
                  'ui:row': [
                    { 'ui:col': { md: 6, children: ['firstName'] } },
                    { 'ui:col': { md: 6, children: ['lastName'] } }
                  ]
                }]
            }
          }
        ]
      }
    }
    const { container } = render(<Form validator={validator} schema={schema} uiSchema={uiSchema} fields={fields} />)
    expect(screen.getByTestId('layout-grid-field__schema-field--first-name')).toHaveTextContent('First name')
    expect(screen.getByTestId('layout-grid-field__schema-field--last-name')).toHaveTextContent('Last name')
    expect(screen.queryByTestId('layout-grid-field__schema-field--full-name')).toBeNull()
    expect(container).toMatchSnapshot()
  })

  it('renders a group column title', async () => {
    const uiSchema = {
      'ui:field': 'layout_grid',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': 'Biography',
            'ui:col': { md: 12, children: ['bio'] }
          }
        ]
      }
    }
    const { container } = render(<Form validator={validator} schema={schema} uiSchema={uiSchema} fields={fields} />)
    expect(screen.getByTestId('layout-grid-field__col-title-field--biography')).toHaveTextContent('Biography')
    expect(container).toMatchSnapshot()
  })

  it('renders a group column title which undefined', async () => {
    const uiSchema = {
      'ui:field': 'layout_grid',
      'ui:layout_grid': {
        'ui:row': [
          {
            'ui:group': {},
            'ui:col': { md: 12, children: ['bio'] }
          }
        ]
      }
    }
    const { container } = render(<Form validator={validator} schema={schema} uiSchema={uiSchema} fields={fields} />)
    expect(screen.queryByTestId('layout-grid-field__col-title-field--biography')).toBeNull()
    expect(container).toMatchSnapshot()
  })

  it('renders a custom field', async () => {
    const uiSchema = {
      'ui:field': 'layout_grid',
      'ui:layout_grid': {
        'ui:row': [
          {
            name: 'password',
            render: () => (
              <div>My Custom Component</div>
            )
          },
          { name: 'age' }
        ]
      }
    }
    const { container } = render(<Form validator={validator} schema={schema} uiSchema={uiSchema} fields={fields} />)
    expect(screen.getByTestId('layout-grid-field__schema-field--password')).toHaveTextContent('My Custom Component')
    expect(container).toMatchSnapshot()
  })
})
