import React from 'react'
import { useBlocker } from 'react-router'

import CustomModal from '../CustomModal/CustomModal'

import useCollectionSelectionContext from '../../hooks/useCollectionSelectionContext'

/**
 * Renders a `CollectionSelectionNavigationGuard` component.
 *
 * Warns the user before navigating away from the collections section while a bulk update
 * collection selection is active, since confirming the navigation clears that selection.
 *
 * @component
 * @example <caption>Renders a `CollectionSelectionNavigationGuard` component</caption>
 * return (
 *   <CollectionSelectionNavigationGuard />
 * )
 */
const CollectionSelectionNavigationGuard = () => {
  const { clearCollectionSelections, selectedCollections } = useCollectionSelectionContext()

  const blocker = useBlocker(({ nextLocation }) => (
    selectedCollections.length > 0 && !nextLocation.pathname.startsWith('/collections')
  ))

  return (
    <CustomModal
      show={blocker.state === 'blocked'}
      header="Leave Collections?"
      message="Navigating away from Collections will clear your bulk update selection. Are you sure you want to continue?"
      actions={
        [
          {
            label: 'Cancel',
            variant: 'secondary',
            onClick: () => blocker.reset()
          },
          {
            label: 'Leave',
            variant: 'danger',
            onClick: () => {
              clearCollectionSelections()
              blocker.proceed()
            }
          }
        ]
      }
      toggleModal={() => blocker.reset()}
    />
  )
}

export default CollectionSelectionNavigationGuard
