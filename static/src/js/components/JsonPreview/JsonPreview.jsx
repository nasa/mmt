import React from 'react'
import Accordion from 'react-bootstrap/Accordion'
import { cloneDeep } from 'lodash'
import JSONPretty from 'react-json-pretty'

import removeEmpty from '../../utils/removeEmpty'

import useAppContext from '../../hooks/useAppContext'

// TODO Needs tests

const JsonPreview = () => {
  const {
    draft = {}
  } = useAppContext()

  const { ummMetadata = {} } = draft

  const data = removeEmpty(cloneDeep(ummMetadata))

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
