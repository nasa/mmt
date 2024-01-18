import { useLazyQuery, useMutation } from '@apollo/client'
import {
  CollectionPreview,
  ServicePreview,
  ToolPreview,
  VariablePreview
} from '@edsc/metadata-preview'
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
import DeleteModal from '../DeleteModal/DeleteModal'
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import LoadingBanner from '../LoadingBanner/LoadingBanner'
import Page from '../Page/Page'

const PublishPreview = () => {
  const {
    conceptId,
    revisionId
  } = useParams()

  const navigate = useNavigate()

  const [previewMetadata, setPreviewMetadata] = useState()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [error, setError] = useState()
  const [retries, setRetries] = useState(0)
  const [loading, setLoading] = useState(true)
  const [nativeId, setNativeId] = useState()
  const [providerId, setProviderId] = useState()

  const { addNotification } = useNotificationsContext()

  const derivedConceptType = getConceptTypeByConceptId(conceptId)

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
        providerId: savedProviderId
      } = fetchedMetadata || {}

      if (!fetchedMetadata || (savedRevisionId && revisionId !== savedRevisionId)) {
        // If fetchedMetadata or the correct revision id does't exist in CMR, then call getMetadata again.
        setRetries(retries + 1)
        setPreviewMetadata()
      } else {
        // The correct version of the metadata has been fetched
        setPreviewMetadata(fetchedMetadata)
        setNativeId(savedNativeId)
        setProviderId(savedProviderId)
        setLoading(false)
      }
    },
    onError: (getDraftError) => {
      setError(getDraftError)
      setLoading(false)

      // Send the error to the errorLogger
      errorLogger(getDraftError, 'DraftPreview: getDraft Query')
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

        // Hide the modal
        showDeleteModal(false)

        // Send the error to the errorLogger
        errorLogger(deleteError, 'DraftPreview: deleteDraftMutation')
      }
    })
  }

  // Determine which MetadataPreview component to show
  const metadataPreviewComponent = () => {
    if (derivedConceptType === 'Collection') {
      return (
        <CollectionPreview
          collection={previewMetadata}
          conceptId={conceptId}
          conceptType="collection"
        />
      )
    }

    if (derivedConceptType === 'Service') {
      return (
        <ServicePreview
          service={previewMetadata}
          conceptId={conceptId}
          conceptType="service"
        />
      )
    }

    if (derivedConceptType === 'Tool') {
      return (
        <ToolPreview
          tool={previewMetadata}
          conceptId={conceptId}
          conceptType="tool"
        />
      )
    }

    if (derivedConceptType === 'Variable') {
      return (
        <VariablePreview
          variable={previewMetadata}
          conceptId={conceptId}
          conceptType="variable"
        />
      )
    }

    return null
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

          <DeleteModal
            show={showDeleteModal}
            closeModal={() => setShowDeleteModal(false)}
            onDelete={handleDelete}
          />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          {metadataPreviewComponent()}
        </Col>
      </Row>
    </Page>

  )
}

export default PublishPreview
