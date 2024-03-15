import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useParams } from 'react-router'
import Page from '../Page/Page'
import conceptTypeQueries from '../../constants/conceptTypeQueries'
import getConceptTypeByConceptId from '../../utils/getConceptTypeByConcept'
import toLowerKebabCase from '../../utils/toLowerKebabCase'
import errorLogger from '../../utils/errorLogger'
import parseError from '../../utils/parseError'
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import LoadingBanner from '../LoadingBanner/LoadingBanner'
import CollectionAssociation from '../CollectionAssociation/CollectionAssociation'
import CollectionAssociationForm from '../CollectionAssociationForm/CollectionAssociationForm'

const CollectionAssociationSearch = () => {
  const { conceptId } = useParams()

  const derivedConceptType = getConceptTypeByConceptId(conceptId)

  const [fetchedDraft, setFetchedDraft] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const [getMetadata] = useLazyQuery(conceptTypeQueries[derivedConceptType], {
    variables: {
      params: {
        conceptId
      }
    },
    onCompleted: (getData) => {
      const fetchedData = getData[toLowerKebabCase(derivedConceptType)]

      setFetchedDraft(fetchedData)
      setLoading(false)
      // SetTableLoading(false)
    },
    onError: (getDraftError) => {
      setLoading(false)
      // SetTableLoading(false)
      errorLogger('Unable to retrieve draft', 'Collection Association: getDraft Query')

      setError(getDraftError)
    }
  })

  useEffect(() => {
    getMetadata()
    setLoading(true)
    // SetTableLoading(true)
  }, [])

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

  const { name } = fetchedDraft || {}

  return (
    <Page
      title={`${name} Collection Associations` || '<Blank Name>'}
      pageType="secondary"
    >
      <CollectionAssociationForm />
    </Page>
  )
}

export default CollectionAssociationSearch
