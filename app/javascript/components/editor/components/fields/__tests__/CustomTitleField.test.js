import React from 'react'
import {
  render, screen
} from '@testing-library/react'
import CustomTitleField from '../CustomTitleField'
import MetadataEditor from '../../../MetadataEditor'
import UmmToolsModel from '../../../model/UmmToolsModel'

jest.useFakeTimers()

describe('CustomTitleFieldTest', () => {
  it('renders a default title', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)

    CustomTitleField.prototype.executeScroll = jest.fn()

    render(<CustomTitleField
      title="My Custom Title"
      required
      registry={{
        formContext: {
          editor
        }
      }}
      className="MyTitle"
    />)

    expect(screen.getByTestId('custom-title-field--heading')).toHaveTextContent('My Custom Title')
    expect(screen.getByTestId('custom-title-field--required')).toBeTruthy()
  })

  it('renders a default ui:title', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)

    CustomTitleField.prototype.executeScroll = jest.fn()

    render(<CustomTitleField
      title="My Custom Title"
      required
      registry={{
        formContext: {
          editor
        }
      }}
      className="MyTitle"
    />)

    expect(screen.getByTestId('custom-title-field--heading')).toHaveTextContent('My Custom Title')
    expect(screen.getByTestId('custom-title-field--required')).toBeTruthy()
  })

  it('can focus', async () => {
    const model = new UmmToolsModel()
    const editor = new MetadataEditor(model)
    editor.setFocusField('MyCustomTitle')

    HTMLElement.prototype.scrollIntoView = jest.fn()
    const mockSetTimeout = jest.fn()

    render(<CustomTitleField
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

    expect(screen.getByTestId('custom-title-field--heading')).toHaveTextContent('My Custom Title')
    expect(screen.queryByTestId('custom-title-field--required')).toBeFalsy()
    expect(HTMLElement.prototype.scrollIntoView).toBeCalled()
  })
})
