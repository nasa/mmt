import React from 'react'
import PropTypes from 'prop-types'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import { GET_COLLECTION_REVISIONS } from '../../operations/queries/getCollectionRevisions'
import { GET_TOOLS } from '../../operations/queries/getTools'
import useRevisionsQuery from '../useRevisionsQuery'

const TestComponent = ({ type }) => {
  const { revisions, loading, error } = useRevisionsQuery({
    type: type || 'Collections',
    conceptId: 'C1000-MMT_2',
    limit: 3,
    offset: 0
  })
  const { items = [], count } = revisions

  return (
    <div>
      {
        loading && (
          <span>Loading</span>
        )
      }
      {
        error && (
          <span>Errored</span>
        )
      }
      {
        count && (
          <span>
            Count:
            {' '}
            {count}
          </span>
        )
      }
      {
        items.length > 0 && (
          <ul>
            {
              items.map((item) => (
                console.log(item)
              ))
              // items.map(({ conceptId }) => (
              //   <li key={conceptId}>{conceptId}</li>
              // ))
            }
          </ul>
        )
      }
    </div>
  )
}

TestComponent.defaultProps = {
  type: ''
}

TestComponent.propTypes = {
  type: PropTypes.string
}
