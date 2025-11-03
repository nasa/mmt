import { useMutation, useSuspenseQuery } from '@apollo/client'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'
import React, {
  useState,
  useEffect,
  Suspense
} from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'
import Row from 'react-bootstrap/Row'
import { useNavigate, useParams } from 'react-router'
import {
  FaClone,
  FaDownload,
  FaEdit,
  FaEye,
  FaTrash
} from 'react-icons/fa'
import { v4 as uuidv4 } from 'uuid'

import conceptTypeQueries from '@/js//constants/conceptTypeQueries'
import deleteMutationTypes from '@/js//constants/deleteMutationTypes'
import conceptTypes from '@/js//constants/conceptTypes'

import useIngestDraftMutation from '@/js//hooks/useIngestDraftMutation'
import useNotificationsContext from '@/js//hooks/useNotificationsContext'

import CustomModal from '@/js/components/CustomModal/CustomModal'
import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import For from '@/js/components/For/For'
import MetadataPreview from '@/js/components/MetadataPreview/MetadataPreview'
import MetadataPreviewPlaceholder from '@/js/components/MetadataPreviewPlaceholder/MetadataPreviewPlaceholder'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'

import errorLogger from '@/js//utils/errorLogger'
import getConceptTypeByConceptId from '@/js//utils/getConceptTypeByConceptId'
import removeMetadataKeys from '@/js//utils/removeMetadataKeys'
import constructDownloadableFile from '@/js//utils/constructDownloadableFile'
import getConceptTypeByDraftConceptId from '@/js//utils/getConceptTypeByDraftConceptId'

import './PublishPreview.scss'

/**
 * Renders a PublishPreviewHeader component
 *
 * @component
 * @example <caption>Render a PublishPreviewHeader</caption>
 * return (
 *   <PublishPreviewHeader />
 * )
 */
const PublishPreviewHeader = () => {
  const { conceptId } = useParams()

  const navigate = useNavigate()

  const derivedConceptType = getConceptTypeByConceptId(conceptId)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showTagModal, setShowTagModal] = useState(false)

  const toggleShowDeleteModal = (nextState) => {
    setShowDeleteModal(nextState)
  }

  const toggleTagModal = (nextState) => {
    setShowTagModal(nextState)
  }

  const navigateToServices = () => {
    navigate(`/collections/${conceptId}/service-associations`)
  }

  const navigateToGranules = () => {
    navigate(`/collections/${conceptId}/granules`)
  }

  const { addNotification } = useNotificationsContext()
  const [deleteMutation] = useMutation(deleteMutationTypes[derivedConceptType], {
    update: (cache) => {
      cache.modify({
        fields: {
          // Remove the list of the derivedContceptType from the cache. This ensures that if the user returns to the list page they will see the correct data.
          [pluralize(derivedConceptType).toLowerCase()]: () => {}
        }
      })
    }
  })

  const { data } = useSuspenseQuery(conceptTypeQueries[derivedConceptType], {
    variables: {
      params: {
        conceptId
      }
    }
  })

  const { [derivedConceptType.toLowerCase()]: concept } = data

  // This may be due to a CMR lag error and affects functionality in ErrorBanner
  if (!concept) {
    throw new Error('concept is null')
  }

  const {
    granules,
    nativeId,
    pageTitle = '<Blank Name>',
    providerId,
    revisions,
    services,
    tagDefinitions,
    ummMetadata
  } = concept

  const { count: revisionCount } = revisions

  let granuleCount = 0
  if (granules) {
    ({ count: granuleCount } = granules)
  }

  let tagCount = 0
  if (tagDefinitions) {
    tagCount = tagDefinitions.items.length
  }

  let serviceCount = 0
  if (services) {
    ({ count: serviceCount } = services)
  }

  const {
    ingestMutation, ingestDraft,
    error: ingestDraftError,
    loading: ingestLoading
  } = useIngestDraftMutation()

  // Calls ingestDraft mutation with a new nativeId
  const handleClone = () => {
    const cloneNativeId = `MMT_${uuidv4()}`
    // Removes the value from the metadata that has to be unique
    const modifiedMetadata = removeMetadataKeys(ummMetadata, ['Name', 'LongName', 'ShortName', 'EntryTitle'])

    ingestMutation(derivedConceptType, modifiedMetadata, cloneNativeId, providerId)
  }

  // Handles the user selecting download record
  const handleDownload = () => {
    const contents = JSON.stringify(ummMetadata)

    constructDownloadableFile(contents, conceptId)
  }

  useEffect(() => {
    if (ingestDraftError) {
      const { message } = ingestDraftError
      errorLogger(ingestDraftError, 'PublishPreview: ingestDraftMutation Query')
      addNotification({
        message: `Error creating draft: ${message}`,
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

        // Navigate to the search page
        navigate(`/${pluralize(derivedConceptType).toLowerCase()}`)
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

  return (
    <>
      <PageHeader
        additionalActions={
          [
            {
              icon: FaDownload,
              onClick: handleDownload,
              title: 'Download JSON'
            },
            {
              icon: FaEye,
              to: `/${pluralize(derivedConceptType).toLowerCase()}/${conceptId}/revisions`,
              title: 'View Revisions',
              count: revisionCount
            },
            ...(
              derivedConceptType === conceptTypes.Collection
                ? [
                  {
                    icon: FaEye,
                    onClick: () => navigateToGranules(),
                    title: 'View Granules',
                    count: granuleCount,
                    disabled: granuleCount === 0
                  },
                  {
                    icon: FaEye,
                    onClick: () => toggleTagModal(true),
                    title: 'View Tags',
                    count: tagCount
                  },
                  {
                    icon: FaEye,
                    onClick: () => navigateToServices(),
                    title: 'View Services',
                    count: serviceCount
                  }
                ]
                : [
                  {
                    icon: FaEye,
                    to: `/${pluralize(derivedConceptType).toLowerCase()}/${conceptId}/collection-association`,
                    title: 'Collection Associations'
                  }
                ]
            )
          ]
        }
        breadcrumbs={
          [
            {
              label: `${pluralize(derivedConceptType)}`,
              to: `/${pluralize(derivedConceptType).toLowerCase()}`
            },
            {
              label: pageTitle,
              active: true
            }
          ]
        }
        pageType="secondary"
        primaryActions={
          [
            {
              icon: FaEdit,
              onClick: () => ingestMutation(derivedConceptType, ummMetadata, nativeId, providerId),
              title: 'Edit',
              iconTitle: 'A edit icon',
              variant: 'primary'
            },
            {
              icon: FaTrash,
              onClick: () => toggleShowDeleteModal(true),
              title: 'Delete',
              iconTitle: 'A trash can icon',
              variant: 'danger'
            },
            {
              icon: FaClone,
              onClick: handleClone,
              title: 'Clone',
              iconTitle: 'A clone icon',
              variant: 'light-dark'
            }
          ]
        }
        title={pageTitle}
      />
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
        header={concept?.tagDefinitions?.items && `${Object.keys(concept.tagDefinitions.items).length} ${pluralize('tag', Object.keys(concept.tagDefinitions.items).length)}`}
        message={
          concept?.tagDefinitions
            ? (
              <ListGroup>
                <For each={concept.tagDefinitions.items}>
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
            )
            : 'There are no tags associated with this collection'
        }
      />
    </>
  )
}

/**
 * Renders a PublishPreviewPlaceholder component
 *
 * @component
 * @example <caption>Render a PublishPreviewPlaceholder</caption>
 * return (
 *   <PublishPreviewPlaceholder />
 * )
 */
const PublishPreviewPlaceholder = () => (
  <MetadataPreviewPlaceholder />
)

/**
 * Renders a PublishPreview component
 *
 * @component
 * @example <caption>Render a PublishPreview</caption>
 * return (
 *   <PublishPreview />
 * )
 */
const PublishPreview = ({ isRevision }) => {
  const {
    conceptId
  } = useParams()

  const navigate = useNavigate()

  const derivedConceptType = getConceptTypeByConceptId(conceptId)

  const viewPublishedRecord = () => {
    navigate(`/${pluralize(derivedConceptType).toLowerCase()}/${conceptId}`)
  }

  return (
    <Page
      pageType="secondary"
      header={<PublishPreviewHeader />}
    >
      {
        isRevision && (
          <Row>
            <Col>
              <Alert className="d-flex align-items-center fst-italic fs-6" variant="warning">
                <i className="eui-icon eui-fa-info-circle" />
                {' '}
                You are viewing an older revision of this
                {' '}
                {`${derivedConceptType}.`}
                {' '}
                <Button
                  className="ms-2 p-0"
                  type="button"
                  variant="link"
                  onClick={viewPublishedRecord}
                >
                  Click here to view the latest published revision
                </Button>
              </Alert>
            </Col>
          </Row>
        )
      }
      <ErrorBoundary>
        <Suspense fallback={<PublishPreviewPlaceholder />}>
          <MetadataPreview
            conceptId={conceptId}
            conceptType={derivedConceptType}
          />
        </Suspense>
      </ErrorBoundary>
    </Page>
  )
}

PublishPreview.defaultProps = {
  isRevision: false
}

PublishPreview.propTypes = {
  isRevision: PropTypes.bool
}

export default PublishPreview
