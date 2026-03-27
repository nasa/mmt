import React, {
  useState,
  useRef,
  useEffect
} from 'react'
import { FaPaperPlane, FaTrash } from 'react-icons/fa'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import { MessageBubble } from './MessageBubble'

export const ChatInterface = ({
  messages,
  isLoading,
  error,
  onSendMessage,
  onClearMessages,
  editorMode
}) => {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="d-flex flex-column h-100 bg-white">
      {/* Header with Clear Button */}
      {
        messages.length > 0 && (
          <div className="border-bottom px-3 py-2 d-flex justify-content-between align-items-center">
            <span className="text-muted small">
              {messages.length}
              {' '}
              message
              {messages.length !== 1 ? 's' : ''}
            </span>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={onClearMessages}
              title="Clear all messages"
            >
              <FaTrash className="me-1" size={12} />
              Clear
            </Button>
          </div>
        )
      }

      {/* Messages */}
      <div className="flex-grow-1 overflow-auto p-3">
        {
          messages.length === 0 && (
            <div className="d-flex flex-column align-items-center justify-content-center h-100">
              <div className="text-center mb-4">
                <h3 className="h5 mb-2">
                  Welcome to NASA Metadata Validator
                </h3>
                <p className="text-muted small">
                  Try one of these prompts to get started:
                </p>
              </div>

              <div className="d-grid gap-3 w-100" style={{ maxWidth: '600px' }}>
                <Button
                  variant="outline-primary"
                  className="text-start p-3"
                  onClick={
                    () => {
                      const prompt = 'Validate metadata for collection C2980666614-LAADS'
                      setInput(prompt)
                      onSendMessage(prompt)
                    }
                  }
                >
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <Badge bg="primary" className="p-2">✓</Badge>
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold small mb-1">
                        Validate a Collection
                      </div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Validate metadata for collection C2980666614-LAADS
                      </div>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline-primary"
                  className="text-start p-3"
                  onClick={
                    () => {
                      const prompt = 'List the CMR providers'
                      setInput(prompt)
                      onSendMessage(prompt)
                    }
                  }
                >
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold small mb-1">
                        Browse Providers
                      </div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                        List the CMR providers
                      </div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          )
        }

        {
          messages.map((message) => (
            <div key={message.id} className="mb-3">
              {
                message.content.map((content, idx) => {
                  if (content.type === 'text') {
                    return (
                      <MessageBubble
                        key={idx}
                        message={content.text || ''}
                        isUser={message.role === 'user'}
                        timestamp={message.timestamp}
                      />
                    )
                  }

                  if (content.type === 'tool_result') {
                    return (
                      <Alert key={idx} variant="info" className="ms-5">
                        <Alert.Heading as="h6" className="small mb-2">
                          Tool Result
                        </Alert.Heading>
                        <pre className="mb-0 small">
                          {content.toolResult?.content[0]?.text}
                        </pre>
                      </Alert>
                    )
                  }

                  return null
                })
              }
            </div>
          ))
        }

        {
          isLoading && (
            <div className="d-flex justify-content-center">
              <div className="bg-light rounded px-3 py-2">
                <Spinner animation="border" size="sm" className="me-2" />
                <span className="text-muted small">Processing...</span>
              </div>
            </div>
          )
        }

        {
          error && (
            <Alert variant="danger">
              <strong>Error:</strong>
              {' '}
              {error}
            </Alert>
          )
        }

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-top p-3">
        <div className="d-flex gap-2">
          <Form.Control
            as="textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about metadata validation, reports, or get recommendations..."
            rows={2}
            disabled={isLoading}
            style={{ resize: 'none' }}
          />
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={!input.trim() || isLoading || editorMode}
            style={{ minWidth: '60px' }}
          >
            <FaPaperPlane />
          </Button>
        </div>
      </div>
    </div>
  )
}
