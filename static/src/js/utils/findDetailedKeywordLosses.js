import { getBulkUpdateFieldConfig } from '@/js/constants/bulkUpdateFields'

/**
 * DetailedVariable/DetailedLocation are free text, outside KMS control, and deliberately
 * left out of SCIENCE_KEYWORDS'/LOCATION_KEYWORDS' flatFindKeys/updateValueFields in
 * bulkUpdateFields.js -- nowhere in the bulk-update UI lets a user see or set either one.
 * That means a bulk update can erase an existing value on one of these two fields with no
 * warning. This module finds, for a given bulk-update configuration and a set of selected
 * collections' current keyword values, which collections would lose one.
 */
const DETAILED_KEYWORD_FIELD_CONFIG = {
  SCIENCE_KEYWORDS: {
    detailedKey: 'DetailedVariable',
    keywordProperty: 'scienceKeywords'
  },
  LOCATION_KEYWORDS: {
    detailedKey: 'DetailedLocation',
    keywordProperty: 'locationKeywords'
  }
}

// Only these update types replace or remove a whole existing entry -- ADD_TO_EXISTING never
// removes anything, and FIND_AND_UPDATE/FIND_AND_UPDATE_HOME_PAGE_URL aren't offered for
// either keyword field.
const CHECKED_UPDATE_TYPES = ['CLEAR_ALL_AND_REPLACE', 'FIND_AND_REPLACE', 'FIND_AND_REMOVE']

export const getDetailedKeywordFieldConfig = (updateField) => (
  DETAILED_KEYWORD_FIELD_CONFIG[updateField]
)

export const isDetailedKeywordCheckNeeded = (updateField, updateType) => (
  Object.hasOwn(DETAILED_KEYWORD_FIELD_CONFIG, updateField)
  && CHECKED_UPDATE_TYPES.includes(updateType)
)

// Bulk-update field keys (Category, DetailedVariable, ...), from bulkUpdateFields.js, are
// UMM-C's own PascalCase, matching what findValue/updateValue send to CMR's bulk-update
// mutation -- but getCollectionsDetailedKeywords.js's scienceKeywords/locationKeywords come
// back from cmr-graphql with ordinary GraphQL camelCase keys (category, detailedVariable,
// ...), so every lookup against a fetched entry needs this conversion first.
const toEntryKey = (key) => `${key.charAt(0).toLowerCase()}${key.slice(1)}`

// A findValue key only matches a flat scalar -- a blank/missing key is unfilled, and
// matches anything, same as CMR's own find behavior.
const matchesFindValue = (entry, findValue) => (
  Object.entries(findValue || {}).every(([key, value]) => (
    !value || entry[toEntryKey(key)] === value
  ))
)

const buildPathLabel = (entry, pathKeys, detailedKey) => [
  ...pathKeys.map((key) => entry[toEntryKey(key)]).filter(Boolean),
  `${detailedKey}: ${entry[toEntryKey(detailedKey)]}`
].join(' > ')

/**
 * @param {Array<Object>} collections Collections with `conceptId`, `shortName`, `version`,
 * and the raw `scienceKeywords`/`locationKeywords` arrays (as returned by
 * getCollectionsDetailedKeywords.js).
 * @param {Object} params
 * @param {String} params.conceptType The bulk-update concept type (e.g. 'collections'),
 * used to look up the field's flatFindKeys order for building a display path.
 * @param {String} params.updateField
 * @param {String} params.updateType
 * @param {Object} params.findValue
 * @returns {Array<{conceptId: String, shortName: String, version: String, lostEntries: Array<{pathLabel: String}>}>}
 * Only collections with at least one lost entry.
 */
const findDetailedKeywordLosses = (collections, {
  conceptType, updateField, updateType, findValue
}) => {
  const { detailedKey, keywordProperty } = getDetailedKeywordFieldConfig(updateField) || {}

  if (!detailedKey) return []

  const { flatFindKeys } = getBulkUpdateFieldConfig(conceptType, updateField) || {}
  const pathKeys = (flatFindKeys || []).map(({ key }) => key)

  return collections.reduce((losses, collection) => {
    const { conceptId, shortName, version } = collection
    const entries = collection[keywordProperty] || []

    const lostEntries = entries
      .filter((entry) => (
        !!entry[toEntryKey(detailedKey)]
        && (updateType === 'CLEAR_ALL_AND_REPLACE' || matchesFindValue(entry, findValue))
      ))
      .map((entry) => ({ pathLabel: buildPathLabel(entry, pathKeys, detailedKey) }))

    if (lostEntries.length === 0) return losses

    return [
      ...losses,
      {
        conceptId,
        shortName,
        version,
        lostEntries
      }
    ]
  }, [])
}

export default findDetailedKeywordLosses
