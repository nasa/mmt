import { camelCase } from 'lodash-es'

const xpath = require('xpath')
const DOM = require('@xmldom/xmldom').DOMParser

/**
 * Parses the SAML response provided from launchpad during a callback
 * @param {*} saml the SAML response
 * @returns the attributes found in the response (i.e., auid, email, etc.)
 */
const parseSaml = (saml) => {
  const profile = {}
  const xml = Buffer.from(saml, 'base64').toString('ascii')
  const doc = new DOM().parseFromString(xml, 'text/xml')

  const attributes = xpath.select('//*[local-name() = "AttributeStatement"]/*', doc)
  attributes.forEach((attribute) => {
    const name = xpath.select('string(@Name)', attribute)
    profile[camelCase(name)] = xpath.select('string(*[local-name() = "AttributeValue"]/text())', attribute)
  })

  return profile
}

export default parseSaml
