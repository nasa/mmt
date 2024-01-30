import { useLazyQuery, useMutation } from '@apollo/client'
import pluralize from 'pluralize'
import React, { useState, useEffect } from 'react'
import {
  Button,
  Col,
  Row
} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router'
import conceptTypeQueries from '../../constants/conceptTypeQueries'
import deleteMutationTypes from '../../constants/deleteMutationTypes'
import useNotificationsContext from '../../hooks/useNotificationsContext'
import errorLogger from '../../utils/errorLogger'
import getConceptTypeByConceptId from '../../utils/getConceptTypeByConcept'
import parseError from '../../utils/parseError'
import toLowerKebabCase from '../../utils/toLowerKebabCase'
import CustomModal from '../CustomModal/CustomModal'
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import LoadingBanner from '../LoadingBanner/LoadingBanner'
import MetadataPreview from '../MetadataPreview/MetadataPreview'
import Page from '../Page/Page'
import useAppContext from '../../hooks/useAppContext'
import useIngestDraftMutation from '../../hooks/useIngestDraftMutation'

/**
 * Renders a PublishPreview component
 *
 * @component
 * @example <caption>Render a PublishPreview</caption>
 * return (
 *   <PublishPreview />
 * )
 */
const PublishPreview = () => {
  const {
    conceptId,
    revisionId
  } = useParams()

  const { user } = useAppContext()
  const { providerId } = user
  const navigate = useNavigate()

  const [previewMetadata, setPreviewMetadata] = useState()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [ummMetadata, setUmmMetadata] = useState()
  const [error, setError] = useState()
  const [retries, setRetries] = useState(0)
  const [loading, setLoading] = useState(true)
  const [nativeId, setNativeId] = useState()
  // Const [providerId, setProviderId] = useState()

  const { addNotification } = useNotificationsContext()

  const derivedConceptType = getConceptTypeByConceptId(conceptId)

  const ingestMutation = useIngestDraftMutation()

  const [deleteMutation] = useMutation(deleteMutationTypes[derivedConceptType])

  // Calls CMR-Graphql to get the record
  const [getMetadata] = useLazyQuery(conceptTypeQueries[derivedConceptType], {
    variables: {
      params: {
        conceptId
      }
    },
    onCompleted: (getData) => {
      const fetchedMetadata = getData[toLowerKebabCase(derivedConceptType)]
      const {
        revisionId: savedRevisionId,
        nativeId: savedNativeId,
        ummMetadata: savedUmmMetadata
      } = fetchedMetadata || {}

      if (!fetchedMetadata || (savedRevisionId && revisionId !== savedRevisionId)) {
        // If fetchedMetadata or the correct revision id does't exist in CMR, then call getMetadata again.
        setRetries(retries + 1)
        setPreviewMetadata()
      } else {
        // The correct version of the metadata has been fetched
        setPreviewMetadata(fetchedMetadata)
        setNativeId(savedNativeId)
        setLoading(false)
        setUmmMetadata(savedUmmMetadata)
      }
    },
    onError: (getDraftError) => {
      setError(getDraftError)
      setLoading(false)
      // Send the error to the errorLogger
      errorLogger(getDraftError, 'PublishPreview getPublish Query')
    }
  })

  // Calls getMetadata and checks if the revision id matches the revision saved.
  useEffect(() => {
    if (!previewMetadata && retries < 10) {
      setLoading(true)
      getMetadata()
    }

    if (retries >= 10) {
      setLoading(false)
      errorLogger('Max retries allowed', 'Publish Preview: getMetadata Query')
      setError('Published record could not be loaded.')
    }
  }, [previewMetadata, retries])

  // Calls ingestDraft mutation with the same nativeId and ummMetadata
  // TODO: Need to check if the record trying to edit is in the same provider
  const handleEdit = () => {
    ingestMutation(derivedConceptType, ummMetadata, nativeId, providerId)
  }

  // Handles the user selecting delete from the delete model
  const handleDelete = () => {
    deleteMutation({
      variables: {
        nativeId,
        providerId
      },
      onCompleted: () => {
        // Add a success notification
        addNotification({
          message: `${conceptId} deleted successfully`,
          variant: 'success'
        })

        // Hide the modal
        setShowDeleteModal(false)

        // Navigate to the manage page
        navigate(`/manage/${pluralize(derivedConceptType).toLowerCase()}`)
      },
      onError: (deleteError) => {
        // Add an error notification
        addNotification({
          message: `Error deleting ${conceptId}`,
          variant: 'danger'
        })

        // Send the error to the errorLogger
        errorLogger(deleteError, 'PublishPreview: deleteMutation')

        // Hide the modal
        setShowDeleteModal(false)
      }
    })
  }

  if (error) {
    const message = parseError(error)

    return (
      <Page>
        <ErrorBanner message={message} />
      </Page>
    )
  }

  if (loading) {
    return (
      <Page>
        <LoadingBanner />
      </Page>
    )
  }

  return (
    <Page>
      <Row>
        <Col className="mb-5" md={12}>
          {/* Edit Publish record link */}
          <Button
            className="btn btn-link"
            type="button"
            variant="link"
            onClick={
              () => {
                handleEdit()
              }
            }
          >
            Edit
            {' '}
            {derivedConceptType}
            {' '}
            Record
          </Button>
          {/* Delete Publish record button */}
          <Button
            type="button"
            variant="outline-danger"
            onClick={
              () => {
                setShowDeleteModal(true)
              }
            }
          >
            Delete
            {' '}
            {derivedConceptType}
            {' '}
            Record
          </Button>
          {/* Renders the Delete Modal */}
          <CustomModal
            message="Are you sure you want to delete this record?"
            openModal={showDeleteModal}
            actions={
              [
                {
                  label: 'No',
                  variant: 'secondary',
                  onClick: () => { setShowDeleteModal(false) }
                },
                {
                  label: 'Yes',
                  variant: 'primary',
                  onClick: handleDelete
                }
              ]
            }
          />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          {/* Renders the Metadata Preview */}
          <MetadataPreview
            previewMetadata={previewMetadata}
            conceptId={conceptId}
            conceptType={derivedConceptType}
          />
        </Col>
      </Row>
    </Page>

  )
}

export default PublishPreview
