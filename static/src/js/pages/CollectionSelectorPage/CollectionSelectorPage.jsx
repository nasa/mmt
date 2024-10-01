import React, { Suspense } from 'react'
import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import PropTypes from 'prop-types'

import Col from 'react-bootstrap/Col'
import Placeholder from 'react-bootstrap/Placeholder'
import Row from 'react-bootstrap/Row'

import CollectionSelector from '@/js/components/CollectionSelector/CollectionSelector'

/*
 * Renders a `CollectionSelectorPlaceholder` component.
 *
 * This component renders the collection selector form page placeholder
 *
 * @param {CollectionSelectorPlaceholder} props
 *
 * @component
 * @example <caption>Render the collection selector form page placeholder</caption>
 * return (
 *   <CollectionSelectorPlaceholder />
 * )
 */
const CollectionSelectorPlaceholder = () => (
  <Row className="m-1">
    <Col>
      <div className="border rounded p-3">
        <Placeholder className="w-25 d-block mb-4" />
        <Placeholder className="d-flex align-items-center h-100 w-100 mb-4" size="lg" />
        <Placeholder animation="glow" aria-hidden="true">
          <div className="border rounded p-3 h-100">
            <Placeholder className="border rounded p-3 h-100 w-100 mb-2" />
            <Placeholder className="border rounded p-3 h-100 w-100 mb-2" />
            <Placeholder className="border rounded p-3 h-100 w-100 mb-2" />
            <Placeholder className="border rounded p-3 h-100 w-100 mb-2" />
            <Placeholder className="border rounded p-3 h-100 w-100 mb-2" />
            <Placeholder className="border rounded p-3 h-100 w-100 mb-2" />
            <Placeholder className="border rounded p-3 h-100 w-100 mb-2" />
            <Placeholder className="border rounded p-3 h-100 w-100 mb-2" />
            <Placeholder className="border rounded p-3 h-100 w-100 mb-2" />
          </div>
        </Placeholder>
        <Placeholder className="border rounded mt-3 h-100 w-25 mb-2" />
      </div>
    </Col>
    <Col xs="auto" className="d-flex flex-column justify-content-center align-items-center">
      <Placeholder.Button
        className="btn-primary mb-3"
      />
      <Placeholder.Button
        className="btn-primary mb-3"
      />
      <Placeholder.Button
        className="btn-danger"
      />
    </Col>
    <Col className="p-3">
      <div className="border rounded p-3">
        <Placeholder className="w-25 d-block mb-4" />
        <Placeholder className="d-flex align-items-center h-100 w-100 mb-4" size="lg" />
        <Placeholder animation="glow" aria-hidden="true">
          <div className="border rounded p-3 h-100">
            <Placeholder className="border rounded p-3 h-100 w-100 mb-2" />
            <Placeholder className="border rounded p-3 h-100 w-100 mb-2" />
            <Placeholder className="border rounded p-3 h-100 w-100 mb-2" />
            <Placeholder className="border rounded p-3 h-100 w-100 mb-2" />
            <Placeholder className="border rounded p-3 h-100 w-100 mb-2" />
            <Placeholder className="border rounded p-3 h-100 w-100 mb-2" />
            <Placeholder className="border rounded p-3 h-100 w-100 mb-2" />
            <Placeholder className="border rounded p-3 h-100 w-100 mb-2" />
            <Placeholder className="border rounded p-3 h-100 w-100 mb-2" />
          </div>
        </Placeholder>
        <Placeholder className="border rounded mt-3 h-100 w-25 mb-2" />
      </div>
    </Col>
  </Row>
)

/**
 * @typedef {Object} CollectionSelectorProps
 * @property {Function} onChange A callback function triggered when the user selects collections.
 * @property {Object} formData An Object with the saved metadata
 */
/**
 * Renders a CollectionSelector component
 *
 * @component
 * @example <caption>Render a CollectionSelector</caption>
 * return (
 *   <CollectionSelector />
 * )
 */
const CollectionSelectorPage = ({
  onChange,
  formData,
  uiSchema
}) => {
  const providerId = uiSchema['ui:providerId']

  return (
    <ErrorBoundary>
      <Suspense fallback={<CollectionSelectorPlaceholder />}>
        <CollectionSelector onChange={onChange} providerId={providerId} formData={formData} />
      </Suspense>
    </ErrorBoundary>
  )
}

CollectionSelectorPage.defaultProps = {
  formData: {}
}

CollectionSelectorPage.propTypes = {
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.shape({})
}

export default CollectionSelectorPage
