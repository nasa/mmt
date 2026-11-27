import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FaCheck, FaCopy } from 'react-icons/fa'

import Button from '@/js/components/Button/Button'
import CustomModal from '@/js/components/CustomModal/CustomModal'
import Table from '@/js/components/Table/Table'

import './BulkActionsDetailedKeywordReviewModal.scss'

const TABLE_COLUMNS = [
  {
    dataKey: 'conceptId',
    title: 'Concept ID',
    className: 'col-auto'
  },
  {
    dataKey: 'shortName',
    title: 'Short Name',
    className: 'col-auto'
  },
  {
    dataKey: 'version',
    title: 'Version',
    className: 'col-auto'
  },
  {
    dataKey: 'pathLabel',
    title: 'Keyword Path',
    className: 'col'
  }
]

// Find and Remove deletes the whole matched keyword (and whatever detailed value it
// carries) rather than overwriting it, so its sentence is worded differently from the two
// replace-style update types.
const buildCountSentence = (updateType, detailedKey, lossCount, totalSelectedCount) => {
  if (updateType === 'FIND_AND_REMOVE') {
    return `${lossCount} of ${totalSelectedCount} selected collections have ${detailedKey} values on a keyword this update will remove, which will delete them too.`
  }

  return `${lossCount} of ${totalSelectedCount} selected collections have ${detailedKey} values that this update will permanently remove.`
}

const flattenRows = (losses) => losses.flatMap(({
  conceptId, shortName, version, lostEntries
}) => (
  lostEntries.map(({ pathLabel }, index) => ({
    rowKey: `${conceptId}_${index}`,
    conceptId,
    shortName,
    version,
    pathLabel
  }))
))

const buildCopyText = (rows) => [
  'Concept ID\tShort Name\tVersion\tKeyword Path',
  ...rows.map(({
    conceptId, shortName, version, pathLabel
  }) => `${conceptId}\t${shortName}\t${version}\t${pathLabel}`)
].join('\n')

/**
 * @typedef {Object} BulkActionsDetailedKeywordReviewModalProps
 * @property {Boolean} show Whether the modal is open.
 * @property {'results'|'error'} status 'results' to show the list of affected collections
 * (the pre-submit check ran and found at least one); 'error' to show only a failure
 * message and a Back button (the check itself couldn't be run -- e.g. a network/GraphQL
 * error), with no indication of what would or wouldn't have been lost.
 * @property {String} [detailedKey] The UMM-C field name being checked --
 * 'DetailedVariable' for Science Keywords or 'DetailedLocation' for Location Keywords.
 * Used to word both the error message and the count sentence, and as the label prefix on
 * each row's keyword path (e.g. "... > DetailedVariable: Cloud Base Height"). Optional
 * (defaults to `null`) since the caller may render this before a keyword field is chosen.
 * @property {String} updateType The bulk-update action type in progress (e.g.
 * 'CLEAR_ALL_AND_REPLACE', 'FIND_AND_REPLACE', 'FIND_AND_REMOVE'). Only affects which
 * count-sentence wording is used -- Find and Remove deletes the matched keyword outright,
 * so it reads differently from the two replace-style types.
 * @property {Number} totalSelectedCount How many collections were selected for the bulk
 * update overall (not just the affected ones) -- used only to build the "X of Y selected
 * collections..." sentence.
 * @property {Array<Object>} losses One entry per affected collection:
 * `{ conceptId, shortName, version, lostEntries: [{ pathLabel }] }`. `lostEntries` holds one
 * `{ pathLabel }` per keyword entry on that collection that would lose its value, where
 * `pathLabel` is a display string like `"EARTH SCIENCE > OCEANS > ... > DetailedVariable:
 * Cloud Base Height"`. This component only renders/flattens/copies `losses` -- it doesn't
 * compute it; the caller supplies it already built (see `findDetailedKeywordLosses.js`).
 * @property {Function} onBack Called when the user clicks Back, on either the results or
 * the error body. Should close the modal without submitting anything.
 * @property {Function} onSubmitAnyway Called when the user chooses to submit the bulk
 * update unchanged -- every originally selected collection, affected ones included, stays
 * in the request. This component never submits anything itself; it only invokes the
 * callback.
 * @property {Function} onRemoveAndSubmit Called when the user chooses to submit with the
 * affected collections excluded -- actually filtering `losses`' concept ids out of the
 * selection (and deselecting them) is the caller's responsibility, not this component's.
 * Its action button is disabled, and never fires this callback, when every selected
 * collection is affected (`losses.length >= totalSelectedCount`) -- excluding all of them
 * would leave zero concept ids, which CMR's bulk-update endpoint rejects outright.
 */

/**
 * Renders a BulkActionsDetailedKeywordReviewModal component.
 *
 * Shown from BulkActionsEditPage's pre-submit check for Science/Location Keywords bulk
 * updates that would erase an existing DetailedVariable/DetailedLocation value -- free text
 * the bulk-update UI has no way to find or set, so it can only be lost, never configured
 * around. Purely presentational: the caller runs the check, decides `status`/`losses`, and
 * handles every button's consequence -- this component only renders what it's given and
 * calls back. Two independent bodies, chosen by `status`:
 * - 'error': the check itself failed to run. Just an explanation and a Back button.
 * - 'results': the check ran and found losses. A count sentence (worded per `updateType`),
 *   a "Copy list" button, and a table of every affected collection/keyword-path pair, under
 *   three actions -- Remove-and-submit, Submit Anyway, Back. Remove-and-submit is disabled
 *   (with an explanation) if every selected collection is affected, since CMR rejects a
 *   zero-concept-id bulk-update request.
 *
 * @component
 * @example <caption>Render a BulkActionsDetailedKeywordReviewModal</caption>
 * return (
 *   <BulkActionsDetailedKeywordReviewModal
 *     show={showReviewModal}
 *     status="results"
 *     detailedKey="DetailedVariable"
 *     updateType={updateType}
 *     totalSelectedCount={selectedCollections.length}
 *     losses={keywordLosses}
 *     onBack={handleBack}
 *     onSubmitAnyway={handleSubmitAnyway}
 *     onRemoveAndSubmit={handleRemoveAndSubmit}
 *   />
 * )
 */
const BulkActionsDetailedKeywordReviewModal = ({
  show,
  status,
  detailedKey,
  updateType,
  totalSelectedCount,
  losses,
  onBack,
  onSubmitAnyway,
  onRemoveAndSubmit
}) => {
  const [copyStatus, setCopyStatus] = useState(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildCopyText(flattenRows(losses)))
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  if (status === 'error') {
    return (
      <CustomModal
        show={show}
        header="Review Before Submitting"
        message={`We couldn't check the selected collections for ${detailedKey} values.`}
        actions={
          [
            {
              label: 'Back',
              variant: 'secondary',
              onClick: onBack
            }
          ]
        }
        toggleModal={onBack}
      />
    )
  }

  const rows = flattenRows(losses)

  // CMR's bulk-update endpoint rejects a request with zero concept ids -- if every
  // selected collection is affected, removing them all would leave nothing to submit, so
  // that action has to be blocked rather than left to fail against CMR.
  const wouldRemoveEveryCollection = losses.length >= totalSelectedCount

  return (
    <CustomModal
      show={show}
      size="lg"
      header="Review Before Submitting"
      message={
        (
          <>
            <p>{buildCountSentence(updateType, detailedKey, losses.length, totalSelectedCount)}</p>
            <div className="d-flex justify-content-end mb-2">
              <Button
                onClick={handleCopy}
                size="sm"
                variant="outline-secondary"
                Icon={copyStatus === 'copied' ? FaCheck : FaCopy}
                iconTitle={copyStatus === 'copied' ? 'Checkmark' : 'Copy'}
              >
                {copyStatus === 'copied' ? 'Copied' : 'Copy list'}
              </Button>
            </div>
            {
              copyStatus === 'failed' && (
                <div className="text-danger small mb-2">Unable to copy the list. Try again.</div>
              )
            }
            {
              wouldRemoveEveryCollection && (
                <div className="text-danger small mb-2">
                  Every selected collection is affected, so removing them all would leave
                  none to submit.
                </div>
              )
            }
            <div className="bulk-actions-detailed-keyword-review-modal__list">
              <Table
                id="bulk-actions-detailed-keyword-review-modal-table"
                columns={TABLE_COLUMNS}
                data={rows}
                limit={rows.length}
                generateRowKey={({ rowKey }) => `row_${rowKey}`}
                generateCellKey={({ rowKey }, dataKey) => `column_${dataKey}_${rowKey}`}
              />
            </div>
          </>
        )
      }
      actions={
        [
          {
            label: `Remove ${losses.length} collection${losses.length === 1 ? '' : 's'} and submit`,
            variant: 'primary',
            onClick: onRemoveAndSubmit,
            disabled: wouldRemoveEveryCollection
          },
          {
            label: 'Submit Anyway',
            variant: 'danger',
            onClick: onSubmitAnyway
          },
          {
            label: 'Back',
            variant: 'secondary',
            onClick: onBack
          }
        ]
      }
      toggleModal={onBack}
    />
  )
}

BulkActionsDetailedKeywordReviewModal.propTypes = {
  show: PropTypes.bool.isRequired,
  status: PropTypes.oneOf(['results', 'error']).isRequired,
  detailedKey: PropTypes.string,
  updateType: PropTypes.string.isRequired,
  totalSelectedCount: PropTypes.number.isRequired,
  losses: PropTypes.arrayOf(PropTypes.shape({
    conceptId: PropTypes.string,
    shortName: PropTypes.string,
    version: PropTypes.string,
    lostEntries: PropTypes.arrayOf(PropTypes.shape({
      pathLabel: PropTypes.string
    }))
  })).isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmitAnyway: PropTypes.func.isRequired,
  onRemoveAndSubmit: PropTypes.func.isRequired
}

BulkActionsDetailedKeywordReviewModal.defaultProps = {
  detailedKey: null
}

export default BulkActionsDetailedKeywordReviewModal
