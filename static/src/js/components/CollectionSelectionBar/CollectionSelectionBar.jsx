import React from 'react'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import pluralize from 'pluralize'
import { useNavigate } from 'react-router'

import Button from '../Button/Button'

import useCollectionSelectionContext from '../../hooks/useCollectionSelectionContext'
import useNotificationsContext from '../../hooks/useNotificationsContext'

import './CollectionSelectionBar.scss'

/**
 * Renders a `CollectionSelectionBar` component.
 *
 * Displays a sticky bar at the bottom of the page when one or more collections are
 * selected. The selection persists across pages and searches via CollectionSelectionContext.
 * Clearing the selection shows a toast with an "Undo" action in case the user clicked
 * Clear by mistake.
 *
 * @component
 * @example <caption>Renders a `CollectionSelectionBar` component</caption>
 * return (
 *   <CollectionSelectionBar />
 * )
 */
const CollectionSelectionBar = () => {
  const navigate = useNavigate()

  const { addNotification } = useNotificationsContext()

  const {
    clearCollectionSelections,
    selectCollections,
    selectedCollections,
    selectedProvider
  } = useCollectionSelectionContext()

  const selectedCount = selectedCollections.length

  const handleClear = () => {
    const clearedCollections = selectedCollections.map((conceptId) => (
      {
        conceptId,
        provider: selectedProvider
      }
    ))

    clearCollectionSelections()

    addNotification({
      action: {
        label: 'Undo',
        onClick: () => selectCollections(clearedCollections)
      },
      message: 'Selection cleared',
      variant: 'success'
    })
  }

  if (selectedCount === 0) return null

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
            onClick={() => navigate('/collections/bulk-actions/configure')}
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
