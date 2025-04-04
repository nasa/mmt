import typeParamToHumanizedStringMap from '../constants/typeParamToHumanizedStringMap'

/**
 * Takes a type from the url and returns a humanized singular or plural version
 * @param {String} type The type from the url.
 * @param {Boolean} [plural] A boolean that determines whether or not the string should be plural
 */

const getHumanizedNameFromTypeParam = (type, plural) => {
  const humanizedName = typeParamToHumanizedStringMap[type]

  return plural ? `${humanizedName}s` : humanizedName
}

export default getHumanizedNameFromTypeParam
