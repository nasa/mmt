import React, { useEffect, useState } from 'react'
import BootstrapTable from 'react-bootstrap/Table'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'

import getConceptTypeByDraftConceptId from '../../utils/getConceptTypeByDraftConceptId'
import errorLogger from '../../utils/errorLogger'
import removeMetadataKeys from '../../utils/removeMetadataKeys'

import conceptTypeDraftQueries from '../../constants/conceptTypeDraftQueries'

import useAppContext from '../../hooks/useAppContext'
import useIngestDraftMutation from '../../hooks/useIngestDraftMutation'
import useNotificationsContext from '../../hooks/useNotificationsContext'

import CollectionAssociationForm from '../CollectionAssociationForm/CollectionAssociationForm'

import Button from '../Button/Button'

/**
 * Renders a DraftCollectionAssociation component
 *
 * @component
 * @example <caption>Render a DraftCollectionAssociation</caption>
 * return (
 *   <DraftCollectionAssociation />
 * )
 */
const DraftCollectionAssociation = () => {
  const { conceptId } = useParams()

  const { user } = useAppContext()
  const { providerId } = user

  const [fetchedDraft, setFetchedDraft] = useState()
  const [currentSelectedAssociation, setCurrentSelectedAssociation] = useState({})
  const [showClearButton, setShowClearButton] = useState(true)
  const derivedConceptType = getConceptTypeByDraftConceptId(conceptId)

  const { addNotification } = useNotificationsContext()

  const {
    ingestMutation, ingestDraft,
    error: ingestDraftError,
    loading: ingestLoading
  } = useIngestDraftMutation()

  const { data } = useSuspenseQuery(conceptTypeDraftQueries[derivedConceptType], {
    variables: {
      params: {
        conceptId,
        conceptType: derivedConceptType
      }
    }
  })

  useEffect(() => {
    const { draft } = data
    const { ummMetadata } = draft
    const { _private } = ummMetadata
    const { CollectionAssociation: savedAssociation } = _private || {}

    if (savedAssociation) {
      setShowClearButton(false)
    }

    setFetchedDraft(draft)
    setCurrentSelectedAssociation(savedAssociation)
  }, [data])

  const handleClear = () => {
    const { ummMetadata } = fetchedDraft
    const { nativeId } = fetchedDraft

    const modifiedMetadata = removeMetadataKeys(ummMetadata, ['_private'])
    ingestMutation(derivedConceptType, modifiedMetadata, nativeId, providerId)
  }

  useEffect(() => {
    if (ingestDraft) {
      setShowClearButton(true)
      setCurrentSelectedAssociation(null)
      // Add a success notification
      addNotification({
        message: `Cleared ${conceptId} Association`,
        variant: 'success'
      })
    }

    if (ingestDraftError) {
      errorLogger('Unable to Ingest Draft', 'Collection Association: ingestDraft Mutation')
      addNotification({
        message: 'Error removing collection association ',
        variant: 'danger'
      })
    }
  }, [ingestLoading])

  return (
    <Row>
      <h4>Selected Collection</h4>
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
        <Button
          onClick={handleClear}
          variant="danger"
          disabled={showClearButton}
        >
          Clear Collection Association
        </Button>
      </Col>

      <h4 className="mt-5">Search for Collections</h4>
      <Col sm={12}>
        <CollectionAssociationForm metadata={fetchedDraft} />
      </Col>

    </Row>
  )
}

export default DraftCollectionAssociation
