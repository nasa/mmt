import React, { Suspense } from 'react'

import { useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'
import pluralize from 'pluralize'

import CollectionAssociationForm from '../../components/CollectionAssociationForm/CollectionAssociationForm'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import Page from '../../components/Page/Page'
import PageHeader from '../../components/PageHeader/PageHeader'

import conceptTypeQueries from '../../constants/conceptTypeQueries'

import getConceptTypeByConceptId from '../../utils/getConceptTypeByConcept'

/**
 * Renders a CollectionAssociationFormPageHeader component
 *
 * @component
 * @example <caption>Render a CollectionAssociationFormPageHeader</caption>
 * return (
 *   <CollectionAssociationFormPageHeader />
 * )
 */
const CollectionAssociationFormPageHeader = () => {
  const { conceptId } = useParams()
  const derivedConceptType = getConceptTypeByConceptId(conceptId)

  const { data } = useSuspenseQuery(conceptTypeQueries[derivedConceptType], {
    variables: {
      params: {
        conceptId
      }
    }
  })

  const { [derivedConceptType.toLowerCase()]: fetchedData } = data
  const { name } = fetchedData

  return (
    <PageHeader
      title={`${name} Collection Associations`}
      breadcrumbs={
        [
          {
            label: derivedConceptType,
            to: `/drafts/${derivedConceptType.toLowerCase()}s`
          },
          {
            label: name,
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
      pageType="secondary"
    />
  )
}

/**
 * Renders a CollectionAssociationFormPage component
 *
 * @component
 * @example <caption>Render a CollectionAssociationFormPage</caption>
 * return (
 *   <CollectionAssociationFormPage />
 * )
 */
const CollectionAssociationFormPage = () => (
  <Page
    pageType="secondary"
    header={<CollectionAssociationFormPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback="Loading...">
        <CollectionAssociationForm />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default CollectionAssociationFormPage
