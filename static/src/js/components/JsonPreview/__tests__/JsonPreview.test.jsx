import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import JSONPretty from 'react-json-pretty'

import JsonPreview from '../JsonPreview'
import AppContext from '../../../context/AppContext'

vi.mock('react-json-pretty')

const mockSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['Name'],
  properties: {
    Name: { type: 'string' },
    Age: { type: 'number' }
  }
}

// A discriminated-union-style schema: a valid document must satisfy exactly
// one of the two branches below. Each branch has its own required field, so
// AJV reports a missing branch field as both a `required` error *and* a
// wrapping `oneOf` error ("must match a schema in oneOf") at the root.
const mockOneOfSchema = {
  type: 'object',
  additionalProperties: false,
  oneOf: [
    {
      required: ['Name'],
      properties: {
        Name: { type: 'string' },
        Age: { type: 'number' }
      }
    },
    {
      required: ['Nickname'],
      properties: {
        Nickname: { type: 'string' },
        Age: { type: 'number' }
      }
    }
  ],
  properties: {
    Name: { type: 'string' },
    Nickname: { type: 'string' },
    Age: { type: 'number' }
  }
}

const setup = (draft = undefined, { schema = null } = {}) => {
  const setDraft = vi.fn()

  const { rerender } = render(
    <AppContext.Provider
      value={
        {
          draft,
          setDraft
        }
      }
    >
      <JsonPreview schema={schema} />
    </AppContext.Provider>
  )

  // Allows a test to simulate the draft changing out from under JsonPreview
  // (e.g. the UI form calling its own setDraft) by re-rendering with a new
  // draft, without going through JsonPreview's own setDraft mock.
  const rerenderWithDraft = (nextDraft) => {
    rerender(
      <AppContext.Provider
        value={
          {
            draft: nextDraft,
            setDraft
          }
        }
      >
        <JsonPreview schema={schema} />
      </AppContext.Provider>
    )
  }

  return {
    setDraft,
    rerenderWithDraft
  }
}

describe('JsonPreview Component', () => {
  describe('when draft is not present in the context', () => {
    test('renders JSONPretty', () => {
      setup()

      expect(JSONPretty).toHaveBeenCalledTimes(1)
      expect(JSONPretty).toHaveBeenCalledWith(expect.objectContaining({
        data: {}
      }), {})
    })
  })

  describe('when draft is null', () => {
    test('renders JSONPretty with empty object', () => {
      setup(null)

      expect(JSONPretty).toHaveBeenCalledTimes(1)
      expect(JSONPretty).toHaveBeenCalledWith(expect.objectContaining({
        data: {}
      }), {})
    })
  })

  describe('when ummMetadata is not present in draft', () => {
    test('renders JSONPretty', () => {
      setup({})

      expect(JSONPretty).toHaveBeenCalledTimes(1)
      expect(JSONPretty).toHaveBeenCalledWith(expect.objectContaining({
        data: {}
      }), {})
    })
  })

  describe('when draft metadata exists', () => {
    test('renders JSONPretty', () => {
      setup({
        ummMetadata: {
          Name: 'Mock Name'
        }
      })

      expect(JSONPretty).toHaveBeenCalledTimes(1)
      expect(JSONPretty).toHaveBeenCalledWith(expect.objectContaining({
        data: {
          Name: 'Mock Name'
        }
      }), {})
    })
  })

  describe('when in view mode', () => {
    test('renders an Edit JSON button and no textarea', () => {
      setup({
        ummMetadata: {
          Name: 'Mock Name'
        }
      })

      expect(screen.getByRole('button', { name: 'Edit JSON' })).toBeInTheDocument()
      expect(screen.queryByRole('textbox', { name: 'Editable JSON metadata' })).not.toBeInTheDocument()
    })
  })

  describe('when the user clicks Edit JSON', () => {
    test('shows a textarea pre-populated with the current JSON and hides JSONPretty', async () => {
      const user = userEvent.setup()

      setup({
        ummMetadata: {
          Name: 'Mock Name'
        }
      })

      await user.click(screen.getByRole('button', { name: 'Edit JSON' }))

      const textarea = screen.getByRole('textbox', { name: 'Editable JSON metadata' })

      expect(textarea).toBeInTheDocument()
      expect(textarea.value).toContain('"Name": "Mock Name"')

      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Edit JSON' })).not.toBeInTheDocument()
    })
  })

  describe('when the user edits the JSON and clicks Save', () => {
    test('calls setDraft with the parsed JSON merged into the draft and returns to view mode', async () => {
      const user = userEvent.setup()

      const { setDraft } = setup({
        nativeId: 'MOCK-123',
        ummMetadata: {
          Name: 'Mock Name'
        }
      })

      await user.click(screen.getByRole('button', { name: 'Edit JSON' }))

      const textarea = screen.getByRole('textbox', { name: 'Editable JSON metadata' })

      await user.clear(textarea)
      await user.type(textarea, '{{"Name": "Updated Name"}', { skipClick: true })

      await user.click(screen.getByRole('button', { name: 'Save' }))

      expect(setDraft).toHaveBeenCalledTimes(1)
      expect(setDraft).toHaveBeenCalledWith({
        nativeId: 'MOCK-123',
        ummMetadata: {
          Name: 'Updated Name'
        }
      })

      expect(screen.getByRole('button', { name: 'Edit JSON' })).toBeInTheDocument()
      expect(screen.queryByRole('textbox', { name: 'Editable JSON metadata' })).not.toBeInTheDocument()
    })
  })

  describe('when the user enters invalid JSON and clicks Save', () => {
    test('shows an error message, does not call setDraft, and stays in edit mode', async () => {
      const user = userEvent.setup()

      const { setDraft } = setup({
        ummMetadata: {
          Name: 'Mock Name'
        }
      })

      await user.click(screen.getByRole('button', { name: 'Edit JSON' }))

      const textarea = screen.getByRole('textbox', { name: 'Editable JSON metadata' })

      await user.clear(textarea)
      await user.type(textarea, '{{ this is not valid json', { skipClick: true })

      await user.click(screen.getByRole('button', { name: 'Save' }))

      expect(setDraft).not.toHaveBeenCalled()
      expect(screen.getByRole('alert')).toHaveTextContent(/Invalid JSON/)

      // Should remain in edit mode with the Save/Cancel buttons still present
      expect(screen.getByRole('textbox', { name: 'Editable JSON metadata' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    })

    test('clears the error once the user starts typing again', async () => {
      const user = userEvent.setup()

      setup({
        ummMetadata: {
          Name: 'Mock Name'
        }
      })

      await user.click(screen.getByRole('button', { name: 'Edit JSON' }))

      const textarea = screen.getByRole('textbox', { name: 'Editable JSON metadata' })

      await user.clear(textarea)
      await user.type(textarea, '{{ not valid', { skipClick: true })
      await user.click(screen.getByRole('button', { name: 'Save' }))

      expect(screen.getByRole('alert')).toBeInTheDocument()

      await user.type(textarea, 'a')

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('when the user clicks Cancel after editing', () => {
    test('discards changes, does not call setDraft, and returns to view mode', async () => {
      const user = userEvent.setup()

      const { setDraft } = setup({
        ummMetadata: {
          Name: 'Mock Name'
        }
      })

      await user.click(screen.getByRole('button', { name: 'Edit JSON' }))

      const textarea = screen.getByRole('textbox', { name: 'Editable JSON metadata' })

      await user.clear(textarea)
      await user.type(textarea, '{{"Name": "Should Not Save"}', { skipClick: true })

      await user.click(screen.getByRole('button', { name: 'Cancel' }))

      expect(setDraft).not.toHaveBeenCalled()
      expect(screen.getByRole('button', { name: 'Edit JSON' })).toBeInTheDocument()
      expect(screen.queryByRole('textbox', { name: 'Editable JSON metadata' })).not.toBeInTheDocument()

      // Re-opening edit mode should show the original (unsaved-change-free) JSON again
      await user.click(screen.getByRole('button', { name: 'Edit JSON' }))

      expect(screen.getByRole('textbox', { name: 'Editable JSON metadata' }).value).toContain('"Name": "Mock Name"')
    })
  })

  describe('when the draft changes externally while editing (e.g. the UI form was saved)', () => {
    test('exits edit mode, discards the stale buffer, and shows the new data', async () => {
      const user = userEvent.setup()

      const { setDraft, rerenderWithDraft } = setup({
        ummMetadata: {
          Name: 'Mock Name'
        }
      })

      await user.click(screen.getByRole('button', { name: 'Edit JSON' }))

      const textarea = screen.getByRole('textbox', { name: 'Editable JSON metadata' })

      // Make an unsaved edit in the JSON textarea
      await user.clear(textarea)
      await user.type(textarea, '{{"Name": "Unsaved JSON Edit"}', { skipClick: true })

      expect(screen.getByRole('textbox', { name: 'Editable JSON metadata' })).toBeInTheDocument()

      // Simulate the UI form changing the draft concurrently (its own
      // onChange -> setDraft), independent of anything JsonPreview did
      rerenderWithDraft({
        ummMetadata: {
          Name: 'Changed From UI Form'
        }
      })

      // JsonPreview should have bailed out of edit mode rather than let a
      // later Save clobber the newer data with the stale JSON buffer
      expect(screen.queryByRole('textbox', { name: 'Editable JSON metadata' })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Edit JSON' })).toBeInTheDocument()
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()

      expect(JSONPretty).toHaveBeenLastCalledWith(expect.objectContaining({
        data: {
          Name: 'Changed From UI Form'
        }
      }), {})

      // JsonPreview's own setDraft should never have been called -- the
      // change came from elsewhere
      expect(setDraft).not.toHaveBeenCalled()

      // Re-entering edit mode should now start from the fresh data, not the
      // discarded buffer
      await user.click(screen.getByRole('button', { name: 'Edit JSON' }))

      expect(screen.getByRole('textbox', { name: 'Editable JSON metadata' }).value)
        .toContain('"Name": "Changed From UI Form"')
    })

    test('does not exit edit mode when the draft is re-rendered with the same data', async () => {
      const user = userEvent.setup()

      const { rerenderWithDraft } = setup({
        ummMetadata: {
          Name: 'Mock Name'
        }
      })

      await user.click(screen.getByRole('button', { name: 'Edit JSON' }))

      const textarea = screen.getByRole('textbox', { name: 'Editable JSON metadata' })

      await user.clear(textarea)
      await user.type(textarea, '{{"Name": "Unsaved JSON Edit"}', { skipClick: true })

      // Re-render with an equivalent (not just equal-by-reference) draft --
      // this should NOT be treated as an external change
      rerenderWithDraft({
        ummMetadata: {
          Name: 'Mock Name'
        }
      })

      const stillTextarea = screen.getByRole('textbox', { name: 'Editable JSON metadata' })

      expect(stillTextarea).toBeInTheDocument()
      expect(stillTextarea.value).toContain('"Name": "Unsaved JSON Edit"')
    })
  })

  describe('when a schema prop is provided', () => {
    describe('when the edited JSON is only missing a required field', () => {
      test('saves anyway, since missing-required-field errors are ignored', async () => {
        const user = userEvent.setup()

        const { setDraft } = setup({
          ummMetadata: {
            Name: 'Mock Name'
          }
        }, { schema: mockSchema })

        await user.click(screen.getByRole('button', { name: 'Edit JSON' }))

        const textarea = screen.getByRole('textbox', { name: 'Editable JSON metadata' })

        // Removes the required `Name` field entirely
        await user.clear(textarea)
        await user.type(textarea, '{{}', { skipClick: true })

        await user.click(screen.getByRole('button', { name: 'Save' }))

        expect(setDraft).toHaveBeenCalledTimes(1)
        expect(setDraft).toHaveBeenCalledWith({
          ummMetadata: {}
        })

        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Edit JSON' })).toBeInTheDocument()
      })
    })

    describe('when the edited JSON has an unknown/typo\'d field name', () => {
      test('blocks the save, names the offending field, and stays in edit mode', async () => {
        const user = userEvent.setup()

        const { setDraft } = setup({
          ummMetadata: {
            Name: 'Mock Name'
          }
        }, { schema: mockSchema })

        await user.click(screen.getByRole('button', { name: 'Edit JSON' }))

        const textarea = screen.getByRole('textbox', { name: 'Editable JSON metadata' })

        await user.clear(textarea)
        await user.type(textarea, '{{"Name": "Mock Name", "Nmae": "typo"}', { skipClick: true })

        await user.click(screen.getByRole('button', { name: 'Save' }))

        expect(setDraft).not.toHaveBeenCalled()

        const alert = screen.getByRole('alert')

        expect(alert).toHaveTextContent(/Nmae/)
        expect(alert).toHaveTextContent(/must NOT have additional property/)

        expect(screen.getByRole('textbox', { name: 'Editable JSON metadata' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
      })
    })

    describe('when the edited JSON has a value of the wrong type', () => {
      test('blocks the save and shows the type error', async () => {
        const user = userEvent.setup()

        const { setDraft } = setup({
          ummMetadata: {
            Name: 'Mock Name'
          }
        }, { schema: mockSchema })

        await user.click(screen.getByRole('button', { name: 'Edit JSON' }))

        const textarea = screen.getByRole('textbox', { name: 'Editable JSON metadata' })

        await user.clear(textarea)
        await user.type(textarea, '{{"Name": "Mock Name", "Age": "not a number"}', { skipClick: true })

        await user.click(screen.getByRole('button', { name: 'Save' }))

        expect(setDraft).not.toHaveBeenCalled()

        const alert = screen.getByRole('alert')

        expect(alert).toHaveTextContent(/Age/)
        expect(alert).toHaveTextContent(/must be number/)
      })
    })

    describe('when the edited JSON has both a missing required field and a structural error', () => {
      test('only the structural error is shown, the required error is omitted', async () => {
        const user = userEvent.setup()

        const { setDraft } = setup({
          ummMetadata: {
            Name: 'Mock Name'
          }
        }, { schema: mockSchema })

        await user.click(screen.getByRole('button', { name: 'Edit JSON' }))

        const textarea = screen.getByRole('textbox', { name: 'Editable JSON metadata' })

        // Missing required `Name`, and has an unknown field `Nmae`
        await user.clear(textarea)
        await user.type(textarea, '{{"Nmae": "typo"}', { skipClick: true })

        await user.click(screen.getByRole('button', { name: 'Save' }))

        expect(setDraft).not.toHaveBeenCalled()

        const alert = screen.getByRole('alert')

        expect(alert).toHaveTextContent(/Nmae/)
        expect(alert).not.toHaveTextContent(/required/)

        // A single error renders as plain text, not as a list
        expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
      })
    })

    describe('when the edited JSON is missing the required field in every oneOf branch', () => {
      test('saves anyway, since the resulting oneOf wrapper error is ignored along with the required errors', async () => {
        const user = userEvent.setup()

        const { setDraft } = setup({
          ummMetadata: {
            Name: 'Mock Name'
          }
        }, { schema: mockOneOfSchema })

        await user.click(screen.getByRole('button', { name: 'Edit JSON' }))

        const textarea = screen.getByRole('textbox', { name: 'Editable JSON metadata' })

        // Satisfies neither branch: no `Name` and no `Nickname`
        await user.clear(textarea)
        await user.type(textarea, '{{"Age": 5}', { skipClick: true })

        await user.click(screen.getByRole('button', { name: 'Save' }))

        expect(setDraft).toHaveBeenCalledTimes(1)
        expect(setDraft).toHaveBeenCalledWith({
          ummMetadata: {
            Age: 5
          }
        })

        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Edit JSON' })).toBeInTheDocument()
      })
    })

    describe('when the edited JSON has an unknown field under a oneOf schema', () => {
      test('still blocks the save on the structural error, even though the oneOf wrapper error is ignored', async () => {
        const user = userEvent.setup()

        const { setDraft } = setup({
          ummMetadata: {
            Name: 'Mock Name'
          }
        }, { schema: mockOneOfSchema })

        await user.click(screen.getByRole('button', { name: 'Edit JSON' }))

        const textarea = screen.getByRole('textbox', { name: 'Editable JSON metadata' })

        // Satisfies the `Name` branch, but also has a typo'd unknown field
        await user.clear(textarea)
        await user.type(textarea, '{{"Name": "Mock Name", "Nmae": "typo"}', { skipClick: true })

        await user.click(screen.getByRole('button', { name: 'Save' }))

        expect(setDraft).not.toHaveBeenCalled()

        const alert = screen.getByRole('alert')

        expect(alert).toHaveTextContent(/Nmae/)
        expect(alert).toHaveTextContent(/must NOT have additional property/)
      })
    })

    describe('when the edited JSON has multiple structural errors', () => {
      test('renders each error as a separate list item', async () => {
        const user = userEvent.setup()

        const { setDraft } = setup({
          ummMetadata: {
            Name: 'Mock Name'
          }
        }, { schema: mockSchema })

        await user.click(screen.getByRole('button', { name: 'Edit JSON' }))

        const textarea = screen.getByRole('textbox', { name: 'Editable JSON metadata' })

        await user.clear(textarea)
        await user.type(textarea, '{{"Name": "Mock Name", "Nmae": "typo", "Aeg": "typo2"}', { skipClick: true })

        await user.click(screen.getByRole('button', { name: 'Save' }))

        expect(setDraft).not.toHaveBeenCalled()

        const listItems = screen.getAllByRole('listitem')

        expect(listItems).toHaveLength(2)

        const combinedText = listItems.map((item) => item.textContent).join(' ')

        expect(combinedText).toContain('Nmae')
        expect(combinedText).toContain('Aeg')
      })
    })
  })
})
