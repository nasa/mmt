import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useBlocker, useParams } from 'react-router'

import CustomModal from '@/js/components/CustomModal/CustomModal'

import useCollectionSelectionContext from '@/js/hooks/useCollectionSelectionContext'

/**
 * @typedef {Object} BulkActionsEditNavigationGuardProps
 * @property {Object} skipRef A ref the page sets to `true` right before an already-confirmed exit (Cancel, or post-submit navigation), so that navigation isn't blocked -- useBlocker's predicate can't otherwise tell it apart from a sidebar link to the same place.
 * @property {Boolean} submitting Whether the bulk-update submission is in flight. While true, a blocked navigation can't be bypassed with Leave -- stepping away mid-submit would miss the success/error handling, and coming back and resubmitting would create a duplicate task.
 */

/**
 * Renders a BulkActionsEditNavigationGuard component.
 *
 * Warns before navigating away from the bulk-actions edit page while a selection is active,
 * since leaving discards it along with the in-progress configuration. The "Bulk Actions" nav
 * item is an exception -- clicking it while already here is a no-op -- but only for that
 * PUSH; a POP (browser Back/Forward) landing on the same path is a real exit and still
 * warns, so historyAction is captured in a ref since blocker.location alone can't tell them
 * apart. While a submission is in flight, the same block applies but without a Leave option.
 *
 * @component
 * @example <caption>Render a BulkActionsEditNavigationGuard</caption>
 * return (
 *   <BulkActionsEditNavigationGuard skipRef={skipNavigationGuardRef} submitting={submitting} />
 * )
 */
const BulkActionsEditNavigationGuard = ({ skipRef, submitting }) => {
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
      header={submitting ? 'Submission in Progress' : 'Leave Bulk Update?'}
      message={
        submitting
          ? 'Your bulk update is still being submitted. Please wait for it to finish before leaving this page.'
          : 'Navigating away will clear your bulk update selection and discard the changes you\'ve made on this page. Are you sure you want to continue?'
      }
      actions={
        submitting
          ? [
            {
              label: 'OK',
              variant: 'secondary',
              onClick: () => blocker.reset()
            }
          ]
          : [
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
  }).isRequired,
  submitting: PropTypes.bool
}

BulkActionsEditNavigationGuard.defaultProps = {
  submitting: false
}

export default BulkActionsEditNavigationGuard
