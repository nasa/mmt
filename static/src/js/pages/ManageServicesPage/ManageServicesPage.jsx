import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import Page from '../../components/Page/Page'

/**
 * Renders a `ManageServicesPage` component
 *
 * @component
 * @example <caption>Renders a `ManageServicesPage` component</caption>
 * return (
 *   <ManageServicesPage />
 * )
 */
const ManageServicesPage = () => (
  <Page title="Manage Services">
    <Row>
      <Col>
        This is the page manage services page content
      </Col>
    </Row>
  </Page>
)

export default ManageServicesPage
