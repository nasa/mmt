import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'

import './BulkActionsControlledEntryList.scss'

/**
 * @typedef {Object} BulkActionsControlledEntryListProps
 * @property {Object[]} entries The entries picked so far.
 * @property {Function} onChange Called with the next entries array whenever one is added or removed.
 * @property {Boolean} allowMultiple Whether a commit appends a new entry to the list or replaces the single existing one.
 * @property {String[]} entryKeys Which keys belong to this entry type (e.g. `['Type', 'ShortName', 'LongName']`).
 * @property {Function} renderPicker Renders the single-entry picker, called as `renderPicker({ formData, onChange })`.
 * @property {Function} entryLabel Returns the display text for one entry.
 * @property {String} [addButtonLabel] The submit button's text (default 'Add').
 */

/**
 * Renders a BulkActionsControlledEntryList component.
 *
 * Renders a single-entry picker with an Add button, plus the list of entries added so far --
 * each with a Remove button.
 *
 * @component
 */
const BulkActionsControlledEntryList = ({
  entries,
  onChange,
  allowMultiple,
  entryKeys,
  renderPicker,
  entryLabel,
  addButtonLabel
}) => {
  const [pendingEntry, setPendingEntry] = useState({})

  const committedEntry = entries[0] ?? {}

  // Keyed on the committed entry's own content, not `entries`' identity -- the caller
  // rebuilds that array (and the object inside it) from scratch on every render (e.g.
  // re-parsing the updateValue JSON), so depending on its reference would re-sync on any
  // unrelated re-render and wipe out whatever the user has picked but not yet added.
  const committedEntryKey = JSON.stringify(committedEntry)

  // Single-value mode has one entry built across multiple Adds, so keep `pendingEntry` in
  // sync with it rather than resetting blank each time. Multi-value mode's pendingEntry is
  // the next, separate entry being built, so it stays independent.
  useEffect(() => {
    if (!allowMultiple) setPendingEntry(committedEntry)
  }, [committedEntryKey, allowMultiple])

  // Keep only the fields this entry type cares about (entryKeys) -- drop anything else.
  const pickedFields = entryKeys.reduce((acc, key) => {
    if (pendingEntry[key]) acc[key] = pendingEntry[key]

    return acc
  }, {})

  const canAdd = Object.keys(pickedFields).length > 0

  const handleAdd = () => {
    if (!canAdd) return

    if (allowMultiple) {
      onChange([...entries, pickedFields])
      setPendingEntry({})
    } else {
      onChange([pickedFields])
    }
  }

  const handleRemove = (index) => {
    onChange(entries.filter((_, entryIndex) => entryIndex !== index))
  }

  return (
    <div className="bulk-actions-controlled-entry-list mb-3">
      {
        entries.length > 0 && (
          <ul className="p-3 mb-2 bulk-actions-controlled-entry-list__entries">
            {
              entries.map((entry, index) => (
                <li key={JSON.stringify(entry)}>
                  {entryLabel(entry)}

                  <Button
                    onClick={() => handleRemove(index)}
                    variant="link"
                  >
                    <i
                      aria-label="Remove"
                      className="fa fa-times-circle remove-button text-red ps-1"
                      role="img"
                    />
                  </Button>
                </li>
              ))
            }
          </ul>
        )
      }

      {
        renderPicker({
          formData: pendingEntry,
          onChange: setPendingEntry
        })
      }

      {/* Keep 'add' -- tests rely on it, not addButtonLabel's text */}
      <Button
        className="mt-2"
        disabled={!canAdd}
        onClick={handleAdd}
        aria-label="add"
      >
        <i className="fa-solid fa-circle-plus fa-sm" />
        {' '}
        {addButtonLabel}
      </Button>
    </div>
  )
}

BulkActionsControlledEntryList.defaultProps = {
  addButtonLabel: 'Add'
}

BulkActionsControlledEntryList.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onChange: PropTypes.func.isRequired,
  allowMultiple: PropTypes.bool.isRequired,
  entryKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  renderPicker: PropTypes.func.isRequired,
  entryLabel: PropTypes.func.isRequired,
  addButtonLabel: PropTypes.string
}

export default BulkActionsControlledEntryList
