import React, { Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { capitalize } from 'lodash-es'

import Page from '../../components/Page/Page'
import getHumanizedNameFromTypeParam from '../../utils/getHumanizedNameFromTypeParam'
import PageHeader from '../../components/PageHeader/PageHeader'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import SearchList from '../SearchList/SearchList'

/**
 * Renders a SearchPageHeader component
 *
 * @component
 * @example <caption>Render a SearchPageHeader</caption>
 * return (
 *   <SearchPageHeader />
 * )
 */
const SearchPageHeader = () => {
  const { type: conceptType } = useParams()

  return (
    <PageHeader
      title="Search Results"
      pageType="secondary"
      breadcrumbs={
        [
          {
            label: `${capitalize(getHumanizedNameFromTypeParam(conceptType))}s`,
            active: true
          }
        ]
      }
    />
  )
}

/**
 * Renders a `SearchPage` component
 *
 * @component
 * @example <caption>Renders a `SearchPage` component</caption>
 * return (
 *   <SearchPage />
 * )
 */
const SearchPage = () => (
  <Page
    pageType="secondary"
    header={<SearchPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback="Loading...">
        <SearchList />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default SearchPage
