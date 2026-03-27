import axios from 'axios'

export class ConversationService {
  constructor(mcpClient, apiBaseUrl = 'http://localhost:8000') {
    this.mcpClient = mcpClient
    this.messages = []
    this.messageJsonData = {
      invalidJson: {},
      validJson: {}
    }

    this.apiBaseUrl = apiBaseUrl
  }

  async sendMessage(userMessage) {
    // Add user message to conversation
    this.messages.push({
      role: 'user',
      content: [{ text: userMessage }]
    })

    try {
      // Send conversation to backend API for processing
      const response = await axios.post(`${this.apiBaseUrl}/api/conversation`, {
        messages: this.messages,
        sessionId: this.mcpClient.getSessionId()
      })

      // const response2 = {
      //   data: {
      //     data: {
      //       content: [
      //         {
      //           type: 'text',
      //           text: '["ESA","GHRC","ECHO","ISRO","EDF_DEV04","ASF","EUMETSAT","CDDIS","JAXA","AU_AADC","ECHO10_OPS","LANCEAMSR2","GESDISCCLD","GHRSSTCWIC","LARC_CLOUD","LANCEMODIS","NSIDCV0","NSIDC_ECS","NCCS","OBPG","OMINRT","USGS_LTA","ASIPS","NSIDC_CPRD","ORNL_CLOUD","FEDEO","MLHUB","LAADS","LARC_ASDC","LPDAAC_ECS","NOAA_NCEI","OB_DAAC","XYZ_PROV","GHRC_DAAC","CSDA","NRSCC","CEOS_EXTRA","AMD_KOPRI","AMD_USAPDC","LARC","SCIOPS","USGS_EROS","LPCUMULUS","MOPITT","GHRC_CLOUD","LPCLOUD","ORNL_DAAC","CCMEO","POCLOUD","PODAAC","SEDAC","GES_DISC","LM_FIRMS","ENVIDAT","JM_PROV1","TROPICSDPC","INPE","ESDIS","OB_CLOUD","USGS"]'
      //         }
      //       ],
      //       isError: false,
      //       structured_content: null
      //     },
      //     message: {
      //       role: 'assistant',
      //       content: [
      //         {
      //           text: 'Here is the list of CMR providers:\n\n- ESA\n- GHRC\n- ECHO\n- ISRO\n- EDF_DEV04\n- ASF\n- EUMETSAT\n- CDDIS\n- JAXA\n- AU_AADC\n- ECHO10_OPS\n- LANCEAMSR2\n- GESDISCCLD\n- GHRSSTCWIC\n- LARC_CLOUD\n- LANCEMODIS\n- NSIDCV0\n- NSIDC_ECS\n- NCCS\n- OBPG\n- OMINRT\n- USGS_LTA\n- ASIPS\n- NSIDC_CPRD\n- ORNL_CLOUD\n- FEDEO\n- MLHUB\n- LAADS\n- LARC_ASDC\n- LPDAAC_ECS\n- NOAA_NCEI\n- OB_DAAC\n- XYZ_PROV\n- GHRC_DAAC\n- CSDA\n- NRSCC\n- CEOS_EXTRA\n- AMD_KOPRI\n- AMD_USAPDC\n- LARC\n- SCIOPS\n- USGS_EROS\n- LPCUMULUS\n- MOPITT\n- GHRC_CLOUD\n- LPCLOUD\n- ORNL_DAAC\n- CCMEO\n- POCLOUD\n- PODAAC\n- SEDAC\n- GES_DISC\n- LM_FIRMS\n- ENVIDAT\n- JM_PROV1\n- TROPICSDPC\n- INPE\n- ESDIS\n- OB_CLOUD\n- USGS'
      //         }
      //       ]
      //     },
      //     sessionId: '2c7d790d-0600-4248-87f5-760d3c64cb65'
      //   },
      //   status: 200,
      //   statusText: 'OK',
      //   headers: {
      //     'content-length': '1621',
      //     'content-type': 'application/json'
      //   },
      //   config: {
      //     transitional: {
      //       silentJSONParsing: true,
      //       forcedJSONParsing: true,
      //       clarifyTimeoutError: false,
      //       legacyInterceptorReqResOrdering: true
      //     },
      //     adapter: [
      //       'xhr',
      //       'http',
      //       'fetch'
      //     ],
      //     transformRequest: [
      //       null
      //     ],
      //     transformResponse: [
      //       null
      //     ],
      //     timeout: 0,
      //     xsrfCookieName: 'XSRF-TOKEN',
      //     xsrfHeaderName: 'X-XSRF-TOKEN',
      //     maxContentLength: -1,
      //     maxBodyLength: -1,
      //     env: {},
      //     headers: {
      //       Accept: 'application/json, text/plain, */*',
      //       'Content-Type': 'application/json'
      //     },
      //     method: 'post',
      //     url: 'http://localhost:8000/api/conversation',
      //     data: '{"messages":[{"role":"user","content":[{"text":"List the CMR providers"}]}],"sessionId":"2c7d790d-0600-4248-87f5-760d3c64cb65"}',
      //     allowAbsoluteUrls: true
      //   },
      //   request: {}
      // }

      const assistantMessage = response.data.message
      console.log('🚀 ~ file: conversationService.js:52 ~ ConversationService ~ assistantMessage:', assistantMessage)
      this.messages.push(assistantMessage)

      // Extract text content and tool calls
      const textContent = this.extractTextContent(assistantMessage.content)
      const toolCalls = this.extractToolCalls(assistantMessage.content)

      // Extract json data
      const { data } = response
      const { data: toolCallResultData } = data

      // Check if structured_content exists and has the required fields
      if (toolCallResultData && toolCallResultData.structured_content) {
        const { structured_content } = toolCallResultData

        this.messageJsonData = {
          invalidJson: structured_content.invalid_fields || {},
          validJson: structured_content.suggested_changes || {}
        }
      }

      return {
        response: textContent,
        toolCalls,
        messageJsonData: this.messageJsonData
      }
    } catch (error) {
      console.error('Conversation error:', error)
      const message = error.response?.data?.detail || error.message || 'Failed to process conversation'
      throw new Error(message)
    }
  }

  extractTextContent(content) {
    return content
      .filter((item) => item.text)
      .map((item) => item.text)
      .join(' ')
  }

  extractToolCalls(content) {
    return content
      .filter((item) => item.toolUse)
      .map((item) => ({
        name: item.toolUse.name,
        toolUseId: item.toolUse.toolUseId,
        input: item.toolUse.input
      }))
  }

  getMessages() {
    return [...this.messages]
  }

  clearConversation() {
    this.messages = []
    this.messageJsonData = {
      invalidJson: {},
      validJson: {}
    }
  }
}
