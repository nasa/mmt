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
 * @property {String[]} [requiredKeys] Which of entryKeys must have a real value before Add/Select is enabled (e.g. Data Centers' `['ShortName', 'Roles']`) -- a subset of entryKeys, since not every field this picker owns is required.
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
  requiredKeys,
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

  // A key counts as unset if it's falsy ('' or 0) or an empty array -- plain truthiness
  // isn't enough, since an empty array (e.g. Data Centers' untouched Roles) is still truthy.
  const isBlankValue = (fieldValue) => (
    !fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0)
  )

  // Array-valued fields (e.g. Data Centers' Roles) need a content comparison, not reference
  // equality -- and order shouldn't matter, since a multiselect's value is really a set.
  const valuesEqual = (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.length === b.length && a.every((value) => b.includes(value))
    }

    return a === b
  }

  // In append mode, a pending pick that matches an existing entry on every required/
  // identifying key (e.g. the same Data Center ShortName and Roles) is a duplicate, not a
  // second distinct entry. Replace mode (!allowMultiple) always has at most one entry and
  // every commit replaces it, so there's nothing to duplicate there. With no requiredKeys to
  // key on, there's no clear identity to dedupe by, so nothing is blocked.
  const isDuplicatePick = (
    allowMultiple
    && requiredKeys.length > 0
    && entries.some((entry) => (
      requiredKeys.every((key) => valuesEqual(entry[key], pickedFields[key]))
    ))
  )

  // Beyond "something's been picked," every required key must itself have a real value --
  // otherwise a user could add an entry that's missing a field CMR requires (caught only
  // later, at Submit), which in the meantime shows up in the list as a blank-looking entry.
  const canAdd = (
    Object.keys(pickedFields).length > 0
    && requiredKeys.every((key) => !isBlankValue(pendingEntry[key]))
    && !isDuplicatePick
  )

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
  addButtonLabel: 'Add',
  requiredKeys: []
}

BulkActionsControlledEntryList.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onChange: PropTypes.func.isRequired,
  allowMultiple: PropTypes.bool.isRequired,
  entryKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  requiredKeys: PropTypes.arrayOf(PropTypes.string),
  renderPicker: PropTypes.func.isRequired,
  entryLabel: PropTypes.func.isRequired,
  addButtonLabel: PropTypes.string
}

export default BulkActionsControlledEntryList
