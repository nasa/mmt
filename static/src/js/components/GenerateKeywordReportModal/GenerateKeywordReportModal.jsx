import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import { format } from 'date-fns'
import { kmsGetConceptUpdatesReport } from '@/js/utils/kmsGetConceptUpdatesReport'
import DatePicker from 'react-datepicker'
import CustomModal from '@/js/components/CustomModal/CustomModal'
import KmsConceptVersionSelector from '@/js/components/KmsConceptVersionSelector/KmsConceptVersionSelector'
import { toZonedTime } from 'date-fns-tz'

const GenerateKeywordReportModal = ({
  show,
  toggleModal
}) => {
  const [startDate, setStartDate] = useState(null)
  const [selectedVersion, setSelectedVersion] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [userId, setUserId] = useState('')
  const [isLoading, setIsLoading] = useState(false) // State for spinner
  const [status, setStatus] = useState(null)

  const handleSubmit = async () => {
    setIsLoading(true)
    setStatus(null)
    try {
      await kmsGetConceptUpdatesReport({
        version: selectedVersion,
        startDate,
        endDate,
        userId
      })
    } catch (error) {
      setStatus('Error generating report.')
      console.error('Error generating report:', error)
    } finally {
      setIsLoading(false) // Hide spinner
    }
  }

  const handleUserIdUpdate = (event) => {
    const inputValue = event.target.value
    setUserId(inputValue.trim())
  }

  const onVersionSelect = (event) => {
    setSelectedVersion(event)
  }

  const renderErrorStatus = () => {
    if (status) {
      return <div className="text-danger mt-2">{status}</div>
    }

    return null
  }

  // Normalize Datetime so that date picker selects the correct date for last days of the month
  const startDateValue = startDate ? toZonedTime(startDate, 'GMT') : null
  const endDateValue = endDate ? toZonedTime(endDate, 'GMT') : null

  return (
    <CustomModal
      show={show}
      toggleModal={toggleModal}
      header="Generate Report"
      message={
        (
          <Form className="mb-3">
            <div>
              <div className="py-2">
                <label htmlFor="start-date-selector" className="fw-bold me-3">
                  Start Date:
                </label>
                <DatePicker
                  selected={startDateValue}
                  onChange={(date) => setStartDate(format(date, 'yyyy-MM-dd'))} // Format the date before storing
                  selectsStart
                  dateFormat="yyyy-MM-dd" // Ensures the displayed format is consistent
                  placeholderText="Select a start date"
                  id="start-date-selector"
                />
              </div>
              <div className="py-2">
                <label htmlFor="end-date-selector" className="fw-bold me-3">
                  End Date:
                </label>
                <DatePicker
                  selected={endDateValue}
                  onChange={(date) => setEndDate(format(date, 'yyyy-MM-dd'))} // Format the date before storing
                  selectsEnd
                  minDate={startDateValue}
                  dateFormat="yyyy-MM-dd" // Ensures the displayed format is consistent
                  placeholderText="Select an end date"
                  id="end-date-selector"
                />
              </div>
            </div>
            <div className="mt-3">
              <label htmlFor="version-selector" className="fw-bold">
                Version:
              </label>
              <KmsConceptVersionSelector
                onVersionSelect={onVersionSelect}
                key="version-selector"
              />
            </div>
            <div className="mt-3">
              <label htmlFor="user-id-input" className="fw-bold">
                Filter by Earthdata Login User-Id:
              </label>
              <input
                className="form-control"
                type="text"
                placeholder="Earthdata Login Username (Optional)"
                id="user-id-input"
                value={userId}
                onChange={handleUserIdUpdate}
              />
            </div>
            {renderErrorStatus()}
          </Form>
        )
      }
      actions={
        [
          {
            label: 'Generate CSV Report',
            variant: 'success',
            onClick: () => handleSubmit(),
            loading: isLoading,
            disabled: isLoading,
            loadingText: 'Generating report...'
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
