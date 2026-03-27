import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export class MCPClient {
  constructor(apiBaseUrl = '/api') {
    this.sessionId = null
    const api = 'http://localhost:8000/api'
    this.http = axios.create({
      baseURL: api,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    })

    // Add response interceptor for error handling
    this.http.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Client Error:', error)

        return Promise.reject(error)
      }
    )
  }

  async initialize() {
    try {
      // Check health and get available tools
      const toolsResponse = await this.http.get('/tools')

      // Generate a simple session ID for tracking
      this.sessionId = uuidv4()

      return {
        tools: toolsResponse.data.tools.map((tool) => ({
          name: tool.toolSpec.name,
          description: tool.toolSpec.description,
          inputSchema: tool.toolSpec.inputSchema?.json
        }))
      }
    } catch (error) {
      console.error('Failed to initialize API client:', error)
      throw error
    }
  }

  getSessionId() {
    return this.sessionId
  }
}
