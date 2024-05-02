import React, { Suspense } from 'react'

import { useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'
import { camelCase } from 'lodash-es'

import pluralize from 'pluralize'

import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import Page from '../../components/Page/Page'
import PageHeader from '../../components/PageHeader/PageHeader'

import ManageCollectionAssociation from '../../components/ManageCollectionAssociation/ManageCollectionAssociation'

import conceptTypeQueries from '../../constants/conceptTypeQueries'

import getConceptTypeByConceptId from '../../utils/getConceptTypeByConceptId'
import toKebabCase from '../../utils/toKebabCase'

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

  const { [camelCase(derivedConceptType)]: concept } = data

  const { pageTitle } = concept

  return (
    <PageHeader
      title={`${pageTitle} Collection Associations`}
      breadcrumbs={
        [
          {
            label: `${pluralize(derivedConceptType)}`,
            to: `/${pluralize(toKebabCase(derivedConceptType)).toLowerCase()}`
          },
          {
            label: pageTitle,
            to: `/${pluralize(toKebabCase(derivedConceptType)).toLowerCase()}/${conceptId}`
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
