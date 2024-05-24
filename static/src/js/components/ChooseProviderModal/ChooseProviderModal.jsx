import React from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import FormSelect from 'react-bootstrap/FormSelect'

import useAppContext from '@/js/hooks/useAppContext'
import useAvailableProviders from '@/js/hooks/useAvailableProviders'

import saveTypesToHumanizedStringMap from '@/js/constants/saveTypesToHumanizedStringMap'

import CustomModal from '@/js/components/CustomModal/CustomModal'
import For from '@/js/components/For/For'

/**
 * @typedef {Object} ChooseProviderModalProps
 * @property {String} show Boolean that displays or hides the modal.
 * @property {Function} toggleModal A callback function called when the modal is closed with a boolean representing its next state.
 * @property {String} type A string used in the body of the modal to designate the item type being saved.
 * @property {Function} onSubmit A callback function called when the user submits the selection.
 * @property {String} primaryActionType The text for the submit button.
 */

/*
 * Renders a `ChooseProviderModal` component.
 *
 * The component is renders a button, optionally displaying an icon
 *
 * @param {ChooseProviderModalProps} props
 *
 * @component
 * @example <caption>Render a button with an icon</caption>
 * return (
 *   <ChooseProviderModal
 *      show
 *      toggleModal={setModalShow}
 *      type="draft"
 *      onSubmit={doAThing}
 *      primaryActionType="Save & Continue"
 *   />
 * )
 */
const ChooseProviderModal = ({
  show,
  toggleModal,
  type,
  onSubmit,
  primaryActionType
}) => {
  const {
    providerId,
    setProviderId
  } = useAppContext()

  const { providerIds } = useAvailableProviders()

  const humanizedActionType = saveTypesToHumanizedStringMap[primaryActionType]

  return (
    <CustomModal
      show={show}
      toggleModal={toggleModal}
      header="Choose a provider"
      message={
        (
          <>
            <p>
              {`Choose a provider before saving${type && ` your ${type}`}.`}
            </p>
            <Form className="mb-3">
              <label className="visually-hidden" htmlFor="select_provider">Select a provider</label>
              <FormSelect
                id="select_provider"
                value={providerId}
                onChange={
                  (e) => {
                    setProviderId(e.target.value)
                  }
                }
              >
                {
                  providerIds && providerIds.length > 0 && (
                    <For each={providerIds}>
                      {
                        (id) => (
                          <option key={id} value={id}>{id}</option>
                        )
                      }
                    </For>
                  )
                }
              </FormSelect>
            </Form>
          </>
        )
      }
      actions={
        [
          {
            label: `${humanizedActionType}`,
            variant: 'success',
            onClick: () => {
              onSubmit()
              toggleModal(false)
            }
          },
          {
            label: 'Cancel',
            variant: 'light-dark',
            onClick: () => toggleModal(false)
          }
        ]
      }
    />
  )
}

ChooseProviderModal.defaultProps = {
  primaryActionType: null
}

ChooseProviderModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  primaryActionType: PropTypes.string
}

export default ChooseProviderModal
