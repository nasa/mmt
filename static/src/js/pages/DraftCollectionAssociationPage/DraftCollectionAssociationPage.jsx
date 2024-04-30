import React, { Suspense } from 'react'

import { useParams } from 'react-router'
import { useSuspenseQuery } from '@apollo/client'
import pluralize from 'pluralize'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '../../components/LoadingTable/LoadingTable'
import DraftCollectionAssociation from '../../components/DraftCollectionAssociation/DraftCollectionAssociation'
import Page from '../../components/Page/Page'
import PageHeader from '../../components/PageHeader/PageHeader'

import getConceptTypeByDraftConceptId from '../../utils/getConceptTypeByDraftConceptId'

import conceptTypeDraftQueries from '../../constants/conceptTypeDraftQueries'

/**
 * Renders a OrderOptionPageHeader component
 *
 * @component
 * @example <caption>Render a OrderOptionPageHeader</caption>
 * return (
 *   <OrderOptionPageHeader />
 * )
 */
const DraftCollectionAssociationPageHeader = () => {
  const { conceptId } = useParams()

  const derivedConceptType = getConceptTypeByDraftConceptId(conceptId)

  const { data } = useSuspenseQuery(conceptTypeDraftQueries[derivedConceptType], {
    variables: {
      params: {
        conceptId,
        conceptType: derivedConceptType
      }
    }
  })

  const { draft } = data
  const { previewMetadata = {} } = draft

  // Can't use default value for this because its `null` in the response
  const { pageTitle } = previewMetadata

  return (
    <PageHeader
      title={`${pageTitle || '<Blank Name>'} Collection Associations`}
      pageType="secondary"
      breadcrumbs={
        [
          {
            label: `${derivedConceptType} Drafts`,
            to: `/drafts/${derivedConceptType.toLowerCase()}s`
          },
          {
            label: pageTitle || '<Blank Name>',
            to: `/drafts/${pluralize(derivedConceptType).toLowerCase()}/${conceptId}`
          },
          {
            label: 'Collection Associations',
            active: true
          }
        ]
      }
    />
  )
}

/**
 * Renders a DraftCollectionAssociationPage component
 *a
 * @component
 * @example <caption>Render a DraftCollectionAssociationPage</caption>
 * return (
 *   <DraftCollectionAssociationPage />
 * )
 */
const DraftCollectionAssociationPage = () => (
  <Page
    pageType="secondary"
    header={<DraftCollectionAssociationPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback={<LoadingTable />}>
        <DraftCollectionAssociation />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default DraftCollectionAssociationPage
