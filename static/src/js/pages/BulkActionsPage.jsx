import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'

/**
 * Renders a `BulkActionsPage` component
 *
 * @component
 * @example <caption>Renders the Bulk Actions Job History Dashboard</caption>
 * return (
 *   <BulkActionsPage />
 * )
 */
const BulkActionsPage = () => {
  const location = useLocation()
  
  // State for the selected provider in the dropdown
  const [selectedProvider, setSelectedProvider] = useState('')

  // Mock list of available providers
  const providers = ['MMT_1', 'MMT_2', 'LPDAAC_ECS', 'GES_DISC', 'NSIDC_ECS']

  // Mock data for previous bulk updates (Focusing on MMT_1)
  const [mockJobs, setMockJobs] = useState({
    MMT_1: [
      {
        jobId: 'BU-1004',
        status: 'COMPLETE',
        userId: 'asmith',
        createdAt: '2026-09-28 10:15:00 UTC',
        totalCollections: 150
      },
      {
        jobId: 'BU-1003',
        status: 'FAILED',
        userId: 'bjones',
        createdAt: '2026-09-27 14:30:00 UTC',
        totalCollections: 12
      },
      {
        jobId: 'BU-1002',
        status: 'COMPLETE',
        userId: 'asmith',
        createdAt: '2026-09-20 09:00:00 UTC',
        totalCollections: 840
      }
    ],
    MMT_2: [
      {
        jobId: 'BU-1001',
        status: 'COMPLETE',
        userId: 'cwilliams',
        createdAt: '2026-09-15 11:20:00 UTC',
        totalCollections: 50
      }
    ]
  })

  // If the user just navigated here from the Edit page, we simulate adding a new "PENDING" job
  useEffect(() => {
    // We can infer they just came from the edit page if we wanted to pass state, 
    // but for demonstration, we will just auto-select MMT_1 if they arrive fresh
    // and optionally inject a mock pending job to simulate the submission.
    if (location.state?.selectedCollections) {
      setSelectedProvider('MMT_1')
      setMockJobs(prev => ({
        ...prev,
        MMT_1: [
          {
            jobId: `BU-1005`,
            status: 'PENDING',
            userId: 'current_user',
            createdAt: '2026-10-01 12:00:00 UTC',
            totalCollections: location.state.selectedCollections.length
          },
          ...prev.MMT_1
        ]
      }))
    } else {
      // Default to MMT_1 just to show the table for the mockup
      setSelectedProvider('MMT_1')
    }
  }, [location.state])

  // Helper function to render colored status badges
  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETE':
        return <Badge bg="success">COMPLETE</Badge>
      case 'FAILED':
        return <Badge bg="danger">FAILED</Badge>
      case 'PENDING':
      case 'IN_PROGRESS':
        return <Badge bg="warning" text="dark">{status}</Badge>
      default:
        return <Badge bg="secondary">{status}</Badge>
    }
  }

  // Get jobs for the currently selected provider
  const currentJobs = mockJobs[selectedProvider] || []

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="h3 fw-bold mb-1">Bulk Actions History</h1>
          <p className="text-muted mb-0">
            View past bulk updates and monitor pending jobs.
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Form.Group>
                <Form.Label className="fw-semibold">Select Provider Context</Form.Label>
                <Form.Select 
                  value={selectedProvider} 
                  onChange={(e) => setSelectedProvider(e.target.value)}
                >
                  <option value="" disabled>Select a provider...</option>
                  {providers.map(provider => (
                    <option key={provider} value={provider}>{provider}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-light fw-bold py-3">
              {selectedProvider ? `Job History: ${selectedProvider}` : 'Job History'}
            </Card.Header>
            <Card.Body className="p-0">
              {selectedProvider === '' ? (
                <div className="text-center py-5 text-muted">
                  <h5>No Provider Selected</h5>
                  <p>Please select a provider from the dropdown above to view bulk update history.</p>
                </div>
              ) : currentJobs.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <h5>No Bulk Updates Found</h5>
                  <p>There are no past bulk updates for {selectedProvider}.</p>
                </div>
              ) : (
                <Table responsive hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Job ID</th>
                      <th>Status</th>
                      <th>Total Collections</th>
                      <th>User ID</th>
                      <th>Created At</th>
                      <th className="text-end pe-4">Logs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentJobs.map((job) => (
                      <tr key={job.jobId}>
                        <td className="ps-4 align-middle fw-semibold text-primary" style={{ cursor: 'pointer' }}>
                          {job.jobId}
                        </td>
                        <td className="align-middle">
                          {getStatusBadge(job.status)}
                        </td>
                        <td className="align-middle">{job.totalCollections}</td>
                        <td className="align-middle">{job.userId}</td>
                        <td className="align-middle">{job.createdAt}</td>
                        <td className="text-end pe-4 align-middle">
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            disabled={job.status === 'PENDING'}
                          >
                            <i className="bi bi-download me-1"></i> 
                            CSV Report
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default BulkActionsPage
