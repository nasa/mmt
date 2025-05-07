import React, { Suspense } from 'react'

import pluralize from 'pluralize'

import { useParams } from 'react-router'
import { useSuspenseQuery } from '@apollo/client'

import commafy from 'commafy'
import conceptTypeQueries from '../../constants/conceptTypeQueries'

import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '../../components/LoadingTable/LoadingTable'
import Page from '../../components/Page/Page'
import PageHeader from '../../components/PageHeader/PageHeader'
import RevisionList from '../../components/RevisionList/RevisionList'

import getConceptTypeByConceptId from '../../utils/getConceptTypeByConceptId'

/**
 * Renders a `RevisionListPageHeader` component
 *
 * @component
 * @example <caption>Renders a `RevisionListPageHeader` component</caption>
 * return (
 *   <RevisionListPageHeader />
 * )
 */
const RevisionListPageHeader = () => {
  const { conceptId } = useParams()

  const derivedConceptType = getConceptTypeByConceptId(conceptId)

  const { data } = useSuspenseQuery(conceptTypeQueries[derivedConceptType], {
    variables: {
      params: {
        conceptId
      }
    }
  })

  const { [derivedConceptType.toLowerCase()]: concept } = data
  const { pageTitle, revisions } = concept
  const { count } = revisions

  const revisionsPageTitle = `${commafy(count)} ${derivedConceptType} ${pluralize('Revisions', count)}`

  return (
    <PageHeader
      title={revisionsPageTitle}
      pageType="secondary"
      breadcrumbs={
        [
          {
            label: `${pluralize(derivedConceptType)}`,
            to: `/${pluralize(derivedConceptType).toLowerCase()}`
          },
          {
            label: pageTitle,
            to: `/${pluralize(derivedConceptType).toLowerCase()}/${conceptId}`
          },
          {
            label: 'Revision History',
            active: true
          }
        ]
      }
    />
  )
}

/**
 * Renders a `RevisionListPlaceholder` component
 *
 * @component
 * @example <caption>Renders a `RevisionListPlaceholder` component</caption>
 * return (
 *   <RevisionListPlaceholder />
 * )
 */
const RevisionListPlaceholder = () => (
  <LoadingTable />
)

/**
 * Renders a `RevisionListPage` component
 *
 * @component
 * @example <caption>Renders a `RevisionListPage` component</caption>
 * return (
 *   <RevisionListPage />
 * )
 */
const RevisionListPage = () => (
  <Page
    pageType="secondary"
    header={<RevisionListPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback={<RevisionListPlaceholder />}>
        <RevisionList />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default RevisionListPage
