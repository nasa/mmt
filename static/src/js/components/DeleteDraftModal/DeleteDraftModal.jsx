import React from 'react'
import PropTypes from 'prop-types'

import { Button, Modal } from 'react-bootstrap'

/**
 * @typedef {Object} DeleteDraftModalProps
 * @property {Boolean} show Should the modal be open.
 * @property {Function} closeModal A function to close the modal.
 * @property {Function} onDelete A callback function triggered when the user selects `Yes`.
 */

/**
 * Renders a DeleteDraftModal component
 *
 * @component
 * @example <caption>Render a DeleteDraftModal</caption>
 * return (
 *   <DeleteDraftModal
 *      show={showDeleteModal}
 *      closeModal={handleClose}
 *      onDelete={handleDelete}
 *   />
 * )
 */
const DeleteDraftModal = ({
  show,
  closeModal,
  onDelete
}) => (
  <Modal
    show={show}
    onHide={closeModal}
  >
    <Modal.Body>Are you sure you want to delete this draft?</Modal.Body>

    <Modal.Footer>
      <Button
        variant="secondary"
        onClick={closeModal}
      >
        No
      </Button>
      <Button
        variant="primary"
        onClick={onDelete}
      >
        Yes
      </Button>
    </Modal.Footer>
  </Modal>
)

DeleteDraftModal.propTypes = {
  show: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default DeleteDraftModal
