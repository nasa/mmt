import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

import descriptiveKeywordsUiSchema from '@/js/schemas/uiSchemas/collections/descriptiveKeywords'
import spatialInformationUiSchema from '@/js/schemas/uiSchemas/collections/spatialInformation'
import acquisitionInformationUiSchema from '@/js/schemas/uiSchemas/collections/acquisitionInformation'
import KeywordPicker from '../KeywordPicker/KeywordPicker'
import BulkActionsControlledEntryList from '../BulkActionsControlledEntryList/BulkActionsControlledEntryList'
import CustomMultiSelectWidget from '../CustomMultiSelectWidget/CustomMultiSelectWidget'
import PlatformField from '../PlatformField/PlatformField'
import InstrumentField from '../InstrumentField/InstrumentField'
import DataCenterField from '../DataCenterField/DataCenterField'
import { isUnfilledPlaceholder } from '../../utils/stripUnfilledUpdateValueFields'

// CustomMultiSelectWidget needs an rjsf `registry` for two things: `schemaUtils.retrieveSchema`
// resolves a $ref inside `schema.items`, used only as a fallback when `schema.enum` isn't
// set directly -- since we always set it directly (Roles' options), returning the schema
// unchanged is fine. `formContext.focusField`/`setFocusField` is rjsf's form-wide "which
// field should scroll into view and focus" state; with no multi-field form here to
// coordinate, `focusField: null` just means this widget never auto-focuses itself.
const PASSTHROUGH_REGISTRY = {
  schemaUtils: { retrieveSchema: (schema) => schema },
  formContext: {
    focusField: null,
    setFocusField: () => {}
  }
}

// The real collection-form's uiSchema for each keyword field, reused as-is -- KeywordPicker
// expects this exact shape.
const KEYWORD_UI_SCHEMAS = {
  SCIENCE_KEYWORDS: descriptiveKeywordsUiSchema.ScienceKeywords,
  LOCATION_KEYWORDS: spatialInformationUiSchema.LocationKeywords
}

// Falls back to describing whatever field IS set when an entry's "primary" label (built from
// ShortName/Type/LongName) would otherwise be blank -- reachable once a partial FIND_AND_UPDATE
// merge commits an entry that only touches a different field (e.g. Data Centers' Roles with no
// ShortName), which would otherwise render as an empty label next to the Remove button.
const describeAnySetField = (entry) => (
  Object.entries(entry)
    .filter(([, fieldValue]) => (
      fieldValue && !(Array.isArray(fieldValue) && fieldValue.length === 0)
    ))
    .map(([key, fieldValue]) => (
      `${key}: ${Array.isArray(fieldValue) ? fieldValue.join(', ') : fieldValue}`
    ))
    .join(', ')
)

// Config per Platforms/Instruments/Data Centers field: how to render its single-entry
// picker, how to label one entry, and which keys the picker owns (`pickedKeys`). Anything
// else on the field (e.g. Platforms'/Instruments' nested-array Characteristics) stays
// JSON-only. `renderField` receives `{ formData, onChange, updateValueFields }` -- only Data
// Centers uses the third argument, to read Roles' enum options.
const ENTRY_FIELDS = {
  PLATFORMS: {
    renderField: ({ formData, onChange }) => (
      <PlatformField
        formData={formData}
        onChange={onChange}
        uiSchema={{ 'ui:controlled': acquisitionInformationUiSchema.Platforms.items['ui:controlled'] }}
      />
    ),
    // Ordered like the KMS hierarchy (Type above ShortName), not like `pickedKeys` -- that
    // order is for the Find/Replace With form fields, deliberately ShortName, Type, LongName.
    entryLabel: (entry) => {
      const { ShortName, Type, LongName } = entry

      return [Type, ShortName, LongName].filter(Boolean).join(' > ') || describeAnySetField(entry)
    },
    pickedKeys: ['ShortName', 'Type', 'LongName'],
    // What identifies a Platform for single-value mode's "is there a pick yet" check --
    // Type alone (e.g. just "Jet") doesn't name a specific platform the way ShortName/
    // LongName do, so it's deliberately excluded here even though it's part of the display
    // label above.
    identityKeys: ['ShortName', 'LongName']
  },
  INSTRUMENTS: {
    renderField: ({ formData, onChange }) => (
      <>
        <InstrumentField
          formData={formData}
          onChange={
            (picked) => onChange({
              ...formData,
              ...picked
            })
          }
          uiSchema={
            {
              'ui:controlled': acquisitionInformationUiSchema.Platforms.items.Instruments.items['ui:controlled']
            }
          }
        />
        <Row>
          <Col md={6} className="mb-3">
            <Form.Group controlId="bulk-actions-instrument-technique">
              <Form.Label className="custom-widget-wrapper__label text-gray-700">Technique</Form.Label>
              <Form.Control
                type="text"
                value={formData.Technique ?? ''}
                onChange={
                  ({ target }) => onChange({
                    ...formData,
                    Technique: target.value
                  })
                }
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6} className="mb-3">
            <Form.Group controlId="bulk-actions-instrument-number-of-instruments">
              <Form.Label className="custom-widget-wrapper__label text-gray-700">Number Of Instruments</Form.Label>
              <Form.Control
                type="number"
                value={formData.NumberOfInstruments ?? ''}
                onChange={
                  ({ target }) => onChange({
                    ...formData,
                    NumberOfInstruments: target.value === '' ? '' : Number(target.value)
                  })
                }
              />
            </Form.Group>
          </Col>
        </Row>
      </>
    ),
    entryLabel: (entry) => {
      const { ShortName, LongName } = entry

      return [ShortName, LongName].filter(Boolean).join(' > ') || describeAnySetField(entry)
    },
    pickedKeys: ['ShortName', 'LongName', 'Technique', 'NumberOfInstruments'],
    // What identifies an Instrument for single-value mode's "is there a pick yet" check --
    // a Technique/NumberOfInstruments-only pick (a valid partial FIND_AND_UPDATE merge) has
    // nothing to identify it by, so it renders no chip rather than one labeled by whatever
    // else happens to be set.
    identityKeys: ['ShortName', 'LongName']
  },
  DATA_CENTERS: {
    renderField: ({ formData, onChange, updateValueFields }) => {
      const { options: rolesOptions, ummRequired: rolesRequired } = (
        updateValueFields.find(({ key }) => key === 'Roles')
      )

      return (
        <>
          <DataCenterField
            formData={formData}
            onChange={
              (picked) => onChange({
                ...formData,
                ...picked
              })
            }
          />
          <CustomMultiSelectWidget
            id="bulk-actions-data-center-roles"
            label="Roles"
            onBlur={() => {}}
            onChange={
              (nextRoles) => onChange({
                ...formData,
                Roles: nextRoles
              })
            }
            registry={PASSTHROUGH_REGISTRY}
            required={!!rolesRequired}
            schema={
              {
                enum: rolesOptions,
                items: {}
              }
            }
            value={formData.Roles ?? []}
          />
        </>
      )
    },
    entryLabel: (entry) => {
      const { ShortName, LongName } = entry

      return [ShortName, LongName].filter(Boolean).join(' > ') || describeAnySetField(entry)
    },
    pickedKeys: ['ShortName', 'LongName', 'Roles'],
    // What identifies a Data Center for single-value mode's "is there a pick yet" check --
    // a Roles-only pick (a valid partial FIND_AND_UPDATE merge) has nothing to identify it
    // by, so it renders no chip rather than one labeled "Roles: ...".
    identityKeys: ['ShortName', 'LongName']
  }
}

/**
 * @typedef {Object} BulkActionsControlledValuePickerProps
 * @property {import('../../constants/bulkUpdateFields').BulkUpdateValueField} fieldConfig The selected updateField's full config.
 * @property {Boolean} allowMultiple Whether updateValue may be an array of entries for the selected updateType.
 * @property {String} value The current updateValue JSON text.
 * @property {Function} onChange Called with the next updateValue JSON text whenever a pick is made.
 */

/**
 * Renders a BulkActionsControlledValuePicker component.
 *
 * Renders a controlled-value picker for the selected bulk-update field, writing each pick
 * into the given `value` JSON text. Renders nothing for a field with no picker configured.
 *
 * @component
 */
const BulkActionsControlledValuePicker = ({
  fieldConfig,
  allowMultiple,
  value,
  onChange
}) => {
  const { value: updateField, updateValueFields } = fieldConfig

  // Keys a keyword picker owns: every updateValueField except a nested-array one, which has
  // no controlled vocabulary and stays JSON-only. Platforms/Instruments/Data Centers use
  // their own `pickedKeys` in ENTRY_FIELDS instead.
  const entryKeys = useMemo(
    () => updateValueFields
      .filter(({ type }) => type !== 'nested-array')
      .map(({ key }) => key),
    [updateValueFields]
  )

  let parsed

  try {
    parsed = JSON.parse(value)
  } catch {
    return (
      <Alert variant="secondary" className="mb-3">
        Fix the JSON below to use the picker.
      </Alert>
    )
  }

  const currentObject = (parsed && typeof parsed === 'object' && !Array.isArray(parsed))
    ? parsed
    : {}

  // The schema allows a hand-typed flat object even when allowMultiple is true (CMR's
  // updateValue "could be an array of objects" -- not "must"), so a populated currentObject
  // is treated as that one entry rather than discarded in favor of an empty list.
  const isCurrentObjectPopulated = Object.keys(currentObject).length > 0

  let currentArray = []
  if (Array.isArray(parsed)) {
    currentArray = parsed
  } else if (isCurrentObjectPopulated) {
    currentArray = [currentObject]
  }

  // Clears only `ownKeys` on the current value before applying a new pick, so anything else
  // already there (e.g. Platforms'/Instruments' Characteristics) is left alone. Writes the
  // picked keys back in `ownKeys` order, not whatever order the picker's onChange produced.
  const mergeOntoCurrent = (current, picked, ownKeys) => {
    const next = { ...current }
    ownKeys.forEach((key) => { delete next[key] })

    const orderedPicked = {}
    ownKeys.forEach((key) => {
      if (picked[key] !== undefined) orderedPicked[key] = picked[key]
    })

    return {
      ...next,
      ...orderedPicked
    }
  }

  // A pick is blank when none of the keys it owns (`ownKeys`) are set. A key counts as unset
  // if it's undefined/null, '', or an empty array -- plain falsiness isn't enough, since an
  // empty array (e.g. Data Centers' Roles) is still truthy, and 0 (e.g. Instruments'
  // NumberOfInstruments) is falsy despite being a real, pickable value. Used to drop the
  // skeleton's blank entry from a multi-value list, and to tell whether a single-value field
  // has a pick yet.
  const isBlankValue = (fieldValue) => (
    fieldValue === undefined
    || fieldValue === null
    || fieldValue === ''
    || (Array.isArray(fieldValue) && fieldValue.length === 0)
  )

  const isBlankPick = (entry, ownKeys) => (
    ownKeys.every((key) => isBlankValue(entry?.[key]))
  )

  // A genuine placeholder entry -- the skeleton's untouched blank slot -- has nothing but
  // unfilled defaults across EVERY key, not just this field's own ownKeys. Scoping to
  // ownKeys (like isBlankPick above) would drop an entry whose own key is an explicit null,
  // or that still carries a populated JSON-only field (e.g. hand-typed Characteristics) the
  // picker doesn't own. Once dropped here, it's gone for good the next time the list's
  // onChange writes the array back.
  const isPlaceholderEntry = (entry) => (
    !entry || Object.values(entry).every(isUnfilledPlaceholder)
  )

  // Builds the entries the shared list UI renders, and what its onChange does with them --
  // the only difference between multi- and single-value action types. Multi-value writes
  // the whole list back; single-value keeps only the latest pick, so picking again replaces
  // it instead of adding to the list. `identityKeys` (default ownKeys) is what decides
  // whether a single-value pick is blank -- a partial FIND_AND_UPDATE pick that only touches
  // a non-identifying field (e.g. Instruments' Technique, Data Centers' Roles) is still a
  // valid, submittable pick, but with no ShortName/LongName to show, it has nothing to
  // meaningfully render as a removable chip -- so it renders no chip at all rather than a
  // confusing one labeled by whatever else happens to be set.
  const buildPickerProps = (ownKeys, identityKeys = ownKeys) => {
    if (allowMultiple) {
      return {
        entries: currentArray.filter((entry) => !isPlaceholderEntry(entry)),
        onChange: (nextEntries) => onChange(JSON.stringify(nextEntries, null, 2))
      }
    }

    return {
      entries: isBlankPick(currentObject, identityKeys) ? [] : [currentObject],
      onChange: (nextEntries) => {
        const picked = nextEntries.at(-1) ?? {}

        onChange(JSON.stringify(mergeOntoCurrent(currentObject, picked, ownKeys), null, 2))
      }
    }
  }

  const keywordUiSchema = KEYWORD_UI_SCHEMAS[updateField]

  if (keywordUiSchema) {
    const uiSchema = {
      ...keywordUiSchema,
      'ui:scheme_values': entryKeys,
      'ui:includeRecommendedKeywords': false,
      // A single-value action type replaces rather than adds to the list, so "Add Keyword"
      // would be misleading.
      'ui:add_button_label': allowMultiple ? 'Add Keyword' : 'Select Keyword',
      // The Target Field select above already names the scheme (e.g. "Science Keywords"),
      // so KeywordPicker's own title/description would just repeat it.
      'ui:title': '',
      // Only here, not in the real collection form -- a parent keyword level is directly
      // selectable the same way a leaf is, instead of only navigable into.
      'ui:selectable_parents': true,
      // In single-value mode, `entries` below is only ever the one entry being replaced, not
      // an accumulating list -- KeywordPicker's own "already added" check would otherwise
      // reject replacing that entry with one of its own ancestors or descendants (e.g.
      // replacing a selected CLOUDS with its parent ATMOSPHERE), since their paths overlap.
      // Append mode keeps the check, since there a real duplicate is still possible.
      'ui:skip_duplicate_check': !allowMultiple
    }

    const { entries, onChange: handlePick } = buildPickerProps(entryKeys)

    return (
      <Row>
        <Col md={6}>
          <KeywordPicker
            formData={entries}
            onChange={handlePick}
            required={false}
            schema={{ description: '' }}
            uiSchema={uiSchema}
          />
        </Col>
      </Row>
    )
  }

  const entryField = ENTRY_FIELDS[updateField]

  if (entryField) {
    const {
      renderField, entryLabel, pickedKeys, identityKeys
    } = entryField
    const { entries, onChange: handlePick } = buildPickerProps(pickedKeys, identityKeys)

    // A picked key is required only if CMR's UMM-C schema requires it (e.g. Data Centers'
    // ShortName/Roles) on a whole new/replaced entry (allowMultiple) -- without gating
    // Add on this, a user could commit an entry missing one, which renders in the list as a
    // blank-looking entry until Submit catches it. Mirrors buildUpdateValueJsonSchema's own
    // gating: FIND_AND_UPDATE's partial merge doesn't require any field to be re-specified,
    // so Select must allow committing e.g. just Roles with no ShortName there.
    const requiredKeys = allowMultiple
      ? pickedKeys.filter((key) => (
        updateValueFields.find((field) => field.key === key)?.ummRequired
      ))
      : []

    return (
      <Row>
        <Col md={6}>
          <BulkActionsControlledEntryList
            entries={entries}
            onChange={handlePick}
            allowMultiple={allowMultiple}
            entryKeys={pickedKeys}
            requiredKeys={requiredKeys}
            renderPicker={
              (props) => renderField({
                ...props,
                updateValueFields
              })
            }
            entryLabel={entryLabel}
            // A single-value action type replaces rather than adds to the list, so "Add"
            // would be misleading.
            addButtonLabel={allowMultiple ? 'Add' : 'Select'}
          />
        </Col>
      </Row>
    )
  }

  return null
}

BulkActionsControlledValuePicker.propTypes = {
  fieldConfig: PropTypes.shape({
    value: PropTypes.string.isRequired,
    updateValueFields: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    })).isRequired
  }).isRequired,
  allowMultiple: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default BulkActionsControlledValuePicker
