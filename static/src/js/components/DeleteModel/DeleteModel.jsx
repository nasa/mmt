import React from 'react'
import PropTypes from 'prop-types'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

/**
 * @typedef {Object} DeleteModalProps
 * @property {Boolean} show Should the modal be open.
 * @property {Function} closeModal A function to close the modal.
 * @property {Function} onDelete A callback function triggered when the user selects `Yes`.
 */

/**
 * Renders a DeleteModal component
 *
 * @component
 * @example <caption>Render a DeleteModal</caption>
 * return (
 *   <DeleteModal
 *      show={showDeleteModal}
 *      closeModal={handleClose}
 *      onDelete={handleDelete}
 *   />
 * )
 */

// TODO check if the record being deleted is in the current provider,
// if not show the messages to change it
const DeleteModal = ({
  closeModal,
  onDelete,
  show
}) => (
  <Modal
    onHide={closeModal}
    show={show}
  >
    <Modal.Body>Are you sure you want to delete this record ?</Modal.Body>

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

DeleteModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
}

export default DeleteModal
