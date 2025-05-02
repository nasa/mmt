import React, { Suspense } from 'react'

import { useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'
import { camelCase, capitalize, trimEnd } from 'lodash-es'

import pluralize from 'pluralize'

import CollectionAssociationForm from '@/js/components/CollectionAssociationForm/CollectionAssociationForm'
import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'

import conceptIdTypes from '@/js/constants/conceptIdTypes'
import conceptTypeQueries from '@/js/constants/conceptTypeQueries'

import getConceptTypeByConceptId from '@/js/utils/getConceptTypeByConceptId'
import toKebabCase from '@/js/utils/toKebabCase'
import toTitleCase from '@/js/utils/toTitleCase'

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
  const { conceptId, type } = useParams()

  const formattedType = capitalize(trimEnd(type, 's'))

  const { data } = useSuspenseQuery(conceptTypeQueries[formattedType], {
    variables: {
      params: {
        conceptId
      }
    }
  })

  const { [camelCase(formattedType)]: concept } = data

  const { name } = concept

  return (
    <PageHeader
      title={`${name} Collection Associations`}
      breadcrumbs={
        [
          {
            label: `${pluralize(toTitleCase(formattedType))}`,
            to: `/${pluralize(toKebabCase(formattedType)).toLowerCase()}`
          },
          {
            label: name,
            to: `/${pluralize(toKebabCase(formattedType)).toLowerCase()}/${conceptId}`
          },
          formattedType !== conceptIdTypes.O
            ? {
              label: 'Collection Associations',
              to: `/${pluralize(toKebabCase(formattedType)).toLowerCase()}/${conceptId}/collection-association`
            } : {},
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
