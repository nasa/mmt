import React, { Suspense } from 'react'

import { useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'
import pluralize from 'pluralize'

import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import Page from '../../components/Page/Page'
import PageHeader from '../../components/PageHeader/PageHeader'

import ManageCollectionAssociation from '../../components/ManageCollectionAssociation/ManageCollectionAssociation'

import conceptTypeQueries from '../../constants/conceptTypeQueries'

import getConceptTypeByConceptId from '../../utils/getConceptTypeByConcept'

/**
 * Renders a ManageCollectionAssociationPageHeader component
 *
 * @component
 * @example <caption>Render a ManageCollectionAssociationPageHeader</caption>
 * return (
 *   <ManageCollectionAssociationPageHeader />
 * )
 */
const ManageCollectionAssociationPageHeader = () => {
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
            label: 'Collection Associations',
            active: true
          }
        ]
      }
      pageType="secondary"
    />
  )
}

/**
 * Renders a ManageCollectionAssociationPage component
 *
 * @component
 * @example <caption>Render a ManageCollectionAssociationPage</caption>
 * return (
 *   <ManageCollectionAssociationPage />
 * )
 */
const ManageCollectionAssociationPage = () => (
  <Page
    pageType="secondary"
    header={<ManageCollectionAssociationPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback="Loading...">
        <ManageCollectionAssociation />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default ManageCollectionAssociationPage
