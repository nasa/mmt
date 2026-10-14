import React, { useState } from 'react'
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
 * Clearing the selection briefly replaces the bar with an "Undo" option in case the user
 * clicked Clear by mistake.
 *
 * @component
 * @example <caption>Renders a `CollectionSelectionBar` component</caption>
 * return (
 *   <CollectionSelectionBar />
 * )
 */
const CollectionSelectionBar = () => {
  const navigate = useNavigate()

  const [lastClearedCollections, setLastClearedCollections] = useState(null)

  const {
    clearCollectionSelections,
    selectCollections,
    selectedCollections,
    selectedProvider
  } = useCollectionSelectionContext()

  const selectedCount = selectedCollections.length

  const handleClear = () => {
    setLastClearedCollections(
      selectedCollections.map((conceptId) => (
        {
          conceptId,
          provider: selectedProvider
        }
      ))
    )

    clearCollectionSelections()
  }

  const handleUndo = () => {
    selectCollections(lastClearedCollections)
    setLastClearedCollections(null)
  }

  if (selectedCount === 0 && !lastClearedCollections) return null

  if (selectedCount === 0 && lastClearedCollections) {
    return (
      <Navbar
        bg="dark"
        className="collection-selection-bar flex-shrink-0 w-100"
        variant="dark"
      >
        <Container fluid className="d-flex align-items-center justify-content-between">
          <span className="text-white fw-bolder">Selection cleared</span>
          <Button
            onClick={handleUndo}
            variant="outline-light"
          >
            Undo
          </Button>
        </Container>
      </Navbar>
    )
  }

  return (
    <Navbar
      bg="dark"
      className="collection-selection-bar flex-shrink-0 w-100"
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
            onClick={handleClear}
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
