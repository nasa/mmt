import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import { format } from 'date-fns'
import KmsConceptVersionSelector from '@/js/components/KmsConceptVersionSelector/KmsConceptVersionSelector'
import { kmsGetConceptUpdatesReport } from '@/js/utils/KmsGetConceptUpdatesReport'
import DatePicker from 'react-datepicker'
import CustomModal from '@/js/components/CustomModal/CustomModal'

/**
 * @typedef {Object} GenerateKeywordReportModalProps
 * @property {String} show Boolean that displays or hides the modal.
 * @property {Function} toggleModal A callback function called when the modal is closed with a boolean representing its next state.
 * @property {String} primaryActionType The text for the submit button.
 */

/*
 * Renders a `GenerateKeywordReportModal` component.
 *
 * The component is renders a button, optionally displaying an icon
 *
 * @param {GenerateKeywordReportModalProps} props
 *
 * @component
 * @example <caption>Render a button with an icon</caption>
 * return (
 *   <GenerateKeywordReportModal
 *      show
 *      toggleModal={setModalShow}
 *      type="draft"
 *      onSubmit={doAThing}
 *      primaryActionType="Save & Continue"
 *   />
 * )
 */
const GenerateKeywordReportModal = ({
  show,
  toggleModal
}) => {
  const [startDate, setStartDate] = useState(null)
  const [selectedVersion, setSelectedVersion] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [userId, setUserId] = useState(null)

  const handleSubmit = async () => {
    console.log('🚀 ~ file: GenerateKeywordReportModal.jsx:57 ~ startDate:', startDate)
    console.log('🚀 ~ file: GenerateKeywordReportModal.jsx:42 ~ endDate:', endDate)
    try {
      await kmsGetConceptUpdatesReport({
        version: selectedVersion,
        startDate,
        endDate,
        userId
      })
    } catch (error) {
      console.log('🚀 ~ file: GenerateKeywordReportModal.jsx:54 ~ error:', error)
    }
  }

  const handleUserIdUpdate = (event) => {
    const inputValue = event.target.value
    setUserId(inputValue.trim()) // Parse the string (e.g., trim whitespace)
  }

  const onVersionSelect = (event) => {
    setSelectedVersion(event)
    console.log('The selected version is:', selectedVersion)
  }

  return (
    <CustomModal
      show={show}
      toggleModal={toggleModal}
      header="Generate Report"
      message={
        (
          <Form className="mb-3">
            <KmsConceptVersionSelector
              onVersionSelect={onVersionSelect}
              id="version-selector"
              key="version-selector"
            />
            Select Start and End Date for the report
            <div>
              <label htmlFor="start-date">Start Date:</label>
              <DatePicker
                selected={startDate ? new Date(startDate) : null}
                onChange={(date) => setStartDate(format(date, 'yyyy-MM-dd'))} // Format the date before storing
                selectsStart
                startDate={startDate ? new Date(startDate) : null}
                endDate={endDate ? new Date(endDate) : null}
                dateFormat="yyyy-MM-dd" // Ensures the displayed format is consistent
                placeholderText="Select a start date"
              />
            </div>
            <div>
              <label htmlFor="end-date">End Date:</label>
              <DatePicker
                selected={endDate ? new Date(endDate) : null}
                onChange={(date) => setEndDate(format(date, 'yyyy-MM-dd'))} // Format the date before storing
                selectsEnd
                startDate={startDate ? new Date(startDate) : null}
                endDate={endDate ? new Date(endDate) : null}
                minDate={startDate ? new Date(startDate) : null}
                dateFormat="yyyy-MM-dd" // Ensures the displayed format is consistent
                placeholderText="Select an end date"
              />
            </div>
            <input
              id="parsed-string"
              className="form-control"
              type="text"
              placeholder="Enter a string to parse"
              value={userId}
              onChange={handleUserIdUpdate}
            />
          </Form>
        )
      }
      actions={
        [
          {
            label: 'Generate CSV Report',
            variant: 'success',
            onClick: () => {
              handleSubmit()
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

GenerateKeywordReportModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired
}

export default GenerateKeywordReportModal
