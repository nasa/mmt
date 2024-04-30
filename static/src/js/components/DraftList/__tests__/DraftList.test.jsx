import React, { Suspense } from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'

import { GraphQLError } from 'graphql'
import DraftList from '../DraftList'

import AppContext from '../../../context/AppContext'

import constructDownloadableFile from '../../../utils/constructDownloadableFile'

import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary'
import { GET_TOOL_DRAFTS } from '../../../operations/queries/getToolDrafts'

vi.mock('react-bootstrap/Placeholder', () => ({ default: vi.fn() }))

vi.mock('../../../hooks/useDraftsQuery')
vi.mock('../../../utils/constructDownloadableFile')

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useParams: vi.fn().mockImplementation(() => ({ draftType: 'tools' }))
}))

const mockDraft = {
  count: 3,
  items: [
    {
      conceptId: 'TD1200000092-MMT_2',
      revisionDate: '2023-12-08T17:56:09.385Z',
      ummMetadata: {
        Name: 'Tool TD1200000092 short name',
        LongName: 'Tool TD1200000092 long name'
      },
      name: 'Tool TD1200000092 short name',
      previewMetadata: {
        name: 'Tool TD1200000092 short name',
        longName: 'Tool TD1200000092 long name',
        __typename: 'Tool'
      },
      __typename: 'Draft'
    },
    {
      conceptId: 'TD1200000093-MMT_2',
      revisionDate: '2023-11-08T17:56:09.385Z',
      ummMetadata: {},
      previewMetadata: {
        name: null,
        longName: null,
        __typename: 'Tool'
      },
      __typename: 'Draft'
    },
    {
      conceptId: 'TD1200000094-MMT_2',
      revisionDate: '2023-10-08T17:56:09.385Z',
      ummMetadata: {
        Name: 'Tool TD1200000094 short name',
        LongName: 'Tool TD1200000094 long name'
      },
      previewMetadata: {
        name: null,
        longName: null,
        __typename: 'Tool'
      },
      __typename: 'Draft'
    }
  ],
  __typename: 'DraftList'
}

const setup = ({ overrideMocks = false }) => {
  const mocks = [{
    request: {
      query: GET_TOOL_DRAFTS,
      variables: {
        params: {
          provider: 'MMT_2',
          conceptType: 'Tool',
          limit: 20,
          offset: 0,
          sortKey: ['-revision_date']
        }
      }
    },
    result: {
      data: {
        drafts: mockDraft
      }
    }
  }]

  render(
    <AppContext.Provider value={
      {
        user: {
          providerId: 'MMT_2'
        }
      }
    }
    >
      <MockedProvider mocks={overrideMocks || mocks}>
        <BrowserRouter initialEntries="">
          <ErrorBoundary>
            <Suspense>
              <DraftList />
            </Suspense>
          </ErrorBoundary>

        </BrowserRouter>
      </MockedProvider>
    </AppContext.Provider>
  )

  return {
    user: userEvent.setup()
  }
}

describe('DraftList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when draft type Tool is given', () => {
    test('renders Tool draft list', async () => {
      setup({})

      await waitForResponse()

      const rows = screen.getAllByRole('row')

      expect(within(rows[1]).getByRole('cell', { name: 'Tool TD1200000092 short name' })).toBeInTheDocument()
      expect(within(rows[1]).getByRole('cell', { name: 'Tool TD1200000092 long name' })).toBeInTheDocument()
      expect(within(rows[1]).getByRole('cell', { name: '2023-12-08' })).toBeInTheDocument()
      expect(within(rows[1]).getByRole('button', { name: /Download JSON/ })).toBeInTheDocument()

      expect(within(rows[2]).getByRole('cell', { name: '<Blank Name>' })).toBeInTheDocument()
      expect(within(rows[2]).getByRole('cell', { name: '<Blank Long Name>' })).toBeInTheDocument()
      expect(within(rows[2]).getByRole('cell', { name: '2023-11-08' })).toBeInTheDocument()
      expect(within(rows[2]).getByRole('button', { name: /Download JSON/ })).toBeInTheDocument()

      expect(within(rows[3]).getByRole('cell', { name: 'Tool TD1200000094 short name' })).toBeInTheDocument()
      expect(within(rows[3]).getByRole('cell', { name: 'Tool TD1200000094 long name' })).toBeInTheDocument()
      expect(within(rows[3]).getByRole('cell', { name: '2023-10-08' })).toBeInTheDocument()
      expect(within(rows[3]).getByRole('button', { name: /Download JSON/ })).toBeInTheDocument()
    })
  })

  describe('when draft type Tool is given but no Tool Draft found', () => {
    test('renders Tool draft list', async () => {
      setup({
        overrideMocks: [{
          request: {
            query: GET_TOOL_DRAFTS,
            variables: {
              params: {
                provider: 'MMT_2',
                conceptType: 'Tool',
                limit: 20,
                offset: 0,
                sortKey: ['-revision_date']
              }
            }
          },
          result: {
            data: {
              drafts: {
                count: 0,
                items: [
                ],
                __typename: 'DraftList'
              }
            }
          }
        }]
      })

      await waitForResponse()

      const rows = screen.getAllByRole('row')

      expect(within(rows[1]).getByRole('cell', {
        name: 'No Tool drafts exist for the provider MMT_2'
      })).toBeInTheDocument()
    })
  })

  describe('when draft type Tool is given, error shown', () => {
    test.skip('renders Tool draft list', async () => {
      setup({
        overrideMocks: [{
          request: {
            query: GET_TOOL_DRAFTS,
            variables: {
              params: {
                provider: 'MMT_2',
                conceptType: 'Tool',
                limit: 20,
                offset: 0,
                sortKey: ['-revision_date']
              }
            }
          },
          result: {
            errors: [new GraphQLError('An error occurred')]
          }
        }]
      })

      await waitForResponse()

      expect(screen.getByText('An error occurred')).toBeInTheDocument()
    })
  })

  describe('when clicking the download json button', () => {
    test('downloads the draft', async () => {
      const { user } = setup({})
      await waitForResponse()

      const button = screen.getAllByRole('button', { name: /Download JSON/ })
      await user.click(button[0])

      expect(constructDownloadableFile).toHaveBeenCalledTimes(1)
      expect(constructDownloadableFile).toHaveBeenCalledWith(
        JSON.stringify(mockDraft.items[0].ummMetadata, null, 2),
        'TD1200000092-MMT_2'
      )
    })
  })
})
