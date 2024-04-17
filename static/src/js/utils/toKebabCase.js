import { kebabCase } from 'lodash-es'

/**
 * Returned a kebabCased version of the display name.
 * This special kebabCase is needed because if the string is
 * "Related URLs", the kebabCase from lodash converts to related-ur-ls
 * e.x: toKebabCase("Related URLs") -> related-urls
 * @param {string} displayName Name of the field that needs to be parsed
 * @returns {string} kebab case of the display name
 */
const toKebabCase = (displayName) => {
  if (displayName === 'Related URLs') {
    return 'related-urls'
  }

  return kebabCase(displayName)
}

export default toKebabCase
