import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useParams } from 'react-router'
import pluralize from 'pluralize'
import Page from '../Page/Page'
import conceptTypeQueries from '../../constants/conceptTypeQueries'
import getConceptTypeByConceptId from '../../utils/getConceptTypeByConcept'
import toLowerKebabCase from '../../utils/toLowerKebabCase'
import errorLogger from '../../utils/errorLogger'
import parseError from '../../utils/parseError'
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import LoadingBanner from '../LoadingBanner/LoadingBanner'
import CollectionAssociationForm from '../CollectionAssociationForm/CollectionAssociationForm'

const CollectionAssociationSearch = () => {
  const { conceptId } = useParams()

  const derivedConceptType = getConceptTypeByConceptId(conceptId)

  const [fetchedData, setFetchedData] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const [getMetadata] = useLazyQuery(conceptTypeQueries[derivedConceptType], {
    variables: {
      params: {
        conceptId
      }
    },
    onCompleted: (getData) => {
      const data = getData[toLowerKebabCase(derivedConceptType)]

      setFetchedData(data)
      setLoading(false)
    },
    onError: (getDraftError) => {
      setLoading(false)
      errorLogger('Unable to retrieve draft', 'Collection Association: getDraft Query')

      setError(getDraftError)
    }
  })

  useEffect(() => {
    getMetadata()
    setLoading(true)
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

  const { name } = fetchedData || {}

  return (
    <Page
      title={`${name} Collection Associations` || '<Blank Name>'}
      pageType="secondary"
      breadcrumbs={
        [
          {
            label: `${derivedConceptType}`,
            to: `/${derivedConceptType.toLowerCase()}s`
          },
          {
            label: name || '<Blank Name>',
            to: `/${pluralize(derivedConceptType).toLowerCase()}/${conceptId}`
          },
          {
            label: 'Collection Association',
            to: `/${pluralize(derivedConceptType).toLowerCase()}/${conceptId}/collection-association`
          },
          {
            label: 'Collection Association Search',
            active: true
          }
        ]
      }
    >
      <CollectionAssociationForm metadata={fetchedData} />
    </Page>
  )
}

export default CollectionAssociationSearch
