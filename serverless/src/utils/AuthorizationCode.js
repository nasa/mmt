/**
 * Minimal OAuth2 Authorization Code client.
 *
 * This is a small, dependency-free subset of `simple-oauth2` used by our
 * serverless auth flows. It exchanges an authorization code for an access token.
 */
class AuthorizationCode {
  /**
   * @param {Object} config
   * @param {Object} config.client
   * @param {string} config.client.id OAuth client ID.
   * @param {string} config.client.secret OAuth client secret.
   * @param {Object} config.auth
   * @param {string} config.auth.tokenHost Base URL for the OAuth provider (e.g. `https://edl.example.com`).
   * @param {string} config.auth.tokenPath Token endpoint path (e.g. `/oauth/token`).
   */
  constructor(config) {
    this.config = config
  }

  /**
   * Exchanges an authorization code for an access token.
   *
   * @param {Object} tokenConfig
   * @param {string} tokenConfig.grant_type Expected to be `authorization_code`.
   * @param {string} tokenConfig.code Authorization code from the OAuth provider.
   * @param {string} tokenConfig.redirect_uri Redirect URI used during authorization.
   * @returns {Promise<{token: {access_token: string, refresh_token: (string|undefined), expires_at: number}}>}
   * `expires_at` is returned as a unix timestamp in seconds.
   * @throws {Error} When the upstream response is non-2xx, invalid JSON is returned, or the request fails.
   */
  async getToken(tokenConfig) {
    const { client, auth } = this.config
    const { id: clientId, secret: clientSecret } = client
    const { tokenHost, tokenPath } = auth

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    const tokenUrl = `${tokenHost}${tokenPath}`

    const body = new URLSearchParams({
      grant_type: tokenConfig.grant_type,
      code: tokenConfig.code,
      redirect_uri: tokenConfig.redirect_uri
    })

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`
        },
        body: body.toString()
      })

      const responseText = await response.text()

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`)
      }

      const token = JSON.parse(responseText)
      const expiresAt = Math.floor(Date.now() / 1000) + token.expires_in

      return {
        token: {
          access_token: token.access_token,
          refresh_token: token.refresh_token,
          expires_at: expiresAt
        }
      }
    } catch (error) {
      console.error('Authentication Error:', error.message)
      console.error('Error Stack:', error.stack)
      throw error // Re-throw the error to be caught in the calling function
    }
  }
}

export default AuthorizationCode
