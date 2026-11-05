import { GET_COLLECTIONS } from '@/js/operations/queries/getCollections'

/**
 * Reference data for CMR's native collection bulk-update endpoint, per the official docs:
 * https://cmr.earthdata.nasa.gov/ingest/site/docs/ingest/api.html#collection-bulk-update
 *
 * `findValue` only matches a field's flat (non-nested) properties -- `flatFindKeys` below
 * lists those per field, derived from the UMM-C v1.18.6 schema (only SCIENCE_KEYWORDS and
 * PLATFORMS are confirmed against a live response; the rest are schema-derived but untested).
 *
 * `updateValueFields` mirrors the flat shape CMR's examples use for `updateValue`, plus one
 * confirmed nested case -- Platforms'/Instruments' `Characteristics`. Data Centers' deeper
 * ContactInformation nesting isn't exposed.
 *
 * Keyed by concept type (the same string as the `:type` route param) under BULK_UPDATE_CONFIG,
 * so a second concept type -- once CMR offers bulk-update for it, likely via its own mutation
 * and enums -- is a new entry here, not a restructuring.
 */

/**
 * @typedef {Object} BulkUpdateValueField
 * @property {String} key The UMM-C field name.
 * @property {'text'|'number'|'select'|'multiselect'|'nested-array'} type The kind of value this field holds.
 * @property {String[]} [options] The selectable values, present when type is 'select' or 'multiselect'.
 * @property {BulkUpdateValueField[]} [fields] The sub-fields of one entry, present when type is 'nested-array'.
 */

/**
 * @typedef {Object} BulkFindKeyField
 * @property {String} key The UMM-C field name.
 * @property {'text'|'number'} type The kind of value CMR matches this key against -- only
 * 'text'/'number', since findValue only ever matches a single flat scalar per key.
 */

// Docs: "DataCenterURL" / "HOME PAGE" is the established content-type/type pair for a data
// center's home page RelatedUrl entry -- see static/src/js/utils/handleShortNameChange.js.
export const DATA_CENTER_HOME_PAGE_URL_CONTENT_TYPE = 'DataCenterURL'
export const DATA_CENTER_HOME_PAGE_URL_TYPE = 'HOME PAGE'

// CharacteristicType (static/src/js/schemas/umm/ummCSchema.js) -- shared by Platforms' and
// Instruments' `Characteristics`, both arrays of this same shape.
const CHARACTERISTIC_FIELDS = [
  {
    key: 'Name',
    type: 'text'
  },
  {
    key: 'Description',
    type: 'text'
  },
  {
    key: 'Value',
    type: 'text'
  },
  {
    key: 'Unit',
    type: 'text'
  },
  {
    key: 'DataType',
    type: 'select',
    options: ['STRING', 'FLOAT', 'INT', 'BOOLEAN', 'DATE', 'TIME', 'DATETIME', 'DATE_STRING', 'TIME_STRING', 'DATETIME_STRING']
  }
]

const COLLECTION_BULK_UPDATE_FIELDS = [
  {
    value: 'SCIENCE_KEYWORDS',
    label: 'Science Keywords',
    ummPropertyKey: 'ScienceKeywords',
    flatFindKeys: [
      {
        key: 'Category',
        type: 'text'
      },
      {
        key: 'Topic',
        type: 'text'
      },
      {
        key: 'Term',
        type: 'text'
      },
      {
        key: 'VariableLevel1',
        type: 'text'
      },
      {
        key: 'VariableLevel2',
        type: 'text'
      },
      {
        key: 'VariableLevel3',
        type: 'text'
      }
    ],
    updateValueFields: [
      {
        key: 'Category',
        type: 'text'
      },
      {
        key: 'Topic',
        type: 'text'
      },
      {
        key: 'Term',
        type: 'text'
      },
      {
        key: 'VariableLevel1',
        type: 'text'
      },
      {
        key: 'VariableLevel2',
        type: 'text'
      },
      {
        key: 'VariableLevel3',
        type: 'text'
      }
    ]
  },
  {
    value: 'LOCATION_KEYWORDS',
    label: 'Location Keywords',
    ummPropertyKey: 'LocationKeywords',
    flatFindKeys: [
      {
        key: 'Category',
        type: 'text'
      },
      {
        key: 'Type',
        type: 'text'
      },
      {
        key: 'Subregion1',
        type: 'text'
      },
      {
        key: 'Subregion2',
        type: 'text'
      },
      {
        key: 'Subregion3',
        type: 'text'
      },
      {
        key: 'DetailedLocation',
        type: 'text'
      }
    ],
    updateValueFields: [
      {
        key: 'Category',
        type: 'text'
      },
      {
        key: 'Type',
        type: 'text'
      },
      {
        key: 'Subregion1',
        type: 'text'
      },
      {
        key: 'Subregion2',
        type: 'text'
      },
      {
        key: 'Subregion3',
        type: 'text'
      },
      {
        key: 'DetailedLocation',
        type: 'text'
      }
    ]
  },
  {
    value: 'DATA_CENTERS',
    label: 'Data Centers',
    ummPropertyKey: 'DataCenters',
    flatFindKeys: [
      {
        key: 'ShortName',
        type: 'text'
      },
      {
        key: 'LongName',
        type: 'text'
      }
    ],
    updateValueFields: [
      {
        key: 'ShortName',
        type: 'text'
      },
      {
        key: 'LongName',
        type: 'text'
      },
      {
        key: 'Roles',
        type: 'multiselect',
        options: ['ARCHIVER', 'DISTRIBUTOR', 'PROCESSOR', 'ORIGINATOR']
      }
    ]
  },
  {
    value: 'PLATFORMS',
    label: 'Platforms',
    ummPropertyKey: 'Platforms',
    flatFindKeys: [
      {
        key: 'Type',
        type: 'text'
      },
      {
        key: 'ShortName',
        type: 'text'
      },
      {
        key: 'LongName',
        type: 'text'
      }
    ],
    updateValueFields: [
      {
        key: 'Type',
        type: 'text'
      },
      {
        key: 'ShortName',
        type: 'text'
      },
      {
        key: 'LongName',
        type: 'text'
      },
      {
        key: 'Characteristics',
        type: 'nested-array',
        fields: CHARACTERISTIC_FIELDS
      }
    ]
  },
  {
    value: 'INSTRUMENTS',
    label: 'Instruments',
    // Instruments live nested under each Platform in UMM-C (Platforms[].Instruments), not as
    // their own top-level collection property -- `ummPropertyKey` here is 'Platforms'.
    ummPropertyKey: 'Platforms',
    flatFindKeys: [
      {
        key: 'ShortName',
        type: 'text'
      },
      {
        key: 'LongName',
        type: 'text'
      },
      {
        key: 'Technique',
        type: 'text'
      },
      {
        key: 'NumberOfInstruments',
        type: 'number'
      }
    ],
    updateValueFields: [
      {
        key: 'ShortName',
        type: 'text'
      },
      {
        key: 'LongName',
        type: 'text'
      },
      {
        key: 'Technique',
        type: 'text'
      },
      {
        key: 'NumberOfInstruments',
        type: 'number'
      },
      {
        key: 'Characteristics',
        type: 'nested-array',
        fields: CHARACTERISTIC_FIELDS
      }
    ]
  }
]

const COLLECTION_BULK_UPDATE_TYPES = [
  {
    value: 'ADD_TO_EXISTING',
    label: 'Add to Existing',
    needsFindValue: false,
    needsUpdateValue: true,
    // Docs: "Update value ... could be an array of objects when update type is
    // ADD_TO_EXISTING, CLEAR_ALL_AND_REPLACE and FIND_AND_REPLACE."
    supportsMultipleUpdateValues: true,
    helpText: 'Provide the new value to add. It will be appended alongside any existing values for this field, not replace them. Add more than one entry to add several at once.'
  },
  {
    value: 'CLEAR_ALL_AND_REPLACE',
    label: 'Clear All and Replace',
    needsFindValue: false,
    needsUpdateValue: true,
    supportsMultipleUpdateValues: true,
    helpText: 'Provide the new value. Every existing value for this field will be removed and replaced with it. Add more than one entry to replace with several at once.'
  },
  {
    value: 'FIND_AND_REPLACE',
    label: 'Find and Replace',
    needsFindValue: true,
    needsUpdateValue: true,
    supportsMultipleUpdateValues: true,
    helpText: 'Provide the value to find and the value to replace it with. Only entries matching every field you fill in under "Find" will be replaced -- and the entire matched entry is overwritten, so any field not included in "Replace With" will be lost. Add more than one entry to replace each match with several at once.'
  },
  {
    value: 'FIND_AND_REMOVE',
    label: 'Find and Remove',
    needsFindValue: true,
    needsUpdateValue: false,
    helpText: 'Provide the value to find. Only entries matching every field you fill in will be removed.'
  },
  {
    value: 'FIND_AND_UPDATE',
    label: 'Find and Update',
    needsFindValue: true,
    needsUpdateValue: true,
    helpText: 'Provide the value to find and the fields to update on matching entries. Only entries matching every field you fill in under "Find" will be updated.'
  },
  {
    value: 'FIND_AND_UPDATE_HOME_PAGE_URL',
    label: 'Find and Update Home Page URL',
    needsFindValue: true,
    needsUpdateValue: true,
    // Docs: "It can only be used with Update field being DATA_CENTERS."
    onlyForFields: ['DATA_CENTERS'],
    helpText: "Provide the Data Center to find and the new home page URL. Leave the URL blank to remove the found Data Center's existing home page URL instead."
  }
]

// The columns for BulkActionsSelectedConcepts' table, per concept type -- it appends its own
// Action column (Remove), since that one's onClick varies by caller rather than by concept
// type.
const COLLECTION_SELECTED_LIST_COLUMNS = [
  {
    dataKey: 'shortName',
    title: 'Short Name',
    className: 'col-auto'
  },
  {
    dataKey: 'version',
    title: 'Version',
    className: 'col-auto'
  },
  {
    dataKey: 'provider',
    title: 'Provider',
    className: 'col-auto'
  }
]

// Per concept type: the field/type metadata this page's Find/Replace With sections are built
// from, plus the query and columns BulkActionsSelectedConcepts needs to list the selection.
// Only 'collections' exists today -- a second concept type is a new key here, following the
// same shape, once its own fields/types and query/columns are known.
const BULK_UPDATE_CONFIG = {
  collections: {
    fields: COLLECTION_BULK_UPDATE_FIELDS,
    types: COLLECTION_BULK_UPDATE_TYPES,
    selectedListQuery: GET_COLLECTIONS,
    selectedListColumns: COLLECTION_SELECTED_LIST_COLUMNS
  }
}

// Whether bulk-update has any configuration for this concept type at all -- used to redirect
// away from the bulk-actions edit page for a :type with no entry here, since rendering it
// otherwise reaches BulkActionsSelectedConcepts with an undefined query and crashes.
export const isBulkUpdateSupportedForConceptType = (conceptType) => (
  Boolean(BULK_UPDATE_CONFIG[conceptType])
)

export const getBulkUpdateFields = (conceptType) => (
  BULK_UPDATE_CONFIG[conceptType]?.fields || []
)

export const getBulkUpdateTypes = (conceptType) => (
  BULK_UPDATE_CONFIG[conceptType]?.types || []
)

export const getBulkUpdateFieldConfig = (conceptType, fieldValue) => (
  getBulkUpdateFields(conceptType).find(({ value }) => value === fieldValue)
)

export const getBulkUpdateTypeConfig = (conceptType, typeValue) => (
  getBulkUpdateTypes(conceptType).find(({ value }) => value === typeValue)
)

// Whether updateType is usable with updateField -- every type is usable with every field
// except FIND_AND_UPDATE_HOME_PAGE_URL, which the docs restrict to DATA_CENTERS only.
export const isUpdateTypeAvailableForField = (conceptType, typeValue, fieldValue) => {
  const typeConfig = getBulkUpdateTypeConfig(conceptType, typeValue)
  const { onlyForFields } = typeConfig || {}

  if (!onlyForFields) return true

  return onlyForFields.includes(fieldValue)
}

// The query + Table columns BulkActionsSelectedConcepts needs to list a concept type's
// selected items -- the one piece of per-concept-type config that isn't about Find/Replace
// With field metadata.
export const getBulkActionsSelectedListAdapter = (conceptType) => {
  const { selectedListQuery, selectedListColumns } = BULK_UPDATE_CONFIG[conceptType] || {}

  return {
    query: selectedListQuery,
    columns: selectedListColumns
  }
}
