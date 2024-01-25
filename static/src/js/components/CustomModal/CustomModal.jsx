import React from 'react'
import PropTypes from 'prop-types'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

/**
 * @typedef {Object} CustomModalProps
 * @property {Boolean} show Should the modal be open.
 * @property {String} message A message to describe the modal
 * @property {Object} actions A list of actions for the modal
 */

/**
 * Renders a DeleteModal component
 *
 * @component
 * @example <caption>Render a Modal</caption>
 * return (
 *   <CustomModal
 *      show={showDeleteModal}
 *      message='message'
 *      actions={[
 *         label: 'label',
 *         variant: 'primary'
 *         onClick: () => func
 *      ]}
 *   />
 * )
 */
const CustomModal = ({
  openModal,
  message,
  actions

}) => (
  <Modal
    show={openModal}
  >
    <Modal.Body>{message}</Modal.Body>

    <Modal.Footer>
      {
        actions.map((item) => {
          const { label, variant, onClick } = item

          return (
            <Button
              key={label}
              variant={variant}
              onClick={onClick}
            >
              {label}
            </Button>
          )
        })
      }
    </Modal.Footer>
  </Modal>
)

CustomModal.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    variant: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  })).isRequired,
  openModal: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired
}

export default CustomModal
