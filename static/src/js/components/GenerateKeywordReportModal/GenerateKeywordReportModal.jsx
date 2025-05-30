import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import { format } from 'date-fns'
import { kmsGetConceptUpdatesReport } from '@/js/utils/kmsGetConceptUpdatesReport'
import DatePicker from 'react-datepicker'
import CustomModal from '@/js/components/CustomModal/CustomModal'
import KmsConceptVersionSelector from '@/js/components/KmsConceptVersionSelector/KmsConceptVersionSelector'

const GenerateKeywordReportModal = ({
  show,
  toggleModal
}) => {
  const [startDate, setStartDate] = useState(null)
  const [selectedVersion, setSelectedVersion] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [userId, setUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(false) // State for spinner

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      await kmsGetConceptUpdatesReport({
        version: selectedVersion,
        startDate,
        endDate,
        userId
      })
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setIsLoading(false) // Hide spinner
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
            <div>
              <div className="py-2">
                <label htmlFor="start-date-selector" className="fw-bold me-3">
                  Start Date:
                </label>
                <DatePicker
                  selected={startDate ? new Date(startDate) : null}
                  onChange={(date) => setStartDate(format(date, 'yyyy-MM-dd'))} // Format the date before storing
                  selectsStart
                  startDate={startDate ? new Date(startDate) : null}
                  endDate={endDate ? new Date(endDate) : null}
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
            </div>
            <div className="mt-3">
              <label htmlFor="version-selector" className="fw-bold">
                Version:
              </label>
              <KmsConceptVersionSelector
                onVersionSelect={onVersionSelect}
                id="version-selector"
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
