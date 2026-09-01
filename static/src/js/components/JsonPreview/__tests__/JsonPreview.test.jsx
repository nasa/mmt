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

// A controlled-vocabulary field expressed as `oneOf: [{ const: ... }]`
// rather than a plain `enum`. This is the pattern that was silently passing
// validation before the fix: the blanket oneOf/anyOf filter was dropping
// this error along with the legitimate required-field noise, even though
// there's no missing-required-field involved here at all.
const mockEnumAsOneOfSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    Status: {
      oneOf: [
        {
          const: 'Active',
          title: 'Active'
        },
        {
          const: 'Inactive',
          title: 'Inactive'
        }
      ]
    }
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

// Opens the edit modal and replaces its textarea contents with `jsonText`.
const openEditorAndType = async (user, jsonText) => {
  await user.click(screen.getByRole('button', { name: 'Edit JSON' }))

  const textarea = screen.getByRole('textbox', { name: 'Editable JSON metadata' })

  await user.clear(textarea)
  await user.type(textarea, jsonText, { skipClick: true })

  return textarea
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
    test('renders an Edit JSON button and no modal', () => {
      setup({
        ummMetadata: {
          Name: 'Mock Name'
        }
      })

      expect(screen.getByRole('button', { name: 'Edit JSON' })).toBeInTheDocument()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.queryByRole('textbox', { name: 'Editable JSON metadata' })).not.toBeInTheDocument()
    })
  })

  describe('when the user clicks Edit JSON', () => {
    test('opens a modal with a textarea pre-populated with the current JSON', async () => {
      const user = userEvent.setup()

      setup({
        ummMetadata: {
          Name: 'Mock Name'
        }
      })

      await user.click(screen.getByRole('button', { name: 'Edit JSON' }))

      const dialog = screen.getByRole('dialog', { name: 'Edit JSON' })
      const textarea = screen.getByRole('textbox', { name: 'Editable JSON metadata' })

      expect(dialog).toBeInTheDocument()
      expect(textarea).toBeInTheDocument()
      expect(textarea.value).toContain('"Name": "Mock Name"')

      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })
  })

  describe('when the user edits the JSON and clicks Save', () => {
    test('calls setDraft with the parsed JSON merged into the draft and closes the modal', async () => {
      const user = userEvent.setup()

      const { setDraft } = setup({
        nativeId: 'MOCK-123',
        ummMetadata: {
          Name: 'Mock Name'
        }
      })

      await openEditorAndType(user, '{{"Name": "Updated Name"}')

      await user.click(screen.getByRole('button', { name: 'Save' }))

      expect(setDraft).toHaveBeenCalledTimes(1)
      expect(setDraft).toHaveBeenCalledWith({
        nativeId: 'MOCK-123',
        ummMetadata: {
          Name: 'Updated Name'
        }
      })

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.queryByRole('textbox', { name: 'Editable JSON metadata' })).not.toBeInTheDocument()
    })
  })

  describe('when the user enters invalid JSON and clicks Save', () => {
    test('shows an inline error, does not call setDraft, does not open a confirmation modal, and stays in edit mode', async () => {
      const user = userEvent.setup()

      const { setDraft } = setup({
        ummMetadata: {
          Name: 'Mock Name'
        }
      })

      await openEditorAndType(user, '{{ this is not valid json')

      await user.click(screen.getByRole('button', { name: 'Save' }))

      expect(setDraft).not.toHaveBeenCalled()
      expect(screen.getByRole('alert')).toHaveTextContent(/Invalid JSON/)

      // A parse failure isn't something a "save anyway" confirmation makes
      // sense for -- there's no parsed data to save.
      expect(screen.queryByRole('dialog', { name: 'Confirm Save' })).not.toBeInTheDocument()

      // Should remain in the edit modal with Save/Cancel still present
      expect(screen.getByRole('dialog', { name: 'Edit JSON' })).toBeInTheDocument()
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

      const textarea = await openEditorAndType(user, '{{ not valid')

      await user.click(screen.getByRole('button', { name: 'Save' }))

      expect(screen.getByRole('alert')).toBeInTheDocument()

      await user.type(textarea, 'a')

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('when the user clicks Cancel after editing', () => {
    test('discards changes, does not call setDraft, and closes the modal', async () => {
      const user = userEvent.setup()

      const { setDraft } = setup({
        ummMetadata: {
          Name: 'Mock Name'
        }
      })

      await openEditorAndType(user, '{{"Name": "Should Not Save"}')

      await user.click(screen.getByRole('button', { name: 'Cancel' }))

      expect(setDraft).not.toHaveBeenCalled()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      // Re-opening edit mode should show the original (unsaved-change-free) JSON again
      await user.click(screen.getByRole('button', { name: 'Edit JSON' }))

      expect(screen.getByRole('textbox', { name: 'Editable JSON metadata' }).value).toContain('"Name": "Mock Name"')
    })
  })

  describe('when a schema prop is provided', () => {
    describe('when the edited JSON is only missing a required field', () => {
      test('saves immediately with no confirmation, since missing-required-field errors are ignored', async () => {
        const user = userEvent.setup()

        const { setDraft } = setup({
          ummMetadata: {
            Name: 'Mock Name'
          }
        }, { schema: mockSchema })

        // Removes the required `Name` field entirely
        await openEditorAndType(user, '{{}')

        await user.click(screen.getByRole('button', { name: 'Save' }))

        expect(setDraft).toHaveBeenCalledTimes(1)
        expect(setDraft).toHaveBeenCalledWith({
          ummMetadata: {}
        })

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    describe('when the edited JSON has an unknown/typo\'d field name', () => {
      test('opens a confirmation modal naming the offending field, and does not save yet', async () => {
        const user = userEvent.setup()

        const { setDraft } = setup({
          ummMetadata: {
            Name: 'Mock Name'
          }
        }, { schema: mockSchema })

        await openEditorAndType(user, '{{"Name": "Mock Name", "Nmae": "typo"}')

        await user.click(screen.getByRole('button', { name: 'Save' }))

        expect(setDraft).not.toHaveBeenCalled()

        const confirmDialog = screen.getByRole('dialog', { name: 'Confirm Save' })

        expect(confirmDialog).toHaveTextContent(/Nmae/)
        expect(confirmDialog).toHaveTextContent(/must NOT have additional property/)
        expect(confirmDialog).toHaveTextContent(/would you like to proceed/i)

        // The edit modal stays open underneath, with the unsaved text intact
        expect(screen.getByRole('dialog', { name: 'Edit JSON' })).toBeInTheDocument()
        expect(screen.getByRole('textbox', { name: 'Editable JSON metadata' }).value).toContain('Nmae')
      })

      test('clicking "Yes, save anyway" saves the structurally-invalid JSON and closes both modals', async () => {
        const user = userEvent.setup()

        const { setDraft } = setup({
          ummMetadata: {
            Name: 'Mock Name'
          }
        }, { schema: mockSchema })

        await openEditorAndType(user, '{{"Name": "Mock Name", "Nmae": "typo"}')
        await user.click(screen.getByRole('button', { name: 'Save' }))

        await user.click(screen.getByRole('button', { name: 'Save & Continue' }))

        expect(setDraft).toHaveBeenCalledTimes(1)
        expect(setDraft).toHaveBeenCalledWith({
          ummMetadata: {
            Name: 'Mock Name',
            Nmae: 'typo'
          }
        })

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      test('clicking "No, go back" closes the confirmation modal without saving, keeping the edit modal open', async () => {
        const user = userEvent.setup()

        const { setDraft } = setup({
          ummMetadata: {
            Name: 'Mock Name'
          }
        }, { schema: mockSchema })

        await openEditorAndType(user, '{{"Name": "Mock Name", "Nmae": "typo"}')
        await user.click(screen.getByRole('button', { name: 'Save' }))

        await user.click(screen.getByRole('button', { name: 'Back' }))

        expect(setDraft).not.toHaveBeenCalled()
        expect(screen.queryByRole('dialog', { name: 'Confirm Save' })).not.toBeInTheDocument()

        const editDialog = screen.getByRole('dialog', { name: 'Edit JSON' })

        expect(editDialog).toBeInTheDocument()
        expect(screen.getByRole('textbox', { name: 'Editable JSON metadata' }).value).toContain('Nmae')
      })
    })

    describe('when the edited JSON has a value of the wrong type', () => {
      test('opens a confirmation modal with the type error', async () => {
        const user = userEvent.setup()

        const { setDraft } = setup({
          ummMetadata: {
            Name: 'Mock Name'
          }
        }, { schema: mockSchema })

        await openEditorAndType(user, '{{"Name": "Mock Name", "Age": "not a number"}')

        await user.click(screen.getByRole('button', { name: 'Save' }))

        expect(setDraft).not.toHaveBeenCalled()

        const confirmDialog = screen.getByRole('dialog', { name: 'Confirm Save' })

        expect(confirmDialog).toHaveTextContent(/Age/)
        expect(confirmDialog).toHaveTextContent(/must be number/)
      })
    })

    describe('when the edited JSON has an invalid value for a oneOf/const-style enum field', () => {
      test('opens a confirmation modal instead of silently saving the invalid value', async () => {
        const user = userEvent.setup()

        const { setDraft } = setup({
          ummMetadata: {
            Status: 'Active'
          }
        }, { schema: mockEnumAsOneOfSchema })

        // "Bogus" doesn't match either const branch, and there's no
        // required-field error at this path to (correctly) suppress it
        await openEditorAndType(user, '{{"Status": "Bogus"}')

        await user.click(screen.getByRole('button', { name: 'Save' }))

        expect(setDraft).not.toHaveBeenCalled()

        const confirmDialog = screen.getByRole('dialog', { name: 'Confirm Save' })

        expect(confirmDialog).toHaveTextContent(/Status/)
        expect(confirmDialog).toHaveTextContent(/would you like to proceed/i)
      })

      test('clicking "Save & Continue" saves the invalid enum value', async () => {
        const user = userEvent.setup()

        const { setDraft } = setup({
          ummMetadata: {
            Status: 'Active'
          }
        }, { schema: mockEnumAsOneOfSchema })

        await openEditorAndType(user, '{{"Status": "Bogus"}')
        await user.click(screen.getByRole('button', { name: 'Save' }))
        await user.click(screen.getByRole('button', { name: 'Save & Continue' }))

        expect(setDraft).toHaveBeenCalledTimes(1)
        expect(setDraft).toHaveBeenCalledWith({
          ummMetadata: {
            Status: 'Bogus'
          }
        })
      })

      test('a valid enum value saves immediately with no confirmation', async () => {
        const user = userEvent.setup()

        const { setDraft } = setup({
          ummMetadata: {
            Status: 'Active'
          }
        }, { schema: mockEnumAsOneOfSchema })

        await openEditorAndType(user, '{{"Status": "Inactive"}')

        await user.click(screen.getByRole('button', { name: 'Save' }))

        expect(setDraft).toHaveBeenCalledTimes(1)
        expect(setDraft).toHaveBeenCalledWith({
          ummMetadata: {
            Status: 'Inactive'
          }
        })

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    describe('when the edited JSON has both a missing required field and a structural error', () => {
      test('the confirmation modal names only the structural error, the required error is omitted', async () => {
        const user = userEvent.setup()

        const { setDraft } = setup({
          ummMetadata: {
            Name: 'Mock Name'
          }
        }, { schema: mockSchema })

        // Missing required `Name`, and has an unknown field `Nmae`
        await openEditorAndType(user, '{{"Nmae": "typo"}')

        await user.click(screen.getByRole('button', { name: 'Save' }))

        expect(setDraft).not.toHaveBeenCalled()

        const confirmDialog = screen.getByRole('dialog', { name: 'Confirm Save' })

        expect(confirmDialog).toHaveTextContent(/Nmae/)
        expect(confirmDialog).not.toHaveTextContent(/"required"/)

        // A single structural error still renders as a one-item list
        expect(screen.getAllByRole('listitem')).toHaveLength(1)
      })
    })

    describe('when the edited JSON is missing the required field in every oneOf branch', () => {
      test('saves immediately with no confirmation, since the oneOf wrapper error is noise from the required errors', async () => {
        const user = userEvent.setup()

        const { setDraft } = setup({
          ummMetadata: {
            Name: 'Mock Name'
          }
        }, { schema: mockOneOfSchema })

        // Satisfies neither branch: no `Name` and no `Nickname`
        await openEditorAndType(user, '{{"Age": 5}')

        await user.click(screen.getByRole('button', { name: 'Save' }))

        expect(setDraft).toHaveBeenCalledTimes(1)
        expect(setDraft).toHaveBeenCalledWith({
          ummMetadata: {
            Age: 5
          }
        })

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    describe('when the edited JSON has an unknown field under a oneOf schema', () => {
      test('still opens a confirmation modal for the structural error, even though the oneOf wrapper error is ignored', async () => {
        const user = userEvent.setup()

        const { setDraft } = setup({
          ummMetadata: {
            Name: 'Mock Name'
          }
        }, { schema: mockOneOfSchema })

        // Satisfies the `Name` branch, but also has a typo'd unknown field
        await openEditorAndType(user, '{{"Name": "Mock Name", "Nmae": "typo"}')

        await user.click(screen.getByRole('button', { name: 'Save' }))

        expect(setDraft).not.toHaveBeenCalled()

        const confirmDialog = screen.getByRole('dialog', { name: 'Confirm Save' })

        expect(confirmDialog).toHaveTextContent(/Nmae/)
        expect(confirmDialog).toHaveTextContent(/must NOT have additional property/)
      })
    })

    describe('when the edited JSON has multiple structural errors', () => {
      test('renders each error as a separate list item in the confirmation modal', async () => {
        const user = userEvent.setup()

        const { setDraft } = setup({
          ummMetadata: {
            Name: 'Mock Name'
          }
        }, { schema: mockSchema })

        await openEditorAndType(user, '{{"Name": "Mock Name", "Nmae": "typo", "Aeg": "typo2"}')

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
