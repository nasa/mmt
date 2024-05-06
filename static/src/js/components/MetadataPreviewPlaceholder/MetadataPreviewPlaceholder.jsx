import React from 'react'
import Row from 'react-bootstrap/Row'
import Placeholder from 'react-bootstrap/Placeholder'

/*
 * Renders a `MetadataPreviewPlaceholder` component.
 *
 * This component renders a metadata preview placeholder
 *
 * @param {MetadataPreviewPlaceholder} props
 *
 * @component
 * @example <caption>Render the metadata preview placeholder</caption>
 * return (
 *   <MetadataPreviewPlaceholder />
 * )
 */
const MetadataPreviewPlaceholder = () => (
  <Row className="pt-4">
    <Placeholder animation="glow" aria-hidden="true">
      <span className="d-block w-75 mb-4 mt-2">
        <Placeholder className="w-25 d-block mb-2" size="sm" />
        <Placeholder className="w-100 d-block" style={{ height: '2rem' }} />
      </span>
      <span className="d-flex mb-4">
        <Placeholder
          className="d-block me-2 rounded"
          style={
            {
              width: '12rem',
              height: '2rem'
            }
          }
          size="lg"
        />
        <Placeholder
          className="d-block  me-1 rounded"
          style={
            {
              width: '5rem',
              height: '2rem'
            }
          }
          size="lg"
        />
      </span>
      <span className="d-block w-100 mb-4 mt-2">
        <Placeholder className="w-100 mb-2" />
        <Placeholder className="w-100 mb-2" />
        <Placeholder className="w-75 mb-2" />
      </span>
      <span className="d-block w-50 mb-4">
        <Placeholder className="w-50 d-block mb-4" style={{ height: '2rem' }} size="lg" />
      </span>
      <span className="d-flex mb-5">
        <Placeholder
          className="d-block me-2 rounded"
          style={
            {
              width: '5rem',
              height: '2rem'
            }
          }
        />
        <Placeholder
          className="d-block me-2 rounded"
          style={
            {
              width: '6rem',
              height: '2rem'
            }
          }
        />
        <Placeholder
          className="d-block me-2 rounded"
          style={
            {
              width: '5.5rem',
              height: '2rem'
            }
          }
        />
        <Placeholder
          className="d-block me-2 rounded"
          style={
            {
              width: '4rem',
              height: '2rem'
            }
          }
        />
        <Placeholder
          className="d-block me-2 rounded"
          style={
            {
              width: '5rem',
              height: '2rem'
            }
          }
        />
      </span>
      <span className="d-flex">
        <Placeholder className="col-3 me-4 rounded" style={{ height: '10rem' }} size="lg" />
        <Placeholder className="col-9 mb-4 rounded" style={{ height: '10rem' }} size="lg" />
      </span>
    </Placeholder>
  </Row>
)

export default MetadataPreviewPlaceholder
