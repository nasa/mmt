import { useState, useCallback } from 'react'

export const useConversation = (conversationService) => {
  const [state, setState] = useState({
    messages: [],
    messageJsonData: {},
    isLoading: false,
    error: undefined
  })

  const sendMessage = useCallback(async (content) => {
    if (!conversationService) {
      setState((prev) => ({
        ...prev,
        error: 'Conversation service not available'
      }))

      return
    }

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: undefined
    }))

    try {
      // Add user message
      const userMessage = {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        content: [{
          type: 'text',
          text: content
        }],
        timestamp: new Date()
      }

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage]
      }))

      // Get response from conversation service
      const { response, toolCalls, messageJsonData } = await conversationService.sendMessage(content)

      // Create assistant message
      const assistantContent = []

      if (toolCalls && toolCalls.length > 0) {
        // Add tool calls to content
        toolCalls.forEach((toolCall) => {
          assistantContent.push({
            type: 'tool_use',
            toolUse: toolCall
          })
        })
      }

      if (response) {
        assistantContent.push({
          type: 'text',
          text: response
        })
      }

      const assistantMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date()
      }

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        messageJsonData,
        isLoading: false
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message'
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
    }
  }, [conversationService])

  const clearMessages = useCallback(() => {
    setState({
      messages: [],
      messageJsonData: {},
      isLoading: false,
      error: undefined
    })

    if (conversationService) {
      conversationService.clearConversation()
    }
  }, [conversationService])

  const addToolResult = useCallback((toolUseId, result) => {
    const toolResultMessage = {
      id: `msg-${Date.now()}-tool-result`,
      role: 'assistant',
      content: [{
        type: 'tool_result',
        toolResult: {
          toolUseId,
          content: [{
            type: 'text',
            text: result
          }]
        }
      }],
      timestamp: new Date()
    }

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, toolResultMessage]
    }))
  }, [])

  return {
    ...state,
    sendMessage,
    clearMessages,
    addToolResult
  }
}
