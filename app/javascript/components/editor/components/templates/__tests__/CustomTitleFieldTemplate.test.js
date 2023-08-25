import React from 'react'
import {
  render, screen
} from '@testing-library/react'
import CustomTitleFieldTemplate from '../CustomTitleFieldTemplate'
import MetadataEditor from '../../../MetadataEditor'
import UmmToolsModel from '../../../model/UmmToolsModel'

jest.useFakeTimers()

describe('CustomTitleFieldTest', () => {
  it('renders a default title', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)

    CustomTitleFieldTemplate.prototype.executeScroll = jest.fn()

    render(<CustomTitleFieldTemplate
      title="My Custom Title"
      required
      registry={{
        formContext: {
          editor
        }
      }}
      className="MyTitle"
    />)

    expect(screen.getByTestId('custom-title-field-template--heading')).toHaveTextContent('My Custom Title')
    expect(screen.getByTestId('custom-title-field-template--required')).toBeTruthy()
  })

  it('renders a default ui:title', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)

    CustomTitleFieldTemplate.prototype.executeScroll = jest.fn()

    render(<CustomTitleFieldTemplate
      title="My Custom Title"
      uiSchema={{ options: { title: 'My UI Title' } }}
      required
      registry={{
        formContext: {
          editor
        }
      }}
      className="MyTitle"
    />)

    expect(screen.getByTestId('custom-title-field-template--heading')).toHaveTextContent('My UI Title')
    expect(screen.getByTestId('custom-title-field-template--required')).toBeTruthy()
  })

  it('does not render title when ui:hide-header is set to true', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)

    CustomTitleFieldTemplate.prototype.executeScroll = jest.fn()

    render(<CustomTitleFieldTemplate
      title="My Custom Title"
      uiSchema={{ 'ui:hide-header': true, 'ui:required': true }}
      required
      registry={{
        formContext: {
          editor
        }
      }}
      className="MyTitle"
    />)

    expect(screen.getByTestId('custom-title-field-template--heading')).toHaveTextContent('')
  })

  it('can focus', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    editor.setFocusField('MyCustomTitle')

    HTMLElement.prototype.scrollIntoView = jest.fn()
    const mockSetTimeout = jest.fn()

    render(<CustomTitleFieldTemplate
      title="My Custom Title"
      required={false}
      registry={{
        formContext: {
          editor
        }
      }}
      className="MyTitle"
    />)
    jest.runAllTimers(mockSetTimeout)

    expect(screen.getByTestId('custom-title-field-template--heading')).toHaveTextContent('My Custom Title')
    expect(screen.queryByTestId('custom-title-field-template--required')).toBeFalsy()
    expect(HTMLElement.prototype.scrollIntoView).toBeCalled()
  })
})
