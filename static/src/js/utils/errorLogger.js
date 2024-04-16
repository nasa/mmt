import { getApplicationConfig } from '../../../../sharedUtils/getConfig'

/**
 * Calls errorLogger lambda /error-logger to log out any error
 * @param {Object} error An error object with the error message and stacktrace.
 * @param {string} action A string describing the action attempted.
 */
const errorLogger = async (error, action) => {
  const location = window.location.href
  const errorObj = {
    message: error.message,
    stack: error.stack,
    location,
    action
  }
  const { apiHost } = getApplicationConfig()

  const options = {
    method: 'POST',
    body: JSON.stringify(errorObj)
  }

  await fetch(`${apiHost}/error-logger`, (options))
    .then((response) => response.text())
    .catch((err) => err)
}

export default errorLogger
