import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'

// Assuming CustomModal is located here based on previous components
import CustomModal from '../components/CustomModal/CustomModal'

/**
 * Renders a `BulkActionsEditPage` component
 *
 * @component
 * @example <caption>Renders a mock workflow for configuring a bulk update</caption>
 * return (
 *   <BulkActionsEditPage />
 * )
 */
const BulkActionsEditPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Initialize state with the selected collections passed from the SearchList component
  const [selectedCollections, setSelectedCollections] = useState(
    location.state?.selectedCollections || []
  )

  // Mock states for the configuration form
  const [actionType, setActionType] = useState('FIND_AND_REPLACE')
  const [targetField, setTargetField] = useState('RelatedUrls')
  const [findValue, setFindValue] = useState('https://old-daac.gov')
  const [replaceValue, setReplaceValue] = useState('https://new-earthdata.nasa.gov')

  // States for the success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [taskId, setTaskId] = useState('')

  // Handler to remove a collection from the list
  const handleRemoveCollection = (conceptIdToRemove) => {
    setSelectedCollections((prev) => prev.filter(c => c.conceptId !== conceptIdToRemove))
  }

  // Derive mock data to display in the Before/After JSON blocks
  const sampleShortName = selectedCollections[0]?.shortName || 'EXAMPLE_COLL'
  const sampleVersion = selectedCollections[0]?.version || '001'

  const beforeJson = {
    ShortName: sampleShortName,
    Version: sampleVersion,
    RelatedUrls: [
      {
        URL: findValue || 'https://old-daac.gov',
        URLContentType: 'PublicationURL',
        Type: 'VIEW RELATED INFORMATION',
        Description: 'The DAAC website provides detailed information.'
      }
    ]
  }

  const afterJson = {
    ShortName: sampleShortName,
    Version: sampleVersion,
    RelatedUrls: [
      {
        URL: replaceValue || 'https://new-earthdata.nasa.gov',
        URLContentType: 'PublicationURL',
        Type: 'VIEW RELATED INFORMATION',
        Description: 'The DAAC website provides detailed information.'
      }
    ]
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real application, this would trigger the backend Search-Modify-Ingest loop
    // and return a real Task ID from the database.
    // For this mockup, we generate a fake ID and show the modal.
    const mockTaskId = `BU-${Math.floor(1000 + Math.random() * 9000)}`
    setTaskId(mockTaskId)
    setShowSuccessModal(true)
  }

  const handleCancel = () => {
    navigate(-1) // Navigates back to the search page
  }

  return (
    <>
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h1 className="h3 fw-bold">Configure Bulk Update</h1>
            <p className="text-muted">
              You are configuring an update for <strong>{selectedCollections.length}</strong> collection(s).
            </p>
          </Col>
        </Row>

        {/* Selected Collections List Section */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm">
              <Card.Header className="bg-light fw-bold d-flex justify-content-between align-items-center">
                <span>Selected Collections ({selectedCollections.length})</span>
              </Card.Header>
              <Card.Body className="p-0">
                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  <Table hover className="mb-0">
                    <thead className="position-sticky top-0 bg-white shadow-sm" style={{ zIndex: 1 }}>
                      <tr>
                        <th className="ps-4 border-bottom-0">Short Name</th>
                        <th className="border-bottom-0">Version</th>
                        <th className="border-bottom-0">Provider</th>
                        <th className="border-bottom-0 text-end pe-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCollections.length > 0 ? (
                        selectedCollections.map((col) => (
                          <tr key={col.conceptId}>
                            <td className="ps-4 align-middle fw-semibold">{col.shortName}</td>
                            <td className="align-middle">{col.version}</td>
                            <td className="align-middle text-muted">{col.provider}</td>
                            <td className="text-end pe-4 align-middle">
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleRemoveCollection(col.conceptId)}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center py-4 text-muted">
                            No collections remaining. Please go back and select collections to update.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Configuration Form Column */}
          <Col lg={4} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Header className="bg-light fw-bold">
                Update Parameters
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Action Type</Form.Label>
                    <Form.Select 
                      value={actionType} 
                      onChange={(e) => setActionType(e.target.value)}
                    >
                      <option value="FIND_AND_REPLACE">Find and Replace</option>
                      <option value="ADD_TO_EXISTING">Add to Existing</option>
                      <option value="CLEAR_ALL_AND_REPLACE">Clear All and Replace</option>
                      <option value="FIND_AND_REMOVE">Find and Remove</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Target Field</Form.Label>
                    <Form.Select 
                      value={targetField} 
                      onChange={(e) => setTargetField(e.target.value)}
                    >
                      <option value="RelatedUrls">RelatedUrls</option>
                      <option value="ScienceKeywords">Science Keywords</option>
                      <option value="Platforms">Platforms</option>
                      <option value="DataCenters">Data Centers</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Find Value</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={findValue} 
                      onChange={(e) => setFindValue(e.target.value)} 
                      placeholder="Enter value to find..."
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Replace Value</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={replaceValue} 
                      onChange={(e) => setReplaceValue(e.target.value)} 
                      placeholder="Enter new value..."
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between pt-3 border-top">
                    <Button variant="outline-secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      type="submit"
                      disabled={selectedCollections.length === 0}
                    >
                      Submit Bulk Update
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Live Preview Column */}
          <Col lg={8}>
            <Card className="shadow-sm h-100">
              <Card.Header className="bg-light fw-bold d-flex justify-content-between align-items-center">
                <span>Diff Preview</span>
                {selectedCollections.length > 0 && (
                  <span className="badge bg-info text-dark">Sample Record: {sampleShortName}</span>
                )}
              </Card.Header>
              <Card.Body>
                <p className="text-muted small mb-4">
                  This is a preview of how your configuration will affect the selected collections. 
                  Collections in older formats will automatically be translated to the latest UMM-JSON schema.
                </p>
                
                {selectedCollections.length > 0 ? (
                  <Row>
                    <Col md={6}>
                      <h6 className="fw-bold text-danger mb-2">Before (Current UMM-JSON)</h6>
                      <pre className="bg-light p-3 rounded border" style={{ fontSize: '0.85rem', overflowX: 'auto' }}>
                        <code>{JSON.stringify(beforeJson, null, 2)}</code>
                      </pre>
                    </Col>
                    <Col md={6}>
                      <h6 className="fw-bold text-success mb-2">After (Proposed UMM-JSON)</h6>
                      <pre className="bg-light p-3 rounded border" style={{ fontSize: '0.85rem', overflowX: 'auto' }}>
                        <code>{JSON.stringify(afterJson, null, 2)}</code>
                      </pre>
                    </Col>
                  </Row>
                ) : (
                  <div className="text-center py-5 text-muted">
                    <p>No collections selected to preview.</p>
                  </div>
                )}

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Success Modal */}
      <CustomModal
        actions={[
          {
            label: 'Close',
            onClick: () => setShowSuccessModal(false),
            variant: 'secondary'
          },
          {
            label: 'View Job Status',
            onClick: () => navigate(`/collections/bulk-actions/${taskId}`),
            variant: 'primary'
          }
        ]}
        header="Bulk Update Submitted"
        message={
          <div className="text-center py-3">
            <i className="bi bi-check-circle text-success" style={{ fontSize: '3rem' }}></i>
            <h4 className="mt-3">Successfully Submitted!</h4>
            <p className="text-muted mb-1">Your bulk update is now processing in the background.</p>
            <p className="fs-5 mt-3">
              Task ID: <span className="fw-bold text-primary">{taskId}</span>
            </p>
          </div>
        }
        show={showSuccessModal}
        toggleModal={setShowSuccessModal}
      />
    </>
  )
}

export default BulkActionsEditPage
