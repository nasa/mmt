import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { useParams } from 'react-router'

import Page from '../Page/Page'

const DraftPreview = () => {
  const { conceptId } = useParams()

  return (
    <Page title="Tool Drafts">
      <Row>
        <Col>
          conceptId:
          {' '}
          {conceptId}
        </Col>
      </Row>
    </Page>
  )
}

export default DraftPreview
