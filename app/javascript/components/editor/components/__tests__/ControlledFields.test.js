import React from 'react'
import {
  fireEvent,
  render, screen, within
} from '@testing-library/react'
import Form from '@rjsf/bootstrap-4'
import { BrowserRouter } from 'react-router-dom'
import ControlledFields from '../ControlledFields'
import UmmToolsModel from '../../model/UmmToolsModel'
import MetadataEditor from '../../MetadataEditor'
import CustomSelectWidget from '../widgets/CustomSelectWidget'
import CustomTextWidget from '../widgets/CustomTextWidget'

const keywords = [
  ['alpha', 'beta', 'gamma'],
  ['alpha', 'beta', 'delta'],
  ['alpha', 'theta', ''],
  ['epsilon', 'zeta']
]

const schema = {
  title: 'Todo',
  type: 'object',
  required: ['title'],
  properties: {
    priorityCategory: {
      type: 'string'
    },
    priority1: {
      type: 'string'
    },
    priority2: {
      type: 'string'
    },
    value: {
      type: 'string'
    }
  }

}
const fields = {
  controlled: ControlledFields
}

const uiSchema = {
  'ui:field': 'controlled',
  'ui:title': 'Todo',
  'ui:controlledFields': ['priorityCategory', 'priority1', 'priority2'],
  'ui:keywords': keywords
}
const model = new UmmToolsModel()
const editor = new MetadataEditor(model)
ControlledFields.defaultProps = { options: { editor } }
CustomSelectWidget.defaultProps = { title: uiSchema['ui:title'], options: { editor } }

describe('Controlled Fields Layout', () => {
  it('renders all fields', async () => {
    const { container } = render(
      <BrowserRouter>
        <Form schema={schema} uiSchema={uiSchema} fields={fields} />
      </BrowserRouter>
    )

    const categoryComponent = screen.queryByTestId('custom-select-widget__priority-category--selector').firstChild
    const priority1Component = screen.queryByTestId('custom-select-widget__priority-1--selector').firstChild
    const priority2Component = screen.queryByTestId('custom-select-widget__priority-2--selector').firstChild
    expect(container).toHaveTextContent('Todo')
    expect(categoryComponent).toBeDefined()
    expect(priority1Component).toBeDefined()
    expect(priority2Component).toBeDefined()

    expect(categoryComponent).not.toBeNull()
    expect(priority1Component).not.toBeNull()
    expect(priority2Component).not.toBeNull()

    expect(container).toMatchSnapshot()
  })

  it('shows values in first select box', () => {
    const { container } = render(

      <BrowserRouter>
        <Form schema={schema} uiSchema={uiSchema} fields={fields} />
      </BrowserRouter>
    )

    const categoryComponent = screen.queryByTestId('custom-select-widget__priority-category--selector').firstChild
    expect(categoryComponent).not.toBeNull()
    fireEvent.keyDown(categoryComponent, { key: 'ArrowDown' })
    expect(categoryComponent).toHaveTextContent('alpha')
    expect(categoryComponent).toHaveTextContent('epsilon')
    expect(categoryComponent).not.toHaveTextContent('beta')

    expect(container).toMatchSnapshot()
  })

  it('shows values in second select box', async () => {
    const { container } = render(
      <BrowserRouter>
        <Form schema={schema} uiSchema={uiSchema} fields={fields} />
      </BrowserRouter>
    )

    const categoryComponent = screen.queryByTestId('custom-select-widget__priority-category--selector').firstChild

    expect(categoryComponent).not.toBeNull()
    fireEvent.keyDown(categoryComponent, { key: 'ArrowDown' })
    fireEvent.click(await within(categoryComponent).getByText('alpha'))
    const p1Component = screen.queryByTestId('custom-select-widget__priority-1--selector').firstChild
    expect(p1Component).toBeDefined()
    expect(p1Component).not.toBeNull()
    fireEvent.keyDown(p1Component, { key: 'ArrowDown' })
    expect(p1Component).toHaveTextContent('beta')
    expect(p1Component).toHaveTextContent('theta')
    expect(p1Component).not.toHaveTextContent('gamma')

    expect(container).toMatchSnapshot()
  })

  it('works without a title', async () => {
    const uiSchema = {
      'ui:field': 'controlled',
      'ui:controlledFields': ['priorityCategory', 'priority1', 'priority2'],
      'ui:keywords': keywords
    }
    const { container } = render(
      <BrowserRouter>
        <Form schema={schema} uiSchema={uiSchema} fields={fields} />
      </BrowserRouter>
    )
    expect(container).not.toHaveTextContent('Todo')
    expect(container).toMatchSnapshot()
  })

  it('renders all fields in case of textfields', async () => {
    uiSchema.priority1 = { 'ui:widget': CustomTextWidget }
    uiSchema.priority2 = { 'ui:widget': CustomTextWidget }
    CustomTextWidget.defaultProps = { title: uiSchema['ui:title'], options: { editor } }

    const { container } = render(
      <BrowserRouter>
        <Form schema={schema} uiSchema={uiSchema} fields={fields} />
      </BrowserRouter>
    )

    const categoryComponent = screen.queryByTestId('custom-select-widget__priority-category--selector')
    const priority1Component = screen.queryByTestId('controlled-fields__custom-text-widget--priority-1')
    const priority2Component = screen.queryByTestId('controlled-fields__custom-text-widget--priority-2')
    expect(container).toHaveTextContent('Todo')
    expect(categoryComponent).toBeDefined()
    expect(priority1Component).toBeDefined()
    expect(priority2Component).toBeDefined()

    expect(categoryComponent).not.toBeNull()
    expect(priority1Component).not.toBeNull()
    expect(priority2Component).not.toBeNull()

    expect(container).toMatchSnapshot()
  })

  it('shows values in descendend text fields', async () => {
    const keywords = [
      ['alpha', 'alphaLong', 'alphaUrl', '1'],
      ['beta', 'betaLong', 'betaUrl', '2']
    ]
    const uiSchema = {
      'ui:field': 'controlled',
      'ui:title': 'Todo',
      'ui:controlledFields': ['priorityCategory', 'priority1', 'priority2'],
      priority1: { 'ui:title': 'priority1', 'ui:widget': CustomTextWidget },
      priority2: { 'ui:title': 'priority2', 'ui:widget': CustomTextWidget },
      'ui:keywords': keywords
    }

    const { container } = render(
      <BrowserRouter>
        <Form schema={schema} uiSchema={uiSchema} fields={fields} />
      </BrowserRouter>
    )

    const categoryComponent = screen.queryByTestId('custom-select-widget__priority-category--selector').firstChild
    const priority1Component = screen.queryByTestId('controlled-fields__custom-text-widget--priority-1')
    const priority2Component = screen.queryByTestId('controlled-fields__custom-text-widget--priority-2')

    expect(categoryComponent).toBeDefined()
    expect(priority1Component).toBeDefined()
    expect(priority2Component).toBeDefined()

    expect(categoryComponent).not.toBeNull()
    expect(priority1Component).not.toBeNull()
    expect(priority2Component).not.toBeNull()

    fireEvent.keyDown(categoryComponent, { key: 'ArrowDown' })
    fireEvent.click(await within(categoryComponent).getByText('alpha'))

    expect(container).toMatchSnapshot()
  })
})
