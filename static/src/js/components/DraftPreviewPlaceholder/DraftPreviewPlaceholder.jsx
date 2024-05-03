import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Placeholder from 'react-bootstrap/Placeholder'

/*
 * Renders a `DraftSectionPlaceholder` component.
 *
 * This component renders a draft section placeholder
 *
 * @param {DraftSectionPlaceholder} props
 *
 * @component
 * @example <caption>Render the draft section placeholder</caption>
 * return (
 *   <DraftSectionPlaceholder />
 * )
 */
const DraftSectionPlaceholder = () => (
  <Col
    className="mb-4"
    xs="4"
  >
    <Placeholder animation="glow" aria-hidden="true" />
    <div className="w-100">
      <Placeholder animation="glow" aria-hidden="true" className="d-flex">
        <Placeholder
          style={
            {
              height: '2rem',
              width: '2rem',
              borderRadius: '100%'
            }
          }
          className="me-3 flex-shrink-0"
        />
        <span className="w-50">
          <Placeholder className="w-75" />
          <Placeholder className="w-100" />
        </span>
      </Placeholder>
    </div>
  </Col>
)

const DraftPreviewPlaceholder = () => (
  <Row className="mb-5">
    <DraftSectionPlaceholder />
    <DraftSectionPlaceholder />
    <DraftSectionPlaceholder />
    <DraftSectionPlaceholder />
    <DraftSectionPlaceholder />
    <DraftSectionPlaceholder />
    <DraftSectionPlaceholder />
  </Row>
)

export default DraftPreviewPlaceholder
