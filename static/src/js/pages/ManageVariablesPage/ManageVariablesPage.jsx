import React from 'react'
import { Col, Row } from 'react-bootstrap'

import Page from '../../components/Page/Page'

/**
 * Renders a `ManageVariablesPage` component
 *
 * @component
 * @example <caption>Renders a `ManageVariablesPage` component</caption>
 * return (
 *   <ManageVariablesPage />
 * )
 */
const ManageVariablesPage = () => (
  <Page title="Manage Variables">
    <Row>
      <Col>
        This is the page manage variables page content
      </Col>
    </Row>
  </Page>
)

export default ManageVariablesPage
