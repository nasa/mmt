import React from 'react'
import {
  fireEvent,
  render, screen, waitFor
} from '@testing-library/react'
import Form from '@rjsf/bootstrap-4'
import validator from '@rjsf/validator-ajv8'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import LayoutGridField from '../LayoutGridField'
import CustomTitleFieldTemplate from '../CustomTitleFieldTemplate'
import MetadataEditor from '../../MetadataEditor'
import UmmToolsModel from '../../model/UmmToolsModel'
import UmmVarModel from '../../model/UmmVarModel'
import MetadataEditorForm from '../MetadataEditorForm'

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

    const { container } = render(<Form validator={validator} schema={schema} uiSchema={uiSchema} fields={fields} formContext={{ editor }} />)
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
    const { container } = render(<Form validator={validator} schema={schema} uiSchema={uiSchema} fields={fields} formContext={{ editor }} />)
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
    const { container } = render(<Form validator={validator} schema={schema} uiSchema={uiSchema} fields={fields} formContext={{ editor }} />)
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
    const { container } = render(<Form validator={validator} schema={schema} uiSchema={uiSchema} fields={fields} formContext={{ editor }} />)
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
    const { container } = render(<Form validator={validator} schema={schema} uiSchema={uiSchema} fields={fields} formContext={{ editor }} />)
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
    const { container } = render(<Form validator={validator} schema={schema} uiSchema={uiSchema} fields={fields} formContext={{ editor }} />)
    expect(screen.getByTestId('layout-grid-field__schema-field--password')).toHaveTextContent('My Custom Component')
    expect(container).toMatchSnapshot()
  })

  it('testing autofocus against URL', async () => {
    const model = new UmmToolsModel()
    model.fullData = {
      PotentialAction: {
        Target: {
          ResponseContentType: [
            'response content type'
          ],
          HttpMethod: [
            'GET'
          ],
          Type: 'EntryPoint',
          Description: 'target description',
          UrlTemplate: 'url template'
        },
        Type: 'SearchAction'
      }
    }
    const editor = new MetadataEditor(model)
    HTMLElement.prototype.scrollIntoView = jest.fn()
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/2/edit/Potential_Action']}>
        <Routes>
          <Route path="/tool_drafts/:id/edit/:sectionName" element={<MetadataEditorForm editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )

    // editor.setFocusField('Description')
    // await waitFor(async () => {
    //   editor.setFocusField('Description')
    //   screen.queryByTestId('error-list-item__url').click()
    // })

    expect(container).toMatchSnapshot()
  })

  test('testing autofocus to a group', async () => {
    const model = new UmmToolsModel()
    model.fullData = {
      MetadataSpecification: {
        URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
        Name: 'UMM-T',
        Version: '1.1'
      },
      PotentialAction: {
        Type: 'SearchAction'
      }

    }
    const editor = new MetadataEditor(model)
    HTMLElement.prototype.scrollIntoView = jest.fn()
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/2/edit/Potential_Action']}>
        <Routes>
          <Route path="/tool_drafts/:id/edit/:sectionName" element={<MetadataEditorForm editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(async () => {
      screen.queryByTestId('error-list-item__target').click()
      setTimeout(() => {
        expect(HTMLElement.prototype.scrollIntoView).toBeCalled()
      }, 200)
    })
    // await waitFor(async () => {
    // expect(HTMLElement.prototype.scrollIntoView).toBeCalled()

    // })

    expect(container).toMatchSnapshot()
  })

  test('testing adding contact group', async () => {
    const model = new UmmToolsModel()
    model.fullData = {
      MetadataSpecification: {
        URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
        Name: 'UMM-T',
        Version: '1.1'
      },
      PotentialAction: {
        Type: 'SearchAction'
      }

    }
    const editor = new MetadataEditor(model)
    HTMLElement.prototype.scrollIntoView = jest.fn()
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/2/edit/Tool_Contacts']}>
        <Routes>
          <Route path="/tool_drafts/:id/edit/:sectionName" element={<MetadataEditorForm editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )
    await waitFor(async () => {
      screen.queryByTestId('custom-array-template__add-button--contact-groups').click()
    })
    expect(container).toMatchSnapshot()
  })

  test('testing custom groupArray field', async () => {
    const varModel = new UmmVarModel()
    const editor = new MetadataEditor(varModel)
    const { container } = render(
      <MemoryRouter initialEntries={['/variable_drafts/1/edit/Variable_Information']}>
        <Routes>
          <Route path="/variable_drafts/:id/edit/:sectionName" element={<MetadataEditorForm editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )
    const addFieldBtn = screen.queryByTestId('layout-grid-field__add-single-panel--index-ranges')

    expect(addFieldBtn).toHaveTextContent('Add Index Ranges')

    fireEvent.click(await addFieldBtn)

    expect(container).toHaveTextContent('LatRange')

    const removeFieldBtn = screen.queryByTestId('layout-grid-field__remove-single-panel--index-ranges')

    fireEvent.click(await removeFieldBtn)

    expect(addFieldBtn).toHaveTextContent('Add Index Ranges')

    expect(container).toMatchSnapshot()
  })
})
