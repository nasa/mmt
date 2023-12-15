import React from 'react'
import Accordion from 'react-bootstrap/Accordion'
import JSONPretty from 'react-json-pretty'

import useAppContext from '../../hooks/useAppContext'

const JsonPreview = () => {
  const {
    draft = {}
  } = useAppContext()

  const { ummMetadata = {} } = draft

  return (
    <Accordion
      defaultActiveKey="0"
      className="mt-5"
    >
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          JSON
        </Accordion.Header>
        <Accordion.Body>
          <JSONPretty data={ummMetadata} />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

export default JsonPreview
