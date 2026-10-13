import React from 'react'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import pluralize from 'pluralize'
import { useNavigate } from 'react-router'

import Button from '../Button/Button'

import useCollectionSelectionContext from '../../hooks/useCollectionSelectionContext'

import './CollectionSelectionBar.scss'

/**
 * Renders a `CollectionSelectionBar` component.
 *
 * Displays a sticky bar at the bottom of the page when one or more collections are
 * selected. The selection persists across pages and searches via CollectionSelectionContext.
 *
 * @component
 * @example <caption>Renders a `CollectionSelectionBar` component</caption>
 * return (
 *   <CollectionSelectionBar />
 * )
 */
const CollectionSelectionBar = () => {
  const navigate = useNavigate()

  const {
    clearCollectionSelections,
    selectedCollections,
    selectedProvider
  } = useCollectionSelectionContext()

  const selectedCount = selectedCollections.length

  if (selectedCount === 0) return null

  return (
    <Navbar
      bg="dark"
      className="collection-selection-bar position-fixed bottom-0 start-0 w-100"
      variant="dark"
    >
      <Container fluid className="d-flex align-items-center justify-content-between">
        <span className="text-white fw-bolder">
          {selectedCount}
          {' '}
          {pluralize('collection', selectedCount)}
          {' selected from '}
          {selectedProvider}
        </span>
        <div className="d-flex">
          <Button
            className="me-2"
            onClick={clearCollectionSelections}
            variant="outline-light"
          >
            Clear
          </Button>
          <Button
            onClick={
              () => {
                // eslint-disable-next-line no-console
                console.log('Continue to bulk actions configure', selectedCollections)
                console.log('Provider', selectedProvider)
                navigate('/collections/bulk-actions/configure')
              }
            }
            variant="primary"
          >
            Continue
          </Button>
        </div>
      </Container>
    </Navbar>
  )
}

export default CollectionSelectionBar
