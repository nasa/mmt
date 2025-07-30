import React, {
  useState,
  useCallback,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import { FaFile } from 'react-icons/fa'
import { useDropzone } from 'react-dropzone'
import './JsonFileUploadModal.scss'

import CustomModal from '@/js/components/CustomModal/CustomModal'
import { validateJson } from '@/js/utils/validateJson'

// Helper function to generate a unique ID
const generateId = () => Math.random().toString(36).slice(2, 11)

export const JsonFileUploadModal = ({
  show, toggleModal, schema, upload
}) => {
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState([])

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setErrors([])
    }
  }, [])

  const {
    getRootProps, getInputProps, isDragActive
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

  const handleUpload = () => {
    if (!file) {
      setErrors([{
        id: generateId(),
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
            id: generateId(),
            message: error
          })))
        } else {
          upload(jsonData)
          toggleModal(false)
        }
      } catch (error) {
        setErrors([{
          id: generateId(),
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
              className="file-upload-area"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...getRootProps()}
            >
              <input
                type="file"
                accept="application/json,text/plain"
                onChange={getInputProps().onChange}
                onBlur={getInputProps().onBlur}
                onClick={getInputProps().onClick}
                ref={getInputProps().ref}
                style={getInputProps().style}
                data-testid="file-input"
              />
              {
                isDragActive ? (
                  <p>Drop the JSON file here...</p>
                ) : (
                  <p>Drag &apos;n&apos; drop a JSON file here, or click to select a file</p>
                )
              }
            </div>
            {
              file && (
                <div className="alert alert-info mt-3" data-testid="selected-file-info">
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
