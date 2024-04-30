import React, { Suspense } from 'react'

import { useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'

import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import MetadataForm from '../../components/MetadataForm/MetadataForm'
import Page from '../../components/Page/Page'
import PageHeader from '../../components/PageHeader/PageHeader'
import getConceptTypeByDraftConceptId from '../../utils/getConceptTypeByDraftConceptId'
import urlValueTypeToConceptTypeMap from '../../constants/urlValueToConceptTypeMap'
import conceptTypeDraftQueries from '../../constants/conceptTypeDraftQueries'

/**
 * Renders a MetadataFormPageHeader component
 *
 * @component
 * @example <caption>Render a MetadataFormPageHeader</caption>
 * return (
 *   <MetadataFormPageHeader />
 * )
 */
const MetadataFormPageHeader = () => {
  const { conceptId = 'new', draftType } = useParams()

  let derivedConceptType

  if (conceptId !== 'new') {
    derivedConceptType = getConceptTypeByDraftConceptId(conceptId)
  } else {
    derivedConceptType = urlValueTypeToConceptTypeMap[draftType]
  }

  const { data = {} } = useSuspenseQuery(conceptTypeDraftQueries[derivedConceptType], {
    skip: conceptId === 'new',
    variables: {
      params: {
        conceptId,
        conceptType: derivedConceptType
      }
    }
  })

  const { draft = {} } = data
  const { previewMetadata = {} } = draft
  let { pageTitle } = previewMetadata

  pageTitle = conceptId === 'new' ? `New ${derivedConceptType} Draft` : `Edit ${pageTitle || '<Blank Name>'}`

  return (
    <PageHeader
      title={pageTitle}
      pageType="secondary"
      breadcrumbs={
        [
          {
            label: `${derivedConceptType} Drafts`,
            to: `/drafts/${draftType}`
          },
          (
            conceptId !== 'new' && {
              label: pageTitle,
              to: `/drafts/${draftType}/${conceptId}`
            }
          ),
          {
            label: pageTitle,
            active: true
          }
        ]
      }
    />
  )
}

/**
 * Renders a MetadataFormPage component
 *
 * @component
 * @example <caption>Render a MetadataFormPage</caption>
 * return (
 *   <MetadataFormPage />
 * )
 */
const MetadataFormPage = () => (
  <Page
    pageType="secondary"
    header={<MetadataFormPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback="Loading...">
        <MetadataForm />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default MetadataFormPage
