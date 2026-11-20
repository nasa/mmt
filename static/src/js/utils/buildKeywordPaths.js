import parseCmrResponse from './parseCmrResponse'

/**
 * Given a keyword scheme's raw CMR response and the uiSchema describing that scheme
 * (`ui:picker_title`, `ui:keyword_scheme_column_names`, `ui:filter`), returns the list of
 * paths (each an array of level values, not yet joined into a string), starting with the
 * scheme's picker title (e.g. 'SCIENCE KEYWORD').
 *
 * @param {Object} keywords The raw keyword tree for this scheme.
 * @param {Object} uiSchema The field's uiSchema.
 */
const buildKeywordPaths = (keywords, uiSchema) => {
  const keywordObject = {}
  const initialValue = uiSchema['ui:picker_title']
  const keywordSchemeColumnNames = uiSchema['ui:keyword_scheme_column_names']
  const initialKeyword = keywordSchemeColumnNames.at(0)

  keywordObject[initialKeyword] = [{
    value: initialValue,
    subfields: [keywordSchemeColumnNames.at(1)],
    ...keywords
  }]

  let paths = parseCmrResponse(keywordObject, keywordSchemeColumnNames)

  if (uiSchema['ui:filter']) {
    paths = paths.filter((path) => (path[1] === uiSchema['ui:filter']))
  }

  return paths
}

export default buildKeywordPaths
