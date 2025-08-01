import React from 'react'
import Accordion from 'react-bootstrap/Accordion'
import JSONPretty from 'react-json-pretty'
import { cloneDeep } from 'lodash-es'

import useAppContext from '../../hooks/useAppContext'
import removeEmpty from '../../utils/removeEmpty'

const JsonPreview = () => {
  const {
    draft = {}
  } = useAppContext()

  // Remove || {} in MMT-4070
  const { ummMetadata = {} } = draft || {}

  const data = cloneDeep(removeEmpty(ummMetadata))

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
          <JSONPretty data={data} />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

export default JsonPreview
