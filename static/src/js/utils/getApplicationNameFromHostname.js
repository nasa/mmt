import { getApplicationConfig } from '../../../../sharedUtils/getConfig'

const getApplicationNameFromHostname = () => {
  const { hostname } = window.location
  if (hostname.startsWith('mmt.')) {
    return 'mmt'
  }

  if (hostname.startsWith('dmmt.')) {
    return 'dmmt'
  }

  // Fall back to the application config
  return getApplicationConfig().name || 'mmt'
}

export default getApplicationNameFromHostname
