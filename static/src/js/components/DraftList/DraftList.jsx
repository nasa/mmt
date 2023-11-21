import React, { useEffect } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import Page from '../Page/Page'

const DraftList = () => {
  useEffect(() => {
    fetch('http://localhost:3003/keywords/related-urls', {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('🚀 ~ file: DraftList.jsx:11 ~ .then ~ data:', data)
      })
      .catch((error) => {
        console.log('🚀 ~ file: DraftList.jsx:14 ~ useEffect ~ error:', error)
      })
  }, [])

  return (
    <Page title="<Provider> Drafts">
      <Row>
        <Col>
          Draft list goes here
        </Col>
      </Row>
    </Page>
  )
}

export default DraftList
