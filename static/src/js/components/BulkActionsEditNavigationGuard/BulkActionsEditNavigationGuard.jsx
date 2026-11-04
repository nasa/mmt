import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useBlocker, useParams } from 'react-router'

import CustomModal from '@/js/components/CustomModal/CustomModal'

import useCollectionSelectionContext from '@/js/hooks/useCollectionSelectionContext'

/**
 * @typedef {Object} BulkActionsEditNavigationGuardProps
 * @property {Object} skipRef A ref the page sets to `true` right before an already-confirmed exit (Cancel, or post-submit navigation), so that navigation isn't blocked -- useBlocker's predicate can't otherwise tell it apart from a sidebar link to the same place.
 */

/**
 * Renders a BulkActionsEditNavigationGuard component.
 *
 * Mounted only on the bulk-actions edit page. While a selection is active, it warns (same
 * Cancel/Leave style as CollectionSelectionNavigationGuard, which doesn't run here) before
 * navigating away, since leaving discards the in-progress selection and configuration. The
 * "Bulk Actions" nav item itself is an exception -- clicking it while already here is a
 * no-op, not something to warn about. That exception is specifically for that PUSH
 * navigation though -- a POP (browser Back/Forward) that happens to land on the same path
 * is a real exit and still shows the warning, since blocker.location alone can't tell the
 * two apart (the useBlocker predicate's historyAction can, so it's captured in a ref).
 *
 * @component
 * @example <caption>Render a BulkActionsEditNavigationGuard</caption>
 * return (
 *   <BulkActionsEditNavigationGuard skipRef={skipNavigationGuardRef} />
 * )
 */
const BulkActionsEditNavigationGuard = ({ skipRef }) => {
  const { type } = useParams()
  const { selectedCollections } = useCollectionSelectionContext()

  const editPath = `/${type}/bulk-actions/edit`
  const landingPath = `/${type}/bulk-actions`

  // Blocker.location (what the returned blocker exposes) carries no navigation-type info --
  // only the predicate's own historyAction argument does, so it's captured here to use below.
  const lastHistoryActionRef = useRef(null)

  const blocker = useBlocker(({ nextLocation, historyAction }) => {
    lastHistoryActionRef.current = historyAction

    if (skipRef.current) return false

    return selectedCollections.length > 0 && nextLocation.pathname !== editPath
  })

  const isBlockedByLandingLink = (
    blocker.state === 'blocked'
    && blocker.location.pathname === landingPath
    && lastHistoryActionRef.current !== 'POP'
  )

  useEffect(() => {
    if (isBlockedByLandingLink) blocker.reset()
  }, [isBlockedByLandingLink])

  return (
    <CustomModal
      show={blocker.state === 'blocked' && !isBlockedByLandingLink}
      header="Leave Bulk Update?"
      message="Navigating away will clear your bulk update selection and discard the changes you've made on this page. Are you sure you want to continue?"
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
            onClick: () => blocker.proceed()
          }
        ]
      }
      toggleModal={() => blocker.reset()}
    />
  )
}

BulkActionsEditNavigationGuard.propTypes = {
  skipRef: PropTypes.shape({
    current: PropTypes.bool
  }).isRequired
}

export default BulkActionsEditNavigationGuard
