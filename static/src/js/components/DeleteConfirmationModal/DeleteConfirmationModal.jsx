import React from 'react'
import { Spinner } from 'react-bootstrap'
import CustomModal from '@/js/components/CustomModal/CustomModal'
import PropTypes from 'prop-types'

export const DeleteConfirmationModal = ({
  show,
  nodeToDelete,
  isDeleting,
  deleteError,
  onConfirm,
  onCancel
}) => {
  const deleteModalActions = [
    {
      label: 'Cancel',
      variant: 'secondary',
      onClick: onCancel,
      disabled: isDeleting
    },
    {
      label: 'Delete',
      variant: 'danger',
      onClick: onConfirm,
      disabled: isDeleting
    }
  ]

  return (
    <CustomModal
      show={show}
      header="Confirm Deletion"
      message={
        (
          <div>
            <p>{`Delete "${nodeToDelete?.data.title}"?`}</p>
            {
              isDeleting && (
                <div className="text-primary mt-2">
                  <Spinner animation="border" size="sm" aria-label="Deleting" />
                  {' '}
                  Deleting...
                </div>
              )
            }
            {deleteError && <div className="text-danger mt-2">{deleteError}</div>}
          </div>
        )
      }
      actions={deleteModalActions}
      toggleModal={onCancel}
    />
  )
}

DeleteConfirmationModal.defaultProps = {
  nodeToDelete: null,
  deleteError: null
}

DeleteConfirmationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  nodeToDelete: PropTypes.shape({
    data: PropTypes.shape({
      title: PropTypes.string.isRequired
    }).isRequired
  }),
  isDeleting: PropTypes.bool.isRequired,
  deleteError: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}
