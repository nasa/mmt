import { merge } from 'lodash-es'
import staticConfig from '../static.config.json'
import overrideConfig from '../overrideStatic.config.json'

console.log('🚀 ~ file: getConfig.js:6 ~ overrideConfig:', overrideConfig)

const getConfig = () => merge({}, staticConfig, overrideConfig)
console.log('🚀 ~ file: getConfig.js:8 ~ getConfig:', getConfig())
// const getConfig = () => staticConfig

export const getApplicationConfig = () => getConfig().application
export const getUmmVersionsConfig = () => getConfig().ummVersions
export const getSamlConfig = () => getConfig().saml
export const getEdlConfig = () => getConfig().edl
