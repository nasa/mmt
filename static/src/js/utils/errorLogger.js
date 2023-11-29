import { getApplicationConfig } from './getConfig'

/**
 * Calls errorLogger lambda /error-logger to log out any error
 * @param {Object} error An error object with the error message and stacktrace.
 */
const errorLogger = async (error) => {
  const errorObj = {
    message: error.message,
    stack: error.stack
  }
  const { apiHost } = getApplicationConfig()
  const options = {
    method: 'POST',
    body: JSON.stringify(errorObj)
  }

  await fetch(`${apiHost}/error-logger`, (options))
    .then((response) => response.text())
    .catch((err) => console.log(err))
}

export default errorLogger
