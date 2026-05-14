import { merge } from 'lodash-es'
import staticConfig from '../static.config.json'
import overrideConfig from '../overrideStatic.config.json'

const getConfig = () => merge({}, staticConfig, overrideConfig)
export const getApplicationConfig = () => getConfig().application
export const getUmmVersionsConfig = () => getConfig().ummVersions
export const getSamlConfig = () => getConfig().saml
export const getEdlConfig = () => getConfig().edl
