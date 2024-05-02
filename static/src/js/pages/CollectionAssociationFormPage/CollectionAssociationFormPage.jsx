import React, { Suspense } from 'react'

import { useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'
import { camelCase } from 'lodash-es'

import pluralize from 'pluralize'

import CollectionAssociationForm from '../../components/CollectionAssociationForm/CollectionAssociationForm'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import Page from '../../components/Page/Page'
import PageHeader from '../../components/PageHeader/PageHeader'

import conceptTypeQueries from '../../constants/conceptTypeQueries'

import getConceptTypeByConceptId from '../../utils/getConceptTypeByConceptId'
import toKebabCase from '../../utils/toKebabCase'

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

  const { [camelCase(derivedConceptType)]: concept } = data

  const { name } = concept

  return (
    <PageHeader
      title={`${name} Collection Associations`}
      breadcrumbs={
        [
          {
            label: derivedConceptType,
            to: `/drafts/${toKebabCase(derivedConceptType).toLowerCase()}`
          },
          {
            label: name,
            to: `/${pluralize(toKebabCase(derivedConceptType)).toLowerCase()}/${conceptId}`
          },
          {
            label: 'Collection Association',
            to: `/${pluralize(toKebabCase(derivedConceptType)).toLowerCase()}/${conceptId}/collection-association`
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
