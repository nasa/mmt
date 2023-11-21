/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { Accordion } from 'react-bootstrap'
import { cloneDeep } from 'lodash'
import JSONPretty from 'react-json-pretty'
import removeEmpty from '../../utils/removeEmpty'
import useAppContext from '../../hooks/useAppContext'
import './JsonPreview.scss'

const JsonPreview = () => {
  const {
    draft
  } = useAppContext()

  const { ummMetadata } = draft

  const data = removeEmpty(cloneDeep(ummMetadata))

  return (
    <Accordion defaultActiveKey="0" className="json-preview__accordion">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          JSON
          <i style={{ marginLeft: '620px' }} />
        </Accordion.Header>
        <Accordion.Body>
          <JSONPretty data={data} />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

export default JsonPreview
