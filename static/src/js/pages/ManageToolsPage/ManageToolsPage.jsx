import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import Page from '../../components/Page/Page'

/**
 * Renders a `ManageToolsPage` component
 *
 * @component
 * @example <caption>Renders a `ManageToolsPage` component</caption>
 * return (
 *   <ManageToolsPage />
 * )
 */
const ManageToolsPage = () => (
  <Page title="Manage Tools">
    <Row>
      <Col>
        This is the page manage tools page content
      </Col>
    </Row>
  </Page>
)

export default ManageToolsPage
