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

import conceptTypeQueries from '../../constants/conceptTypeQueries'
import deleteMutationTypes from '../../constants/deleteMutationTypes'
import conceptTypes from '../../constants/conceptTypes'

import useNotificationsContext from '../../hooks/useNotificationsContext'
import useAppContext from '../../hooks/useAppContext'
import useIngestDraftMutation from '../../hooks/useIngestDraftMutation'

import CustomModal from '../CustomModal/CustomModal'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import For from '../For/For'
import LoadingBanner from '../LoadingBanner/LoadingBanner'
import MetadataPreview from '../MetadataPreview/MetadataPreview'
import Page from '../Page/Page'
import PageHeader from '../PageHeader/PageHeader'

import errorLogger from '../../utils/errorLogger'
import getConceptTypeByConceptId from '../../utils/getConceptTypeByConceptId'
import removeMetadataKeys from '../../utils/removeMetadataKeys'
import constructDownloadableFile from '../../utils/constructDownloadableFile'
import getConceptTypeByDraftConceptId from '../../utils/getConceptTypeByDraftConceptId'

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

  const { user } = useAppContext()
  const { providerId } = user

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

  const { addNotification } = useNotificationsContext()
  const [deleteMutation] = useMutation(deleteMutationTypes[derivedConceptType])

  const { data } = useSuspenseQuery(conceptTypeQueries[derivedConceptType], {
    variables: {
      params: {
        conceptId
      }
    }
  })

  const { [derivedConceptType.toLowerCase()]: concept } = data

  const {
    granules,
    nativeId,
    pageTitle = '<Blank Name>',
    revisions,
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

  const {
    ingestMutation, ingestDraft,
    error: ingestDraftError,
    loading: ingestLoading
  } = useIngestDraftMutation()

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

  const handleManageCollectionAssociation = () => {
    navigate(`/${pluralize(derivedConceptType).toLowerCase()}/${conceptId}/collection-association`)
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
        navigate(`/drafts/${pluralize(derivedConceptType).toLowerCase()}`)
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
                    onClick: () => { },
                    title: 'View Granules',
                    count: granuleCount,
                    disabled: true
                  },
                  {
                    icon: FaEye,
                    onClick: () => toggleTagModal(true),
                    title: 'View Tags',
                    count: tagCount
                  }
                ]
                : [
                  {
                    icon: FaEye,
                    onClick: handleManageCollectionAssociation,
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
              <Alert className="fst-italic fs-6" variant="warning">
                <i className="eui-icon eui-fa-info-circle" />
                {' '}
                You are viewing an older revision of this
                {' '}
                {`${derivedConceptType}.`}
                {' '}
                <Button
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
        <Suspense fallback={<LoadingBanner />}>
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
