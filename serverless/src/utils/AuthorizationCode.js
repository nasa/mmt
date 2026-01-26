class AuthorizationCode {
  constructor(config) {
    this.config = config
  }

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
