import React, {
  useState,
  useCallback,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import { FaFile } from 'react-icons/fa'
import { useDropzone } from 'react-dropzone'

import CustomModal from '@/js/components/CustomModal/CustomModal'
import { validateJson } from '@/js/utils/validateJson'
import generateRandomId from '@/js/utils/generateRandomId'

/**
 * JsonFileUploadModal component
 * Renders a modal for uploading and validating JSON files
 *
 * @param {Object} props - Component props
 * @param {boolean} props.show - Controls the visibility of the modal
 * @param {Function} props.toggleModal - Function to toggle the modal visibility
 * @param {Object|Function} props.schema - JSON schema for validation
 * @param {Function} props.upload - Function to handle the upload of valid JSON data
 */
export const JsonFileUploadModal = ({
  show, toggleModal, schema, upload
}) => {
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState([])
  const [isHovered, setIsHovered] = useState(false)

  /**
   * Callback function for handling file drop
   * @param {File[]} acceptedFiles - Array of accepted files
   */
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setErrors([])
    }
  }, [])

  const {
    getRootProps, getInputProps
  } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'text/plain': ['.json']
    },
    multiple: false
  })

  useEffect(() => {
    if (!show) {
      setFile(null)
      setErrors([])
    }
  }, [show])

  /**
   * Handles the file upload and validation process
   */
  const handleUpload = () => {
    if (!file) {
      setErrors([{
        id: generateRandomId,
        message: 'Please select a file to upload.'
      }])

      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result)
        const validationResult = validateJson({
          jsonData,
          schema
        })
        if (validationResult.errors) {
          setErrors(validationResult.errors.map((error) => ({
            id: generateRandomId,
            message: error
          })))
        } else {
          upload(jsonData)
          toggleModal(false)
        }
      } catch (error) {
        setErrors([{
          id: generateRandomId,
          message: 'Invalid JSON file. Please upload a valid JSON file.'
        }])
      }
    }

    reader.readAsText(file)
  }

  return (
    <CustomModal
      show={show}
      toggleModal={toggleModal}
      header="Upload Draft JSON"
      message={
        (
          <>
            <div
              className={`p-4 border border-2 border-dashed rounded text-center ${isHovered ? 'border-secondary' : 'border-light'}`}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...getRootProps()}
            >
              <input
                type="file"
                aria-label="Upload JSON file"
                accept="application/json,text/plain"
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...getInputProps()}
              />
              <p>Drop a JSON file here or click to upload</p>
            </div>
            {
              file && (
                <div className="alert alert-info mt-3">
                  <FaFile className="me-2" />
                  Selected file:
                  {' '}
                  {file.name}
                </div>
              )
            }
            {
              errors.length > 0 && (
                <div className="alert alert-danger">
                  <ul className="mb-0">
                    {
                      errors.map((error) => (
                        <li key={error.id}>{error.message}</li>
                      ))
                    }
                  </ul>
                </div>
              )
            }
          </>
        )
      }
      actions={
        [
          {
            label: 'Upload',
            onClick: handleUpload,
            variant: 'primary'
          },
          {
            label: 'Cancel',
            onClick: () => toggleModal(false),
            variant: 'secondary'
          }
        ]
      }
    />
  )
}

JsonFileUploadModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  schema: PropTypes.oneOfType([
    PropTypes.shape({
      type: PropTypes.string,
      properties: PropTypes.objectOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.bool,
          PropTypes.arrayOf(PropTypes.string),
          PropTypes.shape({
            type: PropTypes.string,
            description: PropTypes.string
          })
        ])
      ),
      required: PropTypes.arrayOf(PropTypes.string)
    }),
    PropTypes.func
  ]).isRequired,
  upload: PropTypes.func.isRequired
}
