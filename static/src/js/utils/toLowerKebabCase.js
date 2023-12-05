import { kebabCase, toLower } from 'lodash'

/**
 * Returned a kebabCased version of the display name.
 * This special kebabCase is needed because if the string is
 * "Related URLs", the kebabCase from lodash converts to related-ur-ls
 * e.x: toLowerKebabCase("Related URLs") -> related-urls
 * @param {string} displayName Name of the field that needs to be parsed
 * @returns {string} kebab case of the display name
 */
const toLowerKebabCase = (displayName) => kebabCase(toLower(displayName))

export default toLowerKebabCase
