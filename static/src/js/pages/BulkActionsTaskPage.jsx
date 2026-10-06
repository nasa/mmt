import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Collapse from 'react-bootstrap/Collapse'

/**
 * Renders a `BulkActionsTaskPage` component
 *
 * @component
 * @example <caption>Renders the status page for a specific bulk update job</caption>
 * return (
 *   <BulkActionsTaskPage />
 * )
 */
const BulkActionsTaskPage = () => {
  const { taskId } = useParams()
  const navigate = useNavigate()

  // State to track which error rows are expanded
  const [expandedRows, setExpandedRows] = useState({})

  // Dummy data representing individual collection updates
  const mockCollections = [
    {
      conceptId: 'C120000001-MMT_1',
      provider: 'MMT_1',
      shortName: 'MOD09GQ',
      version: '006',
      status: 'UPDATED',
      errorMessage: null
    },
    {
      conceptId: 'C120000002-MMT_1',
      provider: 'MMT_1',
      shortName: 'MYD09GA',
      version: '006',
      status: 'UPDATED',
      errorMessage: null
    },
    {
      conceptId: 'C120000003-MMT_1',
      provider: 'MMT_1',
      shortName: 'MOD13Q1',
      version: '006',
      status: 'FAILED',
      errorMessage: '/PublicationReferences/2 object instance has properties which are not allowed by the schema: ["_errors"]'
    },
    {
      conceptId: 'C120000004-MMT_1',
      provider: 'MMT_1',
      shortName: 'MYD13Q1',
      version: '006',
      status: 'FAILED',
      errorMessage: 'Collection was updated successfully, but translating the collection to UMM-C had the following issues: [:RelatedUrls 4 :URL] [http://invalid-url.gov] is not a valid URL'
    },
    {
      conceptId: 'C120000005-MMT_1',
      provider: 'MMT_1',
      shortName: 'MOD11A1',
      version: '006',
      status: 'PENDING',
      errorMessage: null
    }
  ]

  // Calculate job statistics for the progress bar
  const total = mockCollections.length
  const updated = mockCollections.filter(c => c.status === 'UPDATED').length
  const failedCollections = mockCollections.filter(c => c.status === 'FAILED')
  const failedCount = failedCollections.length
  const pending = mockCollections.filter(c => c.status === 'PENDING').length

  const percentComplete = Math.round(((updated + failedCount) / total) * 100)

  // Toggle function for expanding/collapsing error rows
  const toggleRow = (conceptId) => {
    setExpandedRows(prev => ({
      ...prev,
      [conceptId]: !prev[conceptId]
    }))
  }

  // Handler to create a new bulk update queue from the failed jobs
  const handleRetryFailed = () => {
    // Map the failed collections into the format expected by the edit page
    const retrySelections = failedCollections.map(col => ({
      conceptId: col.conceptId,
      provider: col.provider,
      shortName: col.shortName,
      version: col.version
    }))
    
    navigate('/collections/bulk-actions/edit', { state: { selectedCollections: retrySelections } })
  }

  // Helper function to render status badges
  const getStatusBadge = (status) => {
    switch (status) {
      case 'UPDATED':
        return <Badge bg="success">UPDATED</Badge>
      case 'FAILED':
        return <Badge bg="danger">FAILED</Badge>
      case 'PENDING':
        return <Badge bg="warning" text="dark">PENDING</Badge>
      default:
        return <Badge bg="secondary">{status}</Badge>
    }
  }

  return (
    <Container fluid className="py-4">
      {/* Page Header */}
      <Row className="mb-4 align-items-center">
        <Col>
          <div className="d-flex align-items-center mb-2">
            <Button 
              variant="link" 
              className="p-0 text-decoration-none me-3 text-secondary"
              onClick={() => navigate('/collections/bulk-actions')}
            >
              <i className="bi bi-arrow-left me-1"></i> Back to All Jobs
            </Button>
          </div>
          <h1 className="h3 fw-bold mb-1">Job Status: {taskId || 'BU-1005'}</h1>
          <p className="text-muted mb-0">Monitor the progress of your bulk update.</p>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          {failedCount > 0 && (
            <Button 
              variant="warning" 
              className="fw-semibold"
              onClick={handleRetryFailed}
            >
              <i className="bi bi-arrow-repeat me-1"></i> New Bulk Update from Failed
            </Button>
          )}
          <Button variant="outline-primary">
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </Button>
          <Button variant="secondary">
            <i className="bi bi-download me-1"></i> Download CSV
          </Button>
        </Col>
      </Row>

      {/* Progress & Summary Bar */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Row className="align-items-center mb-3">
                <Col>
                  <h5 className="fw-bold mb-0">Overall Progress</h5>
                </Col>
                <Col xs="auto" className="fw-bold text-primary">
                  {percentComplete}% Complete
                </Col>
              </Row>
              
              <ProgressBar className="mb-4" style={{ height: '25px' }}>
                <ProgressBar variant="success" now={(updated / total) * 100} key={1} />
                <ProgressBar variant="danger" now={(failedCount / total) * 100} key={2} />
              </ProgressBar>

              <Row className="text-center">
                <Col className="border-end">
                  <div className="text-muted small text-uppercase fw-bold">Total</div>
                  <div className="fs-4 fw-bold">{total}</div>
                </Col>
                <Col className="border-end">
                  <div className="text-success small text-uppercase fw-bold">Updated</div>
                  <div className="fs-4 fw-bold">{updated}</div>
                </Col>
                <Col className="border-end">
                  <div className="text-danger small text-uppercase fw-bold">Failed</div>
                  <div className="fs-4 fw-bold">{failedCount}</div>
                </Col>
                <Col>
                  <div className="text-warning small text-uppercase fw-bold">Pending</div>
                  <div className="fs-4 fw-bold">{pending}</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Collections Table */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-light fw-bold py-3 d-flex justify-content-between align-items-center">
              <span>Collection Details</span>
              <span className="badge bg-secondary">{total} Items</span>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Concept ID</th>
                    <th>Short Name</th>
                    <th>Version</th>
                    <th>Status</th>
                    <th className="text-end pe-4">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCollections.map((col) => (
                    <React.Fragment key={col.conceptId}>
                      {/* Main Collection Row */}
                      <tr>
                        <td className="ps-4 align-middle fw-semibold text-primary">{col.conceptId}</td>
                        <td className="align-middle">{col.shortName}</td>
                        <td className="align-middle">{col.version}</td>
                        <td className="align-middle">{getStatusBadge(col.status)}</td>
                        <td className="text-end pe-4 align-middle">
                          {col.status === 'FAILED' ? (
                            <Button 
                              variant={expandedRows[col.conceptId] ? 'secondary' : 'outline-danger'}
                              size="sm"
                              onClick={() => toggleRow(col.conceptId)}
                            >
                              {expandedRows[col.conceptId] ? 'Hide Error' : 'View Error'}
                            </Button>
                          ) : (
                            <span className="text-muted small">No errors</span>
                          )}
                        </td>
                      </tr>
                      
                      {/* Expandable Error Row */}
                      {col.status === 'FAILED' && (
                        <tr>
                          <td colSpan="5" className="p-0 border-0">
                            <Collapse in={expandedRows[col.conceptId]}>
                              <div className="bg-danger bg-opacity-10 p-3 border-start border-danger border-4 m-2 rounded">
                                <h6 className="fw-bold text-danger mb-1">
                                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                  Validation Error
                                </h6>
                                <p className="mb-0 font-monospace text-dark" style={{ fontSize: '0.9rem' }}>
                                  {col.errorMessage}
                                </p>
                              </div>
                            </Collapse>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default BulkActionsTaskPage
