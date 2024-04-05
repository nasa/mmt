import { useLazyQuery, useMutation } from '@apollo/client'
import pluralize from 'pluralize'
import React, { useState, useEffect } from 'react'
import {
  Badge,
  Button,
  Col,
  ListGroup,
  ListGroupItem,
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
import removeMetadataKeys from '../../utils/removeMetadataKeys'
import constructDownloadableFile from '../../utils/constructDownloadableFile'
import conceptTypes from '../../constants/conceptTypes'
import getConceptTypeByDraftConceptId from '../../utils/getConceptTypeByDraftConceptId'
import For from '../For/For'
import getTagCount from '../../utils/getTagCount'

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
  const [showTagModal, setShowTagModal] = useState(false)
  const [ummMetadata, setUmmMetadata] = useState()
  const [error, setError] = useState()
  const [retries, setRetries] = useState(0)
  const [loading, setLoading] = useState(true)
  const [nativeId, setNativeId] = useState()

  const toggleShowDeleteModal = (nextState) => {
    setShowDeleteModal(nextState)
  }

  const toggleTagModal = (nextState) => {
    setShowTagModal(nextState)
  }

  const { addNotification } = useNotificationsContext()

  const derivedConceptType = getConceptTypeByConceptId(conceptId)

  const {
    ingestMutation, ingestDraft,
    error: ingestDraftError,
    loading: ingestLoading
  } = useIngestDraftMutation()

  const [deleteMutation] = useMutation(deleteMutationTypes[derivedConceptType])

  const getMetadataVariables = () => {
    if (derivedConceptType === conceptTypes.Collection) {
      return {
        conceptId,
        includeTags: '*'
      }
    }

    return { conceptId }
  }

  // Calls CMR-Graphql to get the record
  const [getMetadata] = useLazyQuery(conceptTypeQueries[derivedConceptType], {
    variables: {
      params: getMetadataVariables()
    },
    onCompleted: (getData) => {
      const fetchedPreviewMetadata = getData[toLowerKebabCase(derivedConceptType)]
      const {
        revisionId: fetchedRevisionId,
        nativeId: fetchedNativeId,
        ummMetadata: fetchedUmmMetadata
      } = fetchedPreviewMetadata || {}

      // If revisionId is present in the URL
      if (revisionId) {
        if (!fetchedPreviewMetadata || (fetchedRevisionId && revisionId !== fetchedRevisionId)) {
          // If fetchedMetadata or the correct revision id does't exist in CMR, then call getMetadata again.
          setRetries(retries + 1)
          setPreviewMetadata()
        }
      }

      setPreviewMetadata(fetchedPreviewMetadata)
      setNativeId(fetchedNativeId)
      setLoading(false)
      setUmmMetadata(fetchedUmmMetadata)
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

  // Calls ingestDraft mutation with a new nativeId
  const handleClone = () => {
    const cloneNativeId = `MMT_${crypto.randomUUID()}`
    // Removes the value from the metadata that has to be unique
    removeMetadataKeys(ummMetadata, ['Name', 'LongName', 'ShortName'])

    ingestMutation(derivedConceptType, ummMetadata, cloneNativeId, providerId)
  }

  // Handles the user selecting download record
  const handleDownload = () => {
    const contents = JSON.stringify(ummMetadata)

    constructDownloadableFile(contents, conceptId)
  }

  // Handles the user selection Create Associated Variable for a Collection
  // This will create a new variable draft with the collection conceptId
  const handleCreateAssociatedVariable = () => {
    setLoading(true)

    const { conceptId: collectionConceptId, shortName, versionId } = previewMetadata

    const variableDraft = {
      _private: {
        CollectionAssociation: {
          collectionConceptId,
          shortName,
          version: versionId
        }
      }
    }

    ingestMutation('Variable', variableDraft, `MMT_${crypto.randomUUID()}`, providerId)
  }

  useEffect(() => {
    if (ingestDraftError) {
      errorLogger(ingestDraftError, 'PublishPreview ingestDraftMutation Query')
      addNotification({
        message: 'Error creating draft',
        variant: 'danger'
      })
    }

    if (ingestDraft) {
      const { ingestDraft: fetchedIngestDraft } = ingestDraft
      const { conceptId: ingestConceptId } = fetchedIngestDraft
      navigate(`/drafts/${pluralize(getConceptTypeByDraftConceptId(ingestConceptId)).toLowerCase()}/${ingestConceptId}`)
      addNotification({
        message: 'Draft created successfully',
        variant: 'success'
      })
    }
  }, [ingestLoading])

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
        toggleShowDeleteModal(false)

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
        toggleShowDeleteModal(false)
      }
    })
  }

  const handleManageCollectionAssociation = () => {
    navigate(`/${pluralize(derivedConceptType).toLowerCase()}/${conceptId}/collection-association`)
  }

  const versions = parseInt(revisionId, 10)
  const handleRevisions = () => {
    navigate(`/${pluralize(derivedConceptType).toLowerCase()}/${conceptId}/revisions?versions=${versions}`)
  }

  let tagCount = 0
  let granuleCount = 0
  if (derivedConceptType === conceptTypes.Collection) {
    const { tagDefinitions, granules } = previewMetadata || {}
    const { count } = granules || {}

    tagCount = getTagCount(tagDefinitions)
    granuleCount = count
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

          <Button
            className="btn btn-link"
            type="button"
            variant="link"
            onClick={
              () => {
                handleClone()
              }
            }
          >
            Clone
            {' '}
            {derivedConceptType}
            {' '}
            Record
          </Button>

          <Button
            className="btn btn-link"
            type="button"
            variant="link"
            onClick={
              () => {
                handleDownload()
              }
            }
          >
            Download
            {' '}
            {derivedConceptType}
            {' '}
            Record
          </Button>

          {
            derivedConceptType === conceptTypes.Collection && (
              <>
                <Button
                  className="btn btn-link"
                  type="button"
                  variant="link"
                  onClick={
                    () => {
                      toggleTagModal(true)
                    }
                  }
                >
                  Tags
                  <Badge
                    className="m-1"
                    bg="secondary"
                    pill
                  >
                    { tagCount }
                  </Badge>
                </Button>
                <Button
                  className="btn btn-link"
                  type="button"
                  variant="link"
                  disabled
                >
                  Granules
                  <Badge
                    className="m-1"
                    bg="secondary"
                    pill
                  >
                    { granuleCount }
                  </Badge>

                </Button>
                <Button
                  className="btn btn-link"
                  type="button"
                  variant="link"
                  onClick={
                    () => {
                      handleCreateAssociatedVariable()
                    }
                  }
                >
                  Create Associated Variable
                </Button>
              </>
            )
          }
          {
            derivedConceptType !== conceptTypes.Collection && (
              <Button
                className="btn btn-link"
                type="button"
                variant="link"
                onClick={
                  () => {
                    handleManageCollectionAssociation()
                  }
                }
              >
                Manage Collection Associations
              </Button>
            )
          }

          <Button
            className="btn btn-link"
            type="button"
            variant="link"
            onClick={
              () => {
                handleRevisions()
              }
            }
          >
            Revisions
            <Badge
              className="m-1"
              bg="secondary"
              pill
            >
              { versions }
            </Badge>
          </Button>
          <Button
            type="button"
            variant="outline-danger"
            onClick={
              () => {
                toggleShowDeleteModal(true)
              }
            }
          >
            Delete
            {' '}
            {derivedConceptType}
            {' '}
            Record
          </Button>

          <CustomModal
            message="Are you sure you want to delete this record?"
            show={showDeleteModal}
            size="lg"
            toggleModal={toggleShowDeleteModal}
            actions={
              [
                {
                  label: 'No',
                  variant: 'secondary',
                  onClick: () => { toggleShowDeleteModal(false) }
                },
                {
                  label: 'Yes',
                  variant: 'primary',
                  onClick: handleDelete
                }
              ]
            }
          />
          <CustomModal
            show={showTagModal}
            toggleModal={toggleTagModal}
            actions={
              [
                {
                  label: 'Close',
                  variant: 'primary',
                  onClick: () => { toggleTagModal(false) }
                }
              ]
            }
            header={previewMetadata?.tagDefinitions?.items && `${Object.keys(previewMetadata.tagDefinitions.items).length} ${pluralize('tag', Object.keys(previewMetadata.tagDefinitions.items).length)}`}
            message={
              previewMetadata?.tagDefinitions
                ? (
                  <>
                    <h3 className="fw-bolder h5">{}</h3>
                    <ListGroup>
                      <For each={previewMetadata.tagDefinitions.items}>
                        {
                          (tagItems) => (
                            <ListGroupItem key={tagItems.tagKey}>
                              <dl>
                                <dt>Tag Key:</dt>
                                <dd>{tagItems.tagKey}</dd>
                                <dt>Description:</dt>
                                <dd>
                                  {tagItems.description}
                                </dd>
                              </dl>
                            </ListGroupItem>
                          )
                        }
                      </For>
                    </ListGroup>
                  </>
                )
                : 'There are no tags associated with this collection'
            }
          />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
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
