import {
  useState,
  useEffect,
  useRef
} from 'react'
import { MCPClient } from '../services/mcpClient'
import { ConversationService } from '../services/conversationService'

export const useChat = () => {
  const [client, setClient] = useState(null)
  const [conversationService, setConversationService] = useState(null)
  const [tools, setTools] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const initializeRef = useRef(false)

  useEffect(() => {
    const initializeClient = async () => {
      if (initializeRef.current) return
      initializeRef.current = true

      try {
        setIsLoading(true)
        setError(null)

        const mcpClient = new MCPClient()
        const { tools } = await mcpClient.initialize()
        console.log('🚀 ~ file: useChat.js:29 ~ tools:', tools)

        setClient(mcpClient)
        setConversationService(new ConversationService(mcpClient))
        setTools(tools)
        setIsInitialized(true)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize MCP client'
        setError(errorMessage)
        console.error('MCP Client initialization failed:', err)
      } finally {
        setIsLoading(false)
      }
    }

    initializeClient()
  }, [])

  const reinitialize = async () => {
    initializeRef.current = false
    setIsInitialized(false)
    setClient(null)
    setConversationService(null)
    setTools([])

    // Trigger re-initialization
    const initializeClient = async () => {
      if (initializeRef.current) return
      initializeRef.current = true

      try {
        setIsLoading(true)
        setError(null)

        const mcpClient = new MCPClient()
        const { tools } = await mcpClient.initialize()

        setClient(mcpClient)
        setConversationService(new ConversationService(mcpClient))
        setTools(tools)
        setIsInitialized(true)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize MCP client'
        setError(errorMessage)
        console.error('MCP Client re-initialization failed:', err)
      } finally {
        setIsLoading(false)
      }
    }

    await initializeClient()
  }

  return {
    client,
    conversationService,
    tools,
    isInitialized,
    isLoading,
    error,
    reinitialize
  }
}
