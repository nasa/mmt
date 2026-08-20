import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import JSONPretty from 'react-json-pretty'

import JsonPreview from '../JsonPreview'
import AppContext from '../../../context/AppContext'

vi.mock('react-json-pretty')

const setup = (draft = undefined, overrides = {}) => {
  const setDraft = vi.fn()

  render(
    <AppContext.Provider
      value={
        {
          draft,
          setDraft,
          ...overrides
        }
      }
    >
      <JsonPreview />
    </AppContext.Provider>
  )

  return { setDraft }
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
})
