import React from 'react'
import { Col, Row } from 'react-bootstrap'

import Page from '../../components/Page/Page'

/**
 * Renders a `ManageCmrPage` component
 *
 * @component
 * @example <caption>Renders a `ManageCmrPage` component</caption>
 * return (
 *   <ManageCmrPage />
 * )
 */
const ManageCmrPage = () => (
  <Page title="Manage CMR">
    <Row>
      <Col>
        This is the page manage CMR page content
      </Col>
    </Row>
  </Page>
)

export default ManageCmrPage