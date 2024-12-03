import { getApplicationConfig } from '../../../../sharedUtils/getConfig'

/**
 * This is the name of the cookie that MMT uses.
 */
const { env } = getApplicationConfig()

const MMT_COOKIE = `_mmt_jwt_${env}`

export default MMT_COOKIE
