import React from 'react'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { GET_COLLECTIONS } from '@/js/operations/queries/getCollections'

import BulkActionsSelectedConcepts from '../BulkActionsSelectedConcepts'

const columns = [
  {
    dataKey: 'shortName',
    title: 'Short Name',
    className: 'col-auto'
  },
  {
    dataKey: 'version',
    title: 'Version',
    className: 'col-auto'
  },
  {
    dataKey: 'provider',
    title: 'Provider',
    className: 'col-auto'
  }
]

const buildCollection = (index) => ({
  conceptId: `C${index}-TESTPROV`,
  shortName: `ShortName${index}`,
  version: `${index}`,
  title: `Title${index}`,
  provider: 'TESTPROV',
  entryTitle: `EntryTitle${index}`,
  revisionId: '1',
  granules: { count: 0 },
  tagDefinitions: { items: [] },
  tags: null,
  revisionDate: '2024-01-01T00:00:00.000Z'
})

const mocks = [{
  request: {
    query: GET_COLLECTIONS,
    variables: {
      params: {
        conceptId: ['C1-TESTPROV', 'C2-TESTPROV'],
        limit: 2
      }
    }
  },
  result: {
    data: {
      collections: {
        count: 2,
        items: [1, 2].map(buildCollection)
      }
    }
  }
}]

const setup = ({
  conceptIds = ['C1-TESTPROV', 'C2-TESTPROV'],
  onRemove = vi.fn(),
  queryMocks = mocks
} = {}) => {
  const user = userEvent.setup()

  render(
    <MockedProvider mocks={queryMocks}>
      <BulkActionsSelectedConcepts
        conceptIds={conceptIds}
        onRemove={onRemove}
        query={GET_COLLECTIONS}
        columns={columns}
        noSelectionMessage="No collections are selected."
        loadingMessage="Loading selected collections…"
      />
    </MockedProvider>
  )

  return {
    onRemove,
    user
  }
}

describe('BulkActionsSelectedConcepts component', () => {
  test('shows the noSelectionMessage when no concepts are selected', () => {
    setup({ conceptIds: [] })

    expect(screen.getByText('No collections are selected.')).toBeInTheDocument()
  })

  test('renders a row per selected concept, using the caller-supplied columns', async () => {
    setup()

    expect(await screen.findByText('ShortName1')).toBeInTheDocument()
    expect(screen.getByText('ShortName2')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(2)
  })

  test('calls onRemove with the conceptId when Remove is clicked', async () => {
    const { onRemove, user } = setup()

    const removeButtons = await screen.findAllByRole('button', { name: 'Remove' })
    await user.click(removeButtons[0])

    expect(onRemove).toHaveBeenCalledTimes(1)
    expect(onRemove).toHaveBeenCalledWith('C1-TESTPROV')
  })

  test('shows an error message instead of treating a failed lookup as empty', async () => {
    const errorMock = {
      request: {
        query: GET_COLLECTIONS,
        variables: {
          params: {
            conceptId: ['C1-TESTPROV', 'C2-TESTPROV'],
            limit: 2
          }
        }
      },
      error: new Error('An error occurred')
    }

    setup({ queryMocks: [errorMock] })

    expect(await screen.findByText(/An error occurred/)).toBeInTheDocument()
    expect(screen.getByText(/Try refreshing the page/)).toBeInTheDocument()
    expect(screen.queryByText('No selected items found')).not.toBeInTheDocument()
  })

  test('still shows a removable row for a selected concept missing from the query result', async () => {
    const partialMock = {
      request: {
        query: GET_COLLECTIONS,
        variables: {
          params: {
            conceptId: ['C1-TESTPROV', 'C2-TESTPROV'],
            limit: 2
          }
        }
      },
      result: {
        data: {
          collections: {
            count: 1,
            items: [buildCollection(1)]
          }
        }
      }
    }

    const { onRemove, user } = setup({ queryMocks: [partialMock] })

    expect(await screen.findByText('ShortName1')).toBeInTheDocument()
    expect(screen.getByText('Not found: C2-TESTPROV')).toBeInTheDocument()

    const removeButtons = screen.getAllByRole('button', { name: 'Remove' })
    expect(removeButtons).toHaveLength(2)

    await user.click(removeButtons[1])

    expect(onRemove).toHaveBeenCalledWith('C2-TESTPROV')
  })

  test('does not paginate when there are 25 or fewer selected concepts', async () => {
    setup()

    await screen.findByText('ShortName1')

    expect(screen.queryByRole('navigation', { name: 'Pagination Navigation' })).not.toBeInTheDocument()
  })

  describe('when there are more than 25 selected concepts', () => {
    const indices = Array.from({ length: 27 }, (_, index) => index + 1)
    const conceptIds = indices.map((index) => `C${index}-TESTPROV`)

    const paginatedMocks = [
      {
        request: {
          query: GET_COLLECTIONS,
          variables: {
            params: {
              conceptId: conceptIds.slice(0, 25),
              limit: 25
            }
          }
        },
        result: {
          data: {
            collections: {
              count: 25,
              items: indices.slice(0, 25).map(buildCollection)
            }
          }
        }
      },
      {
        request: {
          query: GET_COLLECTIONS,
          variables: {
            params: {
              conceptId: conceptIds.slice(25),
              limit: 2
            }
          }
        },
        result: {
          data: {
            collections: {
              count: 2,
              items: indices.slice(25).map(buildCollection)
            }
          }
        }
      }
    ]

    test('shows 25 per page and pages to the rest', async () => {
      const { user } = setup({
        conceptIds,
        queryMocks: paginatedMocks
      })

      expect(await screen.findByText('ShortName1')).toBeInTheDocument()
      expect(screen.getByText('ShortName25')).toBeInTheDocument()
      expect(screen.queryByText('ShortName26')).not.toBeInTheDocument()
      expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(25)

      await user.click(screen.getByRole('button', { name: 'Goto Next Page' }))

      expect(await screen.findByText('ShortName26')).toBeInTheDocument()
      expect(screen.getByText('ShortName27')).toBeInTheDocument()
      expect(screen.queryByText('ShortName1')).not.toBeInTheDocument()
    })
  })
})
