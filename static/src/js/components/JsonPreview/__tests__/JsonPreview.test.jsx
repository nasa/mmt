import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import JsonPreview from '../JsonPreview'
import AppContext from '../../../context/AppContext'

// Mock CodeMirror to render a standard textarea so userEvent.type works easily
vi.mock('@uiw/react-codemirror', () => ({
  __esModule: true,
  default: ({ value, onChange, editable }) => (
    <textarea
      aria-label={editable === false ? 'Read-only JSON metadata' : 'Editable JSON metadata'}
      value={value || ''}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      readOnly={editable === false}
    />
  )
}))

// Mock the diff viewer
vi.mock('react-codemirror-merge', () => {
  /* eslint-disable react/prop-types, react/display-name */
  const CodeMirrorMerge = ({ children }) => <div data-testid="diff-viewer">{children}</div>
  CodeMirrorMerge.Original = ({ value }) => <div data-testid="diff-original" data-value={value} />
  CodeMirrorMerge.Modified = ({ value }) => <div data-testid="diff-modified" data-value={value} />

  return {
    __esModule: true,
    default: CodeMirrorMerge
  }
})

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
// wrapping `oneOf` error ("must match a schema in oneOf") at the root. Only
// the `required` error is filtered -- the `oneOf` error is now surfaced too.
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
// rather than a plain `enum`. There's no missing-required-field involved
// here, so this exercises the oneOf error path independent of `required`.
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

// Grabs all the list items from the inline error banner
const errorListText = () => screen.getAllByRole('listitem').map((item) => item.textContent).join(' ')

describe('JsonPreview Component', () => {
  describe('when draft is not present in the context', () => {
    test('renders a read-only CodeMirror with an empty object', () => {
      setup()
      expect(screen.getByRole('textbox', { name: 'Read-only JSON metadata' })).toHaveValue('{}')
    })
  })

  describe('when draft is null', () => {
    test('renders a read-only CodeMirror with an empty object', () => {
      setup(null)
      expect(screen.getByRole('textbox', { name: 'Read-only JSON metadata' })).toHaveValue('{}')
    })
  })

  describe('when ummMetadata is not present in draft', () => {
    test('renders a read-only CodeMirror with an empty object', () => {
      setup({})
      expect(screen.getByRole('textbox', { name: 'Read-only JSON metadata' })).toHaveValue('{}')
    })
  })

  describe('when draft metadata exists', () => {
    test('renders a read-only CodeMirror with the formatted JSON', () => {
      setup({
        ummMetadata: {
          Name: 'Mock Name'
        }
      })

      const expectedJson = JSON.stringify({ Name: 'Mock Name' }, null, 2)
      expect(screen.getByRole('textbox', { name: 'Read-only JSON metadata' })).toHaveValue(expectedJson)
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
      expect(screen.queryByText('Editing JSON')).not.toBeInTheDocument()
      expect(screen.queryByText('Invalid JSON')).not.toBeInTheDocument()
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

      const textarea = screen.getByRole('textbox', { name: 'Editable JSON metadata' })

      expect(screen.getByText('Editing JSON')).toBeInTheDocument()
      expect(textarea).toBeInTheDocument()
      expect(textarea.value).toContain('"Name": "Mock Name"')

      expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })
  })

  describe('when the user clicks Copy JSON', () => {
    test('copies the current JSON to the clipboard', async () => {
      const user = userEvent.setup()
      setup({ ummMetadata: { Name: 'Mock Name' } })

      await openEditorAndType(user, '{{"Name": "Updated"}')
      await user.click(screen.getByRole('button', { name: 'Copy JSON' }))

      const clipboardText = await window.navigator.clipboard.readText()

      expect(clipboardText).toBe('{"Name": "Updated"}')

      expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument()
    })
  })

  describe('when the user edits the JSON and clicks Continue', () => {
    test('opens the diff modal, and clicking Apply saves to draft and closes all modals', async () => {
      const user = userEvent.setup()

      const { setDraft } = setup({
        nativeId: 'MOCK-123',
        ummMetadata: {
          Name: 'Mock Name'
        }
      })

      await openEditorAndType(user, '{{"Name": "Updated Name"}')

      // Click Continue opens the Diff Viewer
      await user.click(screen.getByRole('button', { name: 'Continue' }))

      expect(screen.getByText('Review Changes')).toBeInTheDocument()
      expect(screen.getByTestId('diff-viewer')).toBeInTheDocument()

      const originalDiv = screen.getByTestId('diff-original')
      const modifiedDiv = screen.getByTestId('diff-modified')
      expect(originalDiv).toHaveAttribute('data-value', JSON.stringify({ Name: 'Mock Name' }, null, 2))
      expect(modifiedDiv).toHaveAttribute('data-value', '{"Name": "Updated Name"}')

      // Apply actually saves the draft
      await user.click(screen.getByRole('button', { name: 'Apply' }))

      expect(setDraft).toHaveBeenCalledTimes(1)
      expect(setDraft).toHaveBeenCalledWith({
        nativeId: 'MOCK-123',
        ummMetadata: {
          Name: 'Updated Name'
        }
      })

      expect(screen.queryByText('Editing JSON')).not.toBeInTheDocument()
      expect(screen.queryByText('Review Changes')).not.toBeInTheDocument()
    })
  })

  describe('when the user clicks Back to Edit from the review changes modal', () => {
    test('closes the diff modal and returns to the editor', async () => {
      const user = userEvent.setup()

      setup({ ummMetadata: { Name: 'Mock Name' } })

      await openEditorAndType(user, '{{"Name": "Updated Name"}')
      await user.click(screen.getByRole('button', { name: 'Continue' }))

      expect(screen.getByText('Review Changes')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Back to Edit' }))

      expect(screen.queryByText('Review Changes')).not.toBeInTheDocument()
      expect(screen.getByText('Editing JSON')).toBeInTheDocument()
    })
  })

  describe('when the user enters invalid JSON', () => {
    test('shows an inline error banner and disables the Continue button', async () => {
      const user = userEvent.setup()

      setup({
        ummMetadata: {
          Name: 'Mock Name'
        }
      })

      await openEditorAndType(user, '{{ this is not valid json')

      // Wait for the validation to appear
      expect(await screen.findByText(/Please fix the following errors to continue/i)).toBeInTheDocument()
      expect(screen.getByRole('alert')).toHaveTextContent(/Invalid JSON/)

      expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
      expect(screen.queryByText('Review Changes')).not.toBeInTheDocument()
    })

    test('clears the error and enables Continue once the user starts typing again', async () => {
      const user = userEvent.setup()
      setup({ ummMetadata: { Name: 'Mock Name' } })

      const textarea = await openEditorAndType(user, '{{ not valid')
      expect(await screen.findByText(/Please fix the following errors to continue/i)).toBeInTheDocument()

      await user.clear(textarea)
      await user.type(textarea, '{{"Name": "Valid"}', { skipClick: true })

      await waitFor(() => expect(screen.queryByText(/Please fix the following errors to continue/i)).not.toBeInTheDocument())
      expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled()
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
      expect(screen.queryByText('Editing JSON')).not.toBeInTheDocument()

      // Re-opening edit mode should show the original (unsaved-change-free) JSON again
      await user.click(screen.getByRole('button', { name: 'Edit JSON' }))

      expect(screen.getByRole('textbox', { name: 'Editable JSON metadata' }).value).toContain('"Name": "Mock Name"')
    })
  })

  describe('when a schema prop is provided', () => {
    describe('when the edited JSON is only missing a required field', () => {
      test('proceeds to review changes since missing-required-field errors are explicitly ignored', async () => {
        const user = userEvent.setup()

        const { setDraft } = setup({
          ummMetadata: {
            Name: 'Mock Name'
          }
        }, { schema: mockSchema })

        // Removes the required `Name` field entirely

        await openEditorAndType(user, '{{}')

        await user.click(screen.getByRole('button', { name: 'Continue' }))
        expect(screen.getByText('Review Changes')).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Apply' }))

        expect(setDraft).toHaveBeenCalledTimes(1)
        expect(setDraft).toHaveBeenCalledWith({ ummMetadata: {} })
      })
    })

    describe('when the edited JSON has an unknown/typo\'d field name', () => {
      test('shows the error banner naming the offending field, and disables the Continue button', async () => {
        const user = userEvent.setup()

        setup({
          ummMetadata: {
            Name: 'Mock Name'
          }
        }, { schema: mockSchema })

        await openEditorAndType(user, '{{"Name": "Mock Name", "Nmae": "typo"}')

        expect(await screen.findByText(/Please fix the following errors to continue/i)).toBeInTheDocument()
        expect(errorListText()).toMatch(/Nmae/)
        expect(errorListText()).toMatch(/must NOT have additional property/)

        expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
      })
    })

    describe('when the edited JSON has a value of the wrong type', () => {
      test('shows the error banner with the type error and disables Continue', async () => {
        const user = userEvent.setup()

        setup({
          ummMetadata: {
            Name: 'Mock Name'
          }
        }, { schema: mockSchema })

        await openEditorAndType(user, '{{"Name": "Mock Name", "Age": "not a number"}')

        expect(await screen.findByText(/Please fix the following errors to continue/i)).toBeInTheDocument()
        expect(errorListText()).toMatch(/Age/)
        expect(errorListText()).toMatch(/must be number/)

        expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
      })
    })

    describe('when the edited JSON has an invalid value for a oneOf/const-style enum field', () => {
      test('shows the error banner instead of allowing continuing  to diff viewer', async () => {
        const user = userEvent.setup()

        setup({
          ummMetadata: {
            Status: 'Active'
          }
        }, { schema: mockEnumAsOneOfSchema })

        // "Bogus" doesn't match either const branch, and there's no
        // required-field error at this path to (correctly) suppress it
        await openEditorAndType(user, '{{"Status": "Bogus"}')

        expect(await screen.findByText(/Please fix the following errors to continue/i)).toBeInTheDocument()
        expect(errorListText()).toMatch(/Status/)
        expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
      })

      test('a valid enum value allows continuation to review changes', async () => {
        const user = userEvent.setup()

        const { setDraft } = setup({
          ummMetadata: {
            Status: 'Active'
          }
        }, { schema: mockEnumAsOneOfSchema })

        await openEditorAndType(user, '{{"Status": "Inactive"}')
        await user.click(screen.getByRole('button', { name: 'Continue' }))
        await user.click(screen.getByRole('button', { name: 'Apply' }))

        expect(setDraft).toHaveBeenCalledWith({
          ummMetadata: {
            Status: 'Inactive'
          }
        })
      })
    })

    describe('when the edited JSON has both a missing required field and a structural error', () => {
      test('the error banner names only the structural error, the required error is omitted', async () => {
        const user = userEvent.setup()

        setup({
          ummMetadata: {
            Name: 'Mock Name'
          }
        }, { schema: mockSchema })

        // Missing required `Name`, and has an unknown field `Nmae`
        await openEditorAndType(user, '{{"Nmae": "typo"}')

        expect(await screen.findByText(/Please fix the following errors to continue/i)).toBeInTheDocument()

        expect(errorListText()).toMatch(/Nmae/)
        expect(errorListText()).not.toMatch(/"required"/)
        // A single structural error still renders as a one-item list
        expect(screen.getAllByRole('listitem')).toHaveLength(1)
        expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
      })
    })

    describe('when the edited JSON is missing the required field in every oneOf branch', () => {
      test('shows the error banner for the oneOf wrapper error and disables Continue', async () => {
        const user = userEvent.setup()

        setup({
          ummMetadata: {
            Name: 'Mock Name'
          }
        }, { schema: mockOneOfSchema })

        // Satisfies neither branch: no `Name` and no `Nickname`. The
        // `required` errors for each branch are filtered, but the wrapping
        // `oneOf` error at the root is not, so it should still be reported.
        await openEditorAndType(user, '{{"Age": 5}')

        expect(await screen.findByText(/Please fix the following errors to continue/i)).toBeInTheDocument()
        expect(errorListText()).not.toMatch(/"required"/)
        expect(errorListText()).toMatch(/must match exactly one schema in oneOf/i)
        expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
      })
    })

    describe('when the edited JSON has an unknown field under a oneOf schema', () => {
      test('still shows the error banner for the structural error', async () => {
        const user = userEvent.setup()

        setup({
          ummMetadata: {
            Name: 'Mock Name'
          }
        }, { schema: mockOneOfSchema })

        // Satisfies the `Name` branch, but also has a typo'd unknown field
        await openEditorAndType(user, '{{"Name": "Mock Name", "Nmae": "typo"}')

        expect(await screen.findByText(/Please fix the following errors to continue/i)).toBeInTheDocument()
        expect(errorListText()).toMatch(/Nmae/)
        expect(errorListText()).toMatch(/must NOT have additional property/)
        expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
      })
    })

    describe('when the edited JSON has multiple structural errors', () => {
      test('renders each error as a separate list item in the error banner', async () => {
        const user = userEvent.setup()

        setup({
          ummMetadata: {
            Name: 'Mock Name'
          }
        }, { schema: mockSchema })

        await openEditorAndType(user, '{{"Name": "Mock Name", "Nmae": "typo", "Aeg": "typo2"}')

        expect(await screen.findByText(/Please fix the following errors to continue/i)).toBeInTheDocument()

        const listItems = screen.getAllByRole('listitem')
        expect(listItems).toHaveLength(2)

        const combinedText = listItems.map((item) => item.textContent).join(' ')
        expect(combinedText).toContain('Nmae')
        expect(combinedText).toContain('Aeg')
      })
    })
  })
})
