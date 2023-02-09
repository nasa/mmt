import React from 'react'
import {
  render, fireEvent
} from '@testing-library/react'
import {
  BrowserRouter
} from 'react-router-dom'
import ProgressField from '../ProgressField'
import MetadataEditor from '../../../MetadataEditor'
import UmmToolsModel from '../../../model/UmmToolsModel'

describe('Progress Field Test', () => {
  test('renders in case field required and passed', async () => {
    const props = {
      fieldInfo: {
        section: 'Tool Information',
        name: 'Name',
        index: null,
        status: 'Pass',
        required: true
      }
    }
    const { getByTestId, container } = render(
      <BrowserRouter>
        <ProgressField {...props} />
      </BrowserRouter>
    )
    const component = getByTestId('progress-field__name_null_required_pass')
    expect(component).toBeDefined()
    expect(component).not.toBeNull()
    expect(container).toMatchSnapshot()
  })
  test('renders in case field required and error', async () => {
    const props = {
      fieldInfo: {
        section: 'Tool Information',
        name: 'Name',
        index: null,
        status: 'Error',
        required: true
      }
    }
    const { getByTestId, container } = render(
      <BrowserRouter>
        <ProgressField {...props} />
      </BrowserRouter>
    )
    const component = getByTestId('progress-field__name_null_required_error')
    expect(component).toBeDefined()
    expect(component).not.toBeNull()
    expect(container).toMatchSnapshot()
  })
  test('renders in case field required and empty', async () => {
    const props = {
      fieldInfo: {
        section: 'Tool Information',
        name: 'Name',
        index: null,
        status: 'Not Started',
        required: true
      }
    }
    const { getByTestId, container } = render(
      <BrowserRouter>
        <ProgressField {...props} />
      </BrowserRouter>
    )
    const component = getByTestId('progress-field__name_null_required_not-started')
    expect(component).toBeDefined()
    expect(component).not.toBeNull()
    expect(container).toMatchSnapshot()
  })
  test('renders in case field required and invalid', async () => {
    const props = {
      fieldInfo: {
        section: 'Tool Information',
        name: 'Name',
        index: null,
        status: 'Invalid',
        required: true
      }
    }
    const { getByTestId, container } = render(
      <BrowserRouter>
        <ProgressField {...props} />
      </BrowserRouter>
    )
    const component = getByTestId('progress-field__name_null_required_invalid')
    expect(component).toBeDefined()
    expect(component).not.toBeNull()
    expect(container).toMatchSnapshot()
  })
  test('renders in case field not required and passed', async () => {
    const props = {
      fieldInfo: {
        section: 'Tool Information',
        name: 'Name',
        index: null,
        status: 'Pass',
        required: false
      }
    }
    const { getByTestId, container } = render(
      <BrowserRouter>
        <ProgressField {...props} />
      </BrowserRouter>
    )
    const component = getByTestId('progress-field__name_null_not-required_pass')
    expect(component).toBeDefined()
    expect(component).not.toBeNull()
    expect(container).toMatchSnapshot()
  })
  test('renders in case field not required and error', async () => {
    const props = {
      fieldInfo: {
        section: 'Tool Information',
        name: 'Name',
        index: null,
        status: 'Error',
        required: false
      }
    }
    const { getByTestId, container } = render(
      <BrowserRouter>
        <ProgressField {...props} />
      </BrowserRouter>
    )
    const component = getByTestId('progress-field__name_null_not-required_error')
    expect(component).toBeDefined()
    expect(component).not.toBeNull()
    expect(container).toMatchSnapshot()
  })
  test('renders in case field not required and invalid', async () => {
    const props = {
      fieldInfo: {
        section: 'Tool Information',
        name: 'Name',
        index: null,
        status: 'Invalid',
        required: false
      }
    }
    const { getByTestId, container } = render(
      <BrowserRouter>
        <ProgressField {...props} />
      </BrowserRouter>
    )
    const component = getByTestId('progress-field__name_null_not-required_invalid')
    expect(component).toBeDefined()
    expect(component).not.toBeNull()
    expect(container).toMatchSnapshot()
  })
  test('renders in case field not required and empty', async () => {
    const props = {
      fieldInfo: {
        section: 'Tool Information',
        name: 'Name',
        index: null,
        status: 'Not Started',
        required: false
      }
    }
    const { getByTestId, container } = render(
      <BrowserRouter>
        <ProgressField {...props} />
      </BrowserRouter>
    )
    const component = getByTestId('progress-field__name_null_not-required_not-started')
    expect(component).toBeDefined()
    expect(component).not.toBeNull()
    expect(container).toMatchSnapshot()
  })
  test('renders in case field status unknown', async () => {
    const props = {
      fieldInfo: {
        section: 'Tool Information',
        name: 'Name',
        index: null,
        status: 'Made Up',
        required: false
      }
    }
    const { getByTestId, container } = render(
      <BrowserRouter>
        <ProgressField {...props} />
      </BrowserRouter>
    )
    const component = getByTestId('progress-field__name_null_not-required_made-up')
    expect(component).toBeDefined()
    expect(component).not.toBeNull()
    expect(container).toMatchSnapshot()
  })
})
describe('Progress field navigation test single field', () => {
  test('navigate to edit a single field', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const props = {
      fieldInfo: {
        section: 'Tool Information',
        name: 'Name',
        index: null,
        status: 'Pass',
        required: true
      },
      editor

    }
    const { getByTestId, queryByTestId, container } = render(
      <BrowserRouter>
        <ProgressField {...props} />
      </BrowserRouter>
    )
    const spy = jest.spyOn(ProgressField.WrappedComponent.prototype, 'navigateTo')
    const component = getByTestId('progress-field__name_null_required_pass')
    const clickField = queryByTestId('progress-field__name_link')
    fireEvent.click(clickField)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(component).toBeDefined()
    expect(component).not.toBeNull()
    expect(container).toMatchSnapshot()
  })
})
