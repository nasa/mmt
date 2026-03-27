import React, { useEffect, useState } from 'react'
import {
  FaComments,
  FaExclamationTriangle,
  FaSync
} from 'react-icons/fa'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import { useChat } from './hooks/useChat'
import { useConversation } from './hooks/useConversation'
import { ChatInterface } from './ChatInterface'

import './ChatMMTPage.scss'

const ChatMMTPage = () => {
  const [activeTab, setActiveTab] = useState('chat')
  const {
    client,
    conversationService,
    tools,
    isInitialized,
    isLoading,
    error,
    reinitialize
  } = useChat()

  const [invalidRecordJson, setInvalidRecordJson] = useState({})
  const [validRecordJson, setValidRecordJson] = useState({})
  const [editorMode, setEditorMode] = useState(false)
  const [conceptId, setConceptId] = useState('')
  const [provider, setProvider] = useState('')

  const conversation = useConversation(conversationService)

  useEffect(() => {
    // Set json information for display, if applicable
    const { messageJsonData } = conversation || {}
    const {
      invalidJson = {}, validJson = {}, conceptId: msgConceptId = '', provider: msgProvider = ''
    } = messageJsonData
    setInvalidRecordJson(invalidJson)
    setValidRecordJson(validJson)
    setConceptId(msgConceptId)
    setProvider(msgProvider)

    if (Object.keys(invalidJson).length > 0 && Object.keys(validJson).length > 0) {
      setEditorMode(true)
    }
  }, [conversation.messageJsonData])

  if (isLoading) {
    return (
      <Container fluid className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <h2 className="h4 mb-2">
            Connecting to NASA Metadata Validator
          </h2>
          <p className="text-muted">Initializing MCP server connection...</p>
        </div>
      </Container>
    )
  }

  if (error || !isInitialized) {
    return (
      <Container fluid className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="text-center" style={{ maxWidth: '500px' }}>
          <FaExclamationTriangle className="text-danger mb-3" size={64} />
          <h2 className="h4 mb-3">
            Connection Failed
          </h2>
          <Alert variant="danger" className="mb-3">
            {error || 'Failed to connect to the MCP server'}
          </Alert>
          <div className="text-muted mb-4">
            <p className="small mb-2">Make sure the server is running:</p>
            <code className="d-block bg-light p-3 rounded">
              Run make dev from the top level of the MCP project
            </code>
          </div>
          <Button variant="primary" onClick={reinitialize}>
            <FaSync className="me-2" />
            Retry Connection
          </Button>
        </div>
      </Container>
    )
  }

  const tabs = [
    {
      id: 'chat',
      name: '',
      icon: FaComments,
      description: 'Chat about metadata validation'

    }
  ]

  const exitEditorMode = () => {
    setEditorMode(false)
  }

  const handleAcceptChanges = async () => {
    if (!conceptId || !provider || !validRecordJson) {
      console.error('Missing required data for bulk update:', {
        conceptId,
        provider,
        validRecordJson
      })

      return
    }

    // Determine the update field based on what's in the validRecordJson
    const updateField = validRecordJson.ScienceKeywords ? 'SCIENCE_KEYWORDS'
      : validRecordJson.LocationKeywords ? 'LOCATION_KEYWORDS'
        : validRecordJson.DataCenters ? 'DATA_CENTERS'
          : validRecordJson.Platforms ? 'PLATFORMS'
            : validRecordJson.Instruments ? 'INSTRUMENTS' : 'SCIENCE_KEYWORDS'

    // Convert field name from SNAKE_CASE to camelCase for JSON access
    const camelCaseField = updateField.charAt(0) + updateField.slice(1).toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())

    // Format the bulk update parameters
    const bulkUpdateParams = {
      provider,
      concept_ids: [conceptId],
      update_type: 'FIND_AND_REPLACE',
      update_field: updateField,
      update_value: validRecordJson[camelCaseField] || validRecordJson,
      find_value: invalidRecordJson[camelCaseField] || invalidRecordJson,
      name: `Update_${conceptId}_${Date.now()}`
    }

    // Create a message to call the bulk update function
    const bulkUpdateMessage = `Bulk update collection with the following parameters:

Provider: ${bulkUpdateParams.provider}
Concept IDs: ${JSON.stringify(bulkUpdateParams.concept_ids)}
Update Type: ${bulkUpdateParams.update_type}
Update Field: ${bulkUpdateParams.update_field}
Update Value: ${JSON.stringify(bulkUpdateParams.update_value, null, 2)}
Find Value: ${JSON.stringify(bulkUpdateParams.find_value, null, 2)}
Name: ${bulkUpdateParams.name}`

    try {
      // Send the bulk update request through the conversation
      await conversation.sendMessage(bulkUpdateMessage)

      // Exit editor mode after initiating the bulk update
      exitEditorMode()
    } catch (error) {
      console.error('Error initiating bulk update:', error)
    }
  }

  return (
    <Container fluid className="chat-mmt-page d-flex flex-column h-100 p-0">
      <header className="bg-white border-bottom shadow-sm">
        <div className="px-4 py-3">
          <Row className="align-items-center">
            <Col>
              <h1 className="h3 mb-1">
                NASA Metadata Validator Dashboard
              </h1>
              <p className="text-muted small mb-0">
                {tools.length}
                {' '}
                tools available
              </p>
            </Col>
          </Row>
        </div>

        {/* Navigation Tabs */}
        <Nav variant="tabs" className="px-4">
          {
            tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <Nav.Item key={tab.id}>
                  <Nav.Link
                    active={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    className="d-flex align-items-center"
                  >
                    <Icon className="me-2" />
                    <span>{tab.name}</span>
                  </Nav.Link>
                </Nav.Item>
              )
            })
          }
        </Nav>
      </header>

      {/* Main content area */}
      <main className="flex-grow-1 overflow-y-auto">
        {
          activeTab === 'chat' && client && (
            <Row className="g-0 h-100">
              <Col md={6} className="border-end bg-white d-flex flex-column">
                <ChatInterface
                  messages={conversation.messages}
                  isLoading={conversation.isLoading}
                  error={conversation.error}
                  onSendMessage={conversation.sendMessage}
                  onClearMessages={conversation.clearMessages}
                  editorMode={editorMode}
                />
              </Col>

              <Col md={6} className="overflow-auto p-4 d-flex flex-column">
                {
                  editorMode ? (
                    <>
                      {/* JSON display */}
                      <div className="flex-grow-1 mb-3 overflow-auto">
                        <h3 className="h5 mb-3">Invalid Fields:</h3>
                        <pre className="bg-light p-3 rounded border mb-4 small">
                          {JSON.stringify(invalidRecordJson, null, 2)}
                        </pre>
                        <h3 className="h5 mb-3">Suggested Changes:</h3>
                        <pre className="bg-light p-3 rounded border small">
                          {JSON.stringify(validRecordJson, null, 2)}
                        </pre>
                      </div>

                      {/* Action buttons */}
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          variant="success"
                          onClick={handleAcceptChanges}
                        >
                          Accept Changes
                        </Button>
                        <Button
                          variant="danger"
                          onClick={exitEditorMode}
                        >
                          Decline
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100">
                      <p className="text-muted">No suggested changes yet.</p>
                    </div>
                  )
                }
              </Col>
            </Row>
          )
        }
      </main>
    </Container>
  )
}

export default ChatMMTPage

