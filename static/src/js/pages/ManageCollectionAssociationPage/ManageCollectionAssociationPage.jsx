import React, { Suspense } from 'react'

import { camelCase } from 'lodash-es'
import { FaPlus } from 'react-icons/fa'
import { useParams } from 'react-router'
import { useSuspenseQuery } from '@apollo/client'

import pluralize from 'pluralize'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '@/js/components/LoadingTable/LoadingTable'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'

import ManageCollectionAssociation from '@/js/components/ManageCollectionAssociation/ManageCollectionAssociation'

import conceptTypeQueries from '@/js/constants/conceptTypeQueries'

import getConceptTypeByConceptId from '@/js/utils/getConceptTypeByConceptId'
import toKebabCase from '@/js/utils/toKebabCase'
import toTitleCase from '@/js/utils/toTitleCase'

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
            label: `${pluralize(toTitleCase(derivedConceptType))}`,
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
      primaryActions={
        [{
          icon: FaPlus,
          iconTitle: 'A plus icon',
          to: `/${pluralize(toKebabCase(derivedConceptType)).toLowerCase()}/${conceptId}/collection-association-search`,
          title: 'Add Collection Associations',
          variant: 'success'
        }]
      }
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
      <Suspense fallback={<LoadingTable />}>
        <ManageCollectionAssociation />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default ManageCollectionAssociationPage
