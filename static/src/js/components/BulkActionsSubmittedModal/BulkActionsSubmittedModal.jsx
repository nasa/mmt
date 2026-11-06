import React from 'react'
import PropTypes from 'prop-types'

import CustomModal from '@/js/components/CustomModal/CustomModal'

/**
 * @typedef {Object} BulkActionsSubmittedModalProps
 * @property {Boolean} show Should the modal be open.
 * @property {String} taskId The id of the newly created bulk-update task.
 * @property {Function} onClose Called when the modal is closed (Close button or the X).
 * @property {Function} onViewJobStatus Called when View Job Status is clicked.
 */

/**
 * Renders a BulkActionsSubmittedModal component.
 *
 * Shown after a bulk update is successfully submitted, displaying the new task id for
 * historical record-keeping and offering to view its status.
 *
 * @component
 * @example <caption>Render a BulkActionsSubmittedModal</caption>
 * return (
 *   <BulkActionsSubmittedModal
 *     show={showSubmittedModal}
 *     taskId={taskId}
 *     onClose={() => navigate('/collections/bulk-actions')}
 *     onViewJobStatus={() => navigate(`/collections/bulk-actions/${taskId}`)}
 *   />
 * )
 */
const BulkActionsSubmittedModal = ({
  show,
  taskId,
  onClose,
  onViewJobStatus
}) => (
  <CustomModal
    header="Bulk Update Submitted"
    show={show}
    toggleModal={onClose}
    message={
      (
        <div className="text-center">
          <p className="fw-bold mb-2">Successfully Submitted!</p>
          <p className="mb-3">Your bulk update is now processing in the background.</p>
          <p>
            {'Task ID: '}
            <span className="fw-bold">{taskId}</span>
          </p>
        </div>
      )
    }
    actions={
      [
        {
          label: 'Close',
          variant: 'secondary',
          onClick: onClose
        },
        {
          label: 'View Job Status',
          variant: 'primary',
          onClick: onViewJobStatus
        }
      ]
    }
  />
)

BulkActionsSubmittedModal.propTypes = {
  show: PropTypes.bool.isRequired,
  taskId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onViewJobStatus: PropTypes.func.isRequired
}

BulkActionsSubmittedModal.defaultProps = {
  taskId: null
}

export default BulkActionsSubmittedModal
