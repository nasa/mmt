import React, { Suspense } from 'react'
import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import PropTypes from 'prop-types'
import {
  Col,
  Placeholder,
  Row
} from 'react-bootstrap'
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
  <Row>
    <Col className="p-3">
      <div className="border rounded p-3">
        <Placeholder animation="glow" aria-hidden="true">
          <div className="border rounded p-3 h-100">
            <Placeholder className="d-flex align-items-center w-100 mb-4 " size="sm" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
          </div>
        </Placeholder>
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
        <Placeholder animation="glow" aria-hidden="true">
          <div className="border rounded p-3 h-100">
            <Placeholder className="d-flex align-items-center w-100 mb-4 " size="sm" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
            <Placeholder className="border rounded p-3 h-100 w-100" />
          </div>
        </Placeholder>
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
  formData
}) => (
  <ErrorBoundary>
    <Suspense fallback={<CollectionSelectorPlaceholder />}>
      <CollectionSelector onChange={onChange} formData={formData} />
    </Suspense>
  </ErrorBoundary>
)

CollectionSelectorPage.defaultProps = {
  formData: []
}

CollectionSelectorPage.propTypes = {
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.arrayOf(PropTypes.shape({}))
}

export default CollectionSelectorPage
