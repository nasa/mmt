import { getApplicationConfig } from '../../../static/src/js/utils/getConfig'

const errorLogger = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()
  const { body } = event

  const {
    message,
    stack
  } = JSON.parse(body)

  console.error('Error reported', `Message: ${message} - Stack: ${JSON.stringify(stack)}`)

  return {
    statusCode: 200,
    headers: defaultResponseHeaders
  }
}

export default errorLogger
