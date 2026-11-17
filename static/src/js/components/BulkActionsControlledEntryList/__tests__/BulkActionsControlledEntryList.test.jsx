import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import BulkActionsControlledEntryList from '../BulkActionsControlledEntryList'

// Stands in for a real picker component. Has two independent "Pick" buttons so tests can
// check that a later pick merges onto an earlier one instead of overwriting it.
const StubPicker = ({ formData, onChange }) => (
  <div>
    <span>{`pending: ${formData.ShortName || ''}`}</span>
    <button
      type="button"
      onClick={
        () => onChange({
          ...formData,
          ShortName: 'ASF',
          LongName: 'Alaska Satellite Facility'
        })
      }
    >
      Pick ASF
    </button>
    <button
      type="button"
      onClick={
        () => onChange({
          ...formData,
          Roles: ['ARCHIVER']
        })
      }
    >
      Pick Roles
    </button>
  </div>
)

StubPicker.propTypes = {
  formData: PropTypes.shape({ ShortName: PropTypes.string }).isRequired,
  onChange: PropTypes.func.isRequired
}

// BulkActionsControlledEntryList holds no list state itself -- it just renders `entries` and
// calls `onChange` to ask for a different value. This wrapper plays the parent's role (like
// BulkActionsControlledValuePicker does for real) so the rendered list actually updates
// across a multi-step interaction (add an entry, see it in the list, then remove it).
const Wrapper = ({
  initialEntries,
  onChange,
  allowMultiple,
  addButtonLabel
}) => {
  const [entries, setEntries] = useState(initialEntries)

  return (
    <BulkActionsControlledEntryList
      entries={entries}
      onChange={
        (next) => {
          setEntries(next)
          onChange(next)
        }
      }
      allowMultiple={allowMultiple}
      entryKeys={['ShortName', 'LongName', 'Roles']}
      renderPicker={
        ({ formData, onChange: setPending }) => (
          <StubPicker formData={formData} onChange={setPending} />
        )
      }
      entryLabel={(entry) => `${entry.ShortName} > ${entry.LongName}`}
      addButtonLabel={addButtonLabel}
    />
  )
}

Wrapper.propTypes = {
  initialEntries: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onChange: PropTypes.func.isRequired,
  allowMultiple: PropTypes.bool,
  addButtonLabel: PropTypes.string
}

Wrapper.defaultProps = {
  allowMultiple: true,
  addButtonLabel: undefined
}

const setup = (initialEntries = [], addButtonLabel = undefined, allowMultiple = true) => {
  const onChange = vi.fn()
  const user = userEvent.setup()

  render(
    <Wrapper
      initialEntries={initialEntries}
      onChange={onChange}
      addButtonLabel={addButtonLabel}
      allowMultiple={allowMultiple}
    />
  )

  return {
    onChange,
    user
  }
}

describe('BulkActionsControlledEntryList', () => {
  test('Add is disabled until the picker has a pending pick', () => {
    setup()

    expect(screen.getByRole('button', { name: 'add' })).toBeDisabled()
  })

  test('the submit button defaults to "Add"', () => {
    setup()

    expect(screen.getByRole('button', { name: 'add' })).toHaveTextContent('Add')
  })

  test('the submit button uses addButtonLabel when provided', () => {
    setup([], 'Select')

    expect(screen.getByRole('button', { name: 'add' })).toHaveTextContent('Select')
  })

  test('adding a pick appends it to the list and resets the picker', async () => {
    const { onChange, user } = setup()

    await user.click(screen.getByRole('button', { name: 'Pick ASF' }))
    await user.click(screen.getByRole('button', { name: 'add' }))

    expect(onChange).toHaveBeenCalledWith([{
      ShortName: 'ASF',
      LongName: 'Alaska Satellite Facility'
    }])

    expect(screen.getByText((text) => text.startsWith('pending:') && text.trim() === 'pending:')).toBeInTheDocument()
  })

  describe('in single-value (replace) mode', () => {
    test('committing a second, independent pick preserves fields from the earlier commit', async () => {
      const { onChange, user } = setup([], 'Select', false)

      await user.click(screen.getByRole('button', { name: 'Pick ASF' }))
      await user.click(screen.getByRole('button', { name: 'add' }))

      await user.click(screen.getByRole('button', { name: 'Pick Roles' }))
      await user.click(screen.getByRole('button', { name: 'add' }))

      expect(onChange).toHaveBeenLastCalledWith([{
        ShortName: 'ASF',
        LongName: 'Alaska Satellite Facility',
        Roles: ['ARCHIVER']
      }])
    })

    test('keeps showing the committed entry instead of resetting the picker to blank', async () => {
      const { user } = setup([], 'Select', false)

      await user.click(screen.getByRole('button', { name: 'Pick ASF' }))
      await user.click(screen.getByRole('button', { name: 'add' }))

      expect(screen.getByText('pending: ASF')).toBeInTheDocument()
    })

    test('preserves an unsubmitted pick across an unrelated re-render', async () => {
      const user = userEvent.setup()

      // The real caller (BulkActionsControlledValuePicker) re-parses its JSON value on every
      // render, so `entries` arrives as a fresh array/object literal -- same content, new
      // identity -- on any unrelated re-render, not just a real commit. `[...entries]` here
      // reproduces that so this test can catch a regression back to syncing on identity.
      const UnrelatedRerenderWrapper = () => {
        const [entries] = useState([])
        const [, forceRerender] = useState(0)

        return (
          <>
            <button type="button" onClick={() => forceRerender((count) => count + 1)}>
              Unrelated rerender
            </button>
            <BulkActionsControlledEntryList
              entries={[...entries]}
              onChange={() => {}}
              allowMultiple={false}
              entryKeys={['ShortName', 'LongName', 'Roles']}
              renderPicker={
                ({ formData, onChange: setPending }) => (
                  <StubPicker formData={formData} onChange={setPending} />
                )
              }
              entryLabel={(entry) => `${entry.ShortName} > ${entry.LongName}`}
              addButtonLabel="Select"
            />
          </>
        )
      }

      render(<UnrelatedRerenderWrapper />)

      await user.click(screen.getByRole('button', { name: 'Pick ASF' }))
      expect(screen.getByText('pending: ASF')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Unrelated rerender' }))

      expect(screen.getByText('pending: ASF')).toBeInTheDocument()
    })
  })

  test('renders each existing entry, removable', () => {
    setup([{
      ShortName: 'ASF',
      LongName: 'Alaska Satellite Facility'
    }])

    expect(screen.getByText('ASF > Alaska Satellite Facility')).toBeInTheDocument()
  })

  test('removing an entry calls onChange without that entry', async () => {
    const { onChange, user } = setup([
      {
        ShortName: 'ASF',
        LongName: 'Alaska Satellite Facility'
      },
      {
        ShortName: 'LARC',
        LongName: 'Langley Research Center'
      }
    ])

    await user.click(screen.getAllByRole('button', { name: 'Remove' })[0])

    expect(onChange).toHaveBeenCalledWith([{
      ShortName: 'LARC',
      LongName: 'Langley Research Center'
    }])
  })
})
