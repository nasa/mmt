import React, { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import BulkActionsUpdateValueEditor from '../BulkActionsUpdateValueEditor'

// Mock CodeMirror to render a standard textarea, so userEvent.type works easily and the
// test isn't relying on CodeMirror's own (jsdom-unfriendly) contenteditable behavior --
// matches the pattern used by JsonPreview's tests, which wrap the same editor.
vi.mock('@uiw/react-codemirror', () => ({
  __esModule: true,
  default: ({ value, onChange }) => (
    <textarea
      aria-label="updateValue JSON"
      value={value || ''}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
    />
  )
}))

const fields = [
  {
    key: 'ShortName',
    type: 'text'
  },
  {
    key: 'LongName',
    type: 'text'
  }
]

describe('BulkActionsUpdateValueEditor component', () => {
  test('renders the provided JSON text', () => {
    render(
      <BulkActionsUpdateValueEditor
        fields={fields}
        allowMultiple={false}
        value={JSON.stringify({ ShortName: '' }, null, 2)}
        onChange={vi.fn()}
      />
    )

    expect(screen.getByLabelText('updateValue JSON')).toHaveValue(
      JSON.stringify({ ShortName: '' }, null, 2)
    )
  })

  test('calls onChange with the edited JSON text', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    // A stateful wrapper, since a controlled textarea whose value prop never updates
    // can't actually be typed into character-by-character.
    const Wrapper = () => {
      const [value, setValue] = useState('')

      return (
        <BulkActionsUpdateValueEditor
          fields={fields}
          allowMultiple={false}
          value={value}
          onChange={
            (nextValue) => {
              setValue(nextValue)
              onChange(nextValue)
            }
          }
        />
      )
    }

    render(<Wrapper />)

    const editor = screen.getByLabelText('updateValue JSON')

    await user.type(editor, '{{"ShortName": "NASA/GSFC"}')

    expect(onChange).toHaveBeenLastCalledWith('{"ShortName": "NASA/GSFC"}')
  })
})
