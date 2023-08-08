import React from 'react'
import {
  render, waitFor, screen, act
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  BrowserRouter, MemoryRouter, Route, Routes
} from 'react-router-dom'
import CustomTextareaWidget from '../CustomTextareaWidget'
import UmmToolsModel from '../../../model/UmmToolsModel'
import MetadataEditor from '../../../MetadataEditor'
import MetadataEditorForm from '../../MetadataEditorForm'

describe('Custom Text Area Widget Component', () => {
  it('renders the custom Text area widget when required field with title', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const props = {
      label: 'my test area data label',
      registry: {
        formContext: { editor }
      },
      id: 'my_title',
      required: true,
      schema: {
        maxLength: 10
      },
      onChange: {}
    }

    const { getByTestId, container } = render(
      <BrowserRouter>
        <CustomTextareaWidget {...props} />
      </BrowserRouter>
    )
    expect(getByTestId('custom-text-area-widget__my-test-area-data-label--text-area-header')).toHaveTextContent('My Test Area Data Label0/10')
    expect(container).toMatchSnapshot()
  })

  it('renders the custom Text area widget when required field with no title', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const props = {
      label: 'my test area data label',
      required: true,
      registry: {
        formContext: { editor }
      },
      id: 'mock_id',
      schema: {
        maxLength: 10
      },
      onChange: {}
    }

    const { getByTestId, container } = render(
      <BrowserRouter>
        <CustomTextareaWidget {...props} />
      </BrowserRouter>
    )
    expect(getByTestId('custom-text-area-widget__my-test-area-data-label--text-area-header')).toHaveTextContent('My Test Area Data Label')
    expect(container).toMatchSnapshot()
  })

  it('renders the custom text area widget when not required field', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const props = {
      label: 'my test area data label',
      registry: {
        formContext: { editor }
      },
      id: 'my_title',
      required: false,
      schema: {
        maxLength: 10
      },
      onChange: {}
    }
    const { getByTestId, container } = render(
      <BrowserRouter>
        <CustomTextareaWidget {...props} />
      </BrowserRouter>
    )
    await act(async () => null) // Popper update() - https://github.com/popperjs/react-popper/issues/350
    expect(getByTestId('custom-text-area-widget__my-test-area-data-label--text-area-header')).not.toHaveTextContent('My Test Area Data Label 0/10')
    expect(container).toMatchSnapshot()
  })

  it('Make sure inputted text is shorter than max length', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const mockedOnChange = jest.fn()
    HTMLElement.prototype.scrollIntoView = jest.fn()

    const props = {
      label: 'my test area data label',
      registry: {
        formContext: { editor }
      },
      required: false,
      schema: {
        maxLength: 10
      },
      onChange: mockedOnChange,
      id: 'my_title'
    }
    const { getByTestId, container } = render(
      <BrowserRouter>
        <CustomTextareaWidget {...props} />
      </BrowserRouter>
    )
    await waitFor(async () => {
      const inputEl = getByTestId('custom-text-area-widget__my-test-area-data-label--text-area-input')
      userEvent.type(inputEl, 'test@mail.com')
    })
    expect(getByTestId('custom-text-area-widget__my-test-area-data-label--text-area-header')).toHaveTextContent('10/10')
    expect(getByTestId('custom-text-area-widget__my-test-area-data-label--text-area-input')).not.toHaveTextContent('test@mail.com')
    expect(container).toMatchSnapshot()
  })
  it('should call onChange on a first character', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    const mockedOnChange = jest.fn()
    const props = {
      label: 'my test area data label',
      registry: {
        formContext: { editor }
      },
      required: false,
      id: 'my_title',
      schema: {
        maxLength: 20
      },
      onChange: mockedOnChange,
      value: 'my initial text'
    }

    const { getByTestId, container } = render(
      <BrowserRouter>
        <CustomTextareaWidget {...props} />
      </BrowserRouter>
    )
    const myTextareaComponent = getByTestId('custom-text-area-widget__my-test-area-data-label--text-area-input')
    const myTextareaHeaderComponent = getByTestId('custom-text-area-widget__my-test-area-data-label--text-area-header')
    await waitFor(async () => {
      expect(myTextareaComponent).toBeDefined()
      expect(myTextareaComponent).not.toBeNull()
      expect(mockedOnChange).toHaveBeenCalledTimes(0)
      expect(myTextareaComponent.value).toBe('my initial text')
      userEvent.clear(myTextareaComponent)
      userEvent.type(myTextareaComponent, 'test@mail.com')
      expect(mockedOnChange).toHaveBeenCalledWith('test@mail.com')
      userEvent.type(myTextareaComponent, 'abc')
      expect(mockedOnChange).toHaveBeenCalledWith('test@mail.comabc')
      expect(mockedOnChange).toHaveBeenCalledTimes(17)
      expect(myTextareaHeaderComponent).toHaveTextContent('16/20')
      userEvent.type(myTextareaComponent, '1234567890')
      expect(myTextareaHeaderComponent).toHaveTextContent('20/20')
      expect(myTextareaComponent.value).toBe('test@mail.comabc1234')
      userEvent.tab()
    })
    expect(container).toMatchSnapshot()
  })

  test('testing autofocus for a custom text widget', async () => {
    const model = new UmmToolsModel()
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
      screen.queryByTestId('error-list-item__description').click()
      setTimeout(() => {
        expect(screen.queryAllByTestId('custom-text-area-widget--description-field__description')[0])
          .toHaveTextContent('A brief description of the web user interface or downloadable tool.')
        userEvent.tab()
      }, 200)
    })

    expect(container).toMatchSnapshot()
  })

  test('testing autofocus with good focus field', async () => {
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
    editor.setFocusField('PotentialAction_Target_Description')
    HTMLElement.prototype.scrollIntoView = jest.fn()
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/2/edit/Potential_Action']}>
        <Routes>
          <Route path="/tool_drafts/:id/edit/:sectionName" element={<MetadataEditorForm editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )
    await waitFor(async () => {
      expect(HTMLElement.prototype.scrollIntoView).toBeCalled()
    })
    expect(container).toMatchSnapshot()
  })

  test('testing autofocus with an illegal focus field', async () => {
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
    editor.setFocusField('PotentialAction_Target_IllegalFieldName')
    HTMLElement.prototype.scrollIntoView = jest.fn()
    const { container } = render(
      <MemoryRouter initialEntries={['/tool_drafts/2/edit/Potential_Action']}>
        <Routes>
          <Route path="/tool_drafts/:id/edit/:sectionName" element={<MetadataEditorForm editor={editor} />} />
        </Routes>
      </MemoryRouter>
    )
    await waitFor(async () => {
      expect(HTMLElement.prototype.scrollIntoView).toBeCalledTimes(0)
    })
    expect(container).toMatchSnapshot()
  })
})
