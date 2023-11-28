import fetchCmrKeywords from './fetchCmrKeywords'
import parseCmrResponse from './parseCmrResponse'

/**
 * This will call fetchCmrKeywords and retrieve the list of keywords and parse the keywords
 * @param {object} uiSchema uiSchema for the picker
 */
const getPickerKeywords = async (uiSchema) => {
  const keywordObject = {}
  const keywordScheme = uiSchema['ui:keyword_scheme']
  const initialValue = uiSchema['ui:picker_title']
  const keywordSchemeColumnNames = uiSchema['ui:keyword_scheme_column_names']
  const initialKeyword = keywordSchemeColumnNames.at(0)

  const cmrKeywords = await fetchCmrKeywords(keywordScheme)

  keywordObject[initialKeyword] = [{
    value: initialValue,
    subfields: [keywordSchemeColumnNames.at(1)],
    ...cmrKeywords
  }]

  let paths = parseCmrResponse(keywordObject, keywordSchemeColumnNames)
  paths = paths.filter((path) => (path[1] === uiSchema['ui:filter']))

  return paths
}

export default getPickerKeywords
