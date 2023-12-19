import staticConfig from '../../../../static.config.json'

const getConfig = () => staticConfig

export const getApplicationConfig = () => getConfig().application
export const getUmmVersionsConfig = () => getConfig().ummVersions
