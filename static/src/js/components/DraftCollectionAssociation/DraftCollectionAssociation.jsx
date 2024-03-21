import React, { useEffect, useState } from 'react'
import BootstrapTable from 'react-bootstrap/Table'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { useLazyQuery } from '@apollo/client'
import { useParams } from 'react-router'
import BootstrapSelect from 'react-bootstrap/Button'
import pluralize from 'pluralize'
import Page from '../Page/Page'
import useAppContext from '../../hooks/useAppContext'
import getConceptTypeByDraftConceptId from '../../utils/getConceptTypeByDraftConceptId'
import conceptTypeDraftQueries from '../../constants/conceptTypeDraftQueries'
import LoadingBanner from '../LoadingBanner/LoadingBanner'
import parseError from '../../utils/parseError'
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import errorLogger from '../../utils/errorLogger'
import useNotificationsContext from '../../hooks/useNotificationsContext'
import removeMetadataKeys from '../../utils/removeMetadataKeys'
import CollectionAssociationForm from '../CollectionAssociationForm/CollectionAssociationForm'
import useIngestDraftMutation from '../../hooks/useIngestDraftMutation'

const DraftCollectionAssociation = () => {
  const { conceptId } = useParams()

  const { user } = useAppContext()
  const { providerId } = user

  const [error, setError] = useState()
  const [fetchedDraft, setFetchedDraft] = useState()
  const [loading, setLoading] = useState()
  const [currentSelectedAssociation, setCurrentSelectedAssociation] = useState({})
  const derivedConceptType = getConceptTypeByDraftConceptId(conceptId)

  const { addNotification } = useNotificationsContext()

  const {
    ingestMutation, ingestDraft,
    error: ingestDraftError,
    loading: ingestLoading
  } = useIngestDraftMutation()

  const [getDraft] = useLazyQuery(conceptTypeDraftQueries[derivedConceptType], {
    variables: {
      params: {
        conceptId,
        conceptType: derivedConceptType
      }
    },
    onCompleted: (getDraftData) => {
      const { draft } = getDraftData
      const { ummMetadata } = draft
      const { _private } = ummMetadata
      const { CollectionAssociation: savedAssociation } = _private || {}

      setFetchedDraft(draft)
      setCurrentSelectedAssociation(savedAssociation)
      setLoading(false)
    },
    onError: (getDraftError) => {
      setLoading(false)
      errorLogger('Unable to retrieve draft', 'Collection Association: getDraft Query')

      setError(getDraftError)
    }
  })

  useEffect(() => {
    setLoading(true)
    getDraft()
  }, [])

  const handleClear = () => {
    const { ummMetadata } = fetchedDraft
    const { nativeId } = fetchedDraft

    const modifiedMetadata = removeMetadataKeys(ummMetadata, ['_private'])
    setLoading(true)
    ingestMutation(derivedConceptType, modifiedMetadata, nativeId, providerId)
  }

  useEffect(() => {
    if (ingestDraft) {
      setLoading(false)
      setCurrentSelectedAssociation(null)
      // Add a success notification
      addNotification({
        message: `Cleared ${conceptId} Association`,
        variant: 'success'
      })
    }

    if (ingestDraftError) {
      setLoading(false)
      errorLogger('Unable to Ingest Draft', 'Collection Association: ingestDraft Mutation')
      addNotification({
        message: 'Error removing collection association ',
        variant: 'danger'
      })
    }
  }, [ingestLoading])

  if (loading) {
    return (
      <Page>
        <LoadingBanner />
      </Page>
    )
  }

  if (error) {
    const message = parseError(error)

    return (
      <Page>
        <ErrorBanner message={message} />
      </Page>
    )
  }

  const { name } = fetchedDraft || {}

  return (
    <Page
      pageType="secondary"
      breadcrumbs={
        [
          {
            label: `${derivedConceptType} Drafts`,
            to: `/drafts/${derivedConceptType.toLowerCase()}s`
          },
          {
            label: name || '<Blank Name>',
            to: `/drafts/${pluralize(derivedConceptType).toLowerCase()}/${conceptId}`
          },
          {
            label: 'Collection Association',
            active: true
          }
        ]
      }
    >
      <h3>Collection Association Search</h3>
      <Row className="m-4">
        <h4>Currently Selected Collection</h4>
        <Col sm={12} className="bg-white rounded">
          <BootstrapTable striped>
            <thead>
              <tr>
                <th>Collection</th>
                <th>Short Name</th>
                <th>Version</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{currentSelectedAssociation?.collectionConceptId || 'No Collection Selected'}</td>
                <td>{currentSelectedAssociation?.shortName}</td>
                <td>{currentSelectedAssociation?.version}</td>
              </tr>
            </tbody>
          </BootstrapTable>
          <BootstrapSelect
            className="mb-3 m-2"
            onClick={handleClear}
            variant="outline-danger"
          >
            Clear Collection Association
          </BootstrapSelect>
        </Col>

        <h4 className="mt-5">Search for Collections</h4>
        <Col sm={12}>
          <CollectionAssociationForm metadata={fetchedDraft} />
        </Col>

      </Row>
    </Page>
  )
}

export default DraftCollectionAssociation
