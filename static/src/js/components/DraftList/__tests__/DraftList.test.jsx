import React, { Suspense } from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import { BrowserRouter, useParams } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'
import { GraphQLError } from 'graphql'

import constructDownloadableFile from '@/js/utils/constructDownloadableFile'

import { GET_TOOL_DRAFTS } from '@/js/operations/queries/getToolDrafts'
import { GET_COLLECTION_DRAFTS } from '@/js/operations/queries/getCollectionDrafts'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'

import DraftList from '../DraftList'

vi.mock('react-bootstrap/Placeholder', () => ({ default: vi.fn() }))
vi.mock('@/js/hooks/useDraftsQuery')
vi.mock('@/js/utils/constructDownloadableFile')

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useParams: vi.fn().mockImplementation(() => ({ draftType: 'tools' }))
}))

const mockToolDrafts = {
  count: 3,
  items: [
    {
      conceptId: 'TD1200000092-MMT_2',
      revisionDate: '2023-12-08T17:56:09.385Z',
      revisionId: '1',
      ummMetadata: {
        Name: 'Tool TD1200000092 short name',
        LongName: 'Tool TD1200000092 long name'
      },
      name: 'Tool TD1200000092 short name',
      previewMetadata: {
        conceptId: 'TD1200000092-MMT_2',
        revisionId: '1',
        name: 'Tool TD1200000092 short name',
        longName: 'Tool TD1200000092 long name',
        __typename: 'Tool'
      },
      providerId: 'MMT_2',
      __typename: 'Draft'
    },
    {
      conceptId: 'TD1200000093-MMT_2',
      revisionDate: '2023-11-08T17:56:09.385Z',
      revisionId: '1',
      ummMetadata: {},
      previewMetadata: {
        conceptId: 'TD1200000093-MMT_2',
        revisionId: '1',
        name: null,
        longName: null,
        __typename: 'Tool'
      },
      providerId: 'MMT_2',
      __typename: 'Draft'
    },
    {
      conceptId: 'TD1200000094-MMT_2',
      revisionDate: '2023-10-08T17:56:09.385Z',
      revisionId: '1',
      ummMetadata: {
        Name: 'Tool TD1200000094 short name',
        LongName: 'Tool TD1200000094 long name'
      },
      previewMetadata: {
        conceptId: 'TD1200000094-MMT_2',
        revisionId: '1',
        name: null,
        longName: null,
        __typename: 'Tool'
      },
      providerId: 'MMT_2',
      __typename: 'Draft'
    }
  ],
  __typename: 'DraftList'
}

const mockCollectionDrafts = {
  count: 3,
  items: [
    {
      conceptId: 'CD1200000092-MMT_2',
      revisionDate: '2023-12-08T17:56:09.385Z',
      revisionId: '1',
      ummMetadata: {
        ShortName: 'Collection CD1200000092 short name',
        EntryTitle: 'Collection CD1200000092 entry title'
      },
      shortName: 'Collection CD1200000092 short name',
      previewMetadata: {
        conceptId: 'CD1200000092-MMT_2',
        revisionId: '1',
        shortName: 'Collection CD1200000092 short name',
        entryTitle: 'Collection CD1200000092 entry title',
        __typename: 'Collection'
      },
      providerId: 'MMT_2',
      __typename: 'Draft'
    },
    {
      conceptId: 'CD1200000093-MMT_2',
      revisionDate: '2023-11-08T17:56:09.385Z',
      revisionId: '1',
      ummMetadata: {},
      previewMetadata: {
        conceptId: 'CD1200000093-MMT_2',
        revisionId: '1',
        shortName: null,
        entryTitle: null,
        __typename: 'Collection'
      },
      providerId: 'MMT_2',
      __typename: 'Draft'
    },
    {
      conceptId: 'CD1200000094-MMT_2',
      revisionDate: '2023-10-08T17:56:09.385Z',
      revisionId: '1',
      ummMetadata: {
        ShortName: 'Collection CD1200000094 short name',
        EntryTitle: 'Collection CD1200000094 entry title'
      },
      previewMetadata: {
        conceptId: 'CD1200000094-MMT_2',
        revisionId: '1',
        shortName: null,
        entryTitle: null,
        __typename: 'Collection'
      },
      providerId: 'MMT_2',
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
          conceptType: 'Tool',
          limit: 20,
          offset: 0,
          sortKey: ['-revision_date']
        }
      }
    },
    result: {
      data: {
        drafts: mockToolDrafts
      }
    }
  }]

  render(
    <MockedProvider mocks={overrideMocks || mocks}>
      <BrowserRouter initialEntries="">
        <ErrorBoundary>
          <Suspense>
            <DraftList />
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </MockedProvider>
  )

  return {
    user: userEvent.setup()
  }
}

describe('DraftList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when draft type Collection is given', () => {
    test('renders Collection draft list', async () => {
      useParams.mockImplementation(() => ({ draftType: 'collections' }))

      setup({
        overrideMocks: [{
          request: {
            query: GET_COLLECTION_DRAFTS,
            variables: {
              params: {
                conceptType: 'Collection',
                limit: 20,
                offset: 0,
                sortKey: ['-revision_date']
              }
            }
          },
          result: {
            data: {
              drafts: mockCollectionDrafts
            }
          }
        }]
      })

      await waitForResponse()

      const rows = screen.getAllByRole('row')

      expect(within(rows[1]).getByRole('cell', { name: 'Collection CD1200000092 short name' })).toBeInTheDocument()
      expect(within(rows[1]).getByRole('cell', { name: 'Collection CD1200000092 entry title' })).toBeInTheDocument()
      expect(within(rows[1]).getByRole('cell', { name: 'Friday, December 8, 2023 5:56 PM' })).toBeInTheDocument()
      expect(within(rows[1]).getByRole('button', { name: /Download JSON/ })).toBeInTheDocument()

      expect(within(rows[2]).getByRole('cell', { name: '<Blank Short Name>' })).toBeInTheDocument()
      expect(within(rows[2]).getByRole('cell', { name: '<Blank Entry Title>' })).toBeInTheDocument()
      expect(within(rows[2]).getByRole('cell', { name: 'Wednesday, November 8, 2023 5:56 PM' })).toBeInTheDocument()
      expect(within(rows[2]).getByRole('button', { name: /Download JSON/ })).toBeInTheDocument()

      expect(within(rows[3]).getByRole('cell', { name: 'Collection CD1200000094 short name' })).toBeInTheDocument()
      expect(within(rows[3]).getByRole('cell', { name: 'Collection CD1200000094 entry title' })).toBeInTheDocument()
      expect(within(rows[3]).getByRole('cell', { name: 'Sunday, October 8, 2023 5:56 PM' })).toBeInTheDocument()
      expect(within(rows[3]).getByRole('button', { name: /Download JSON/ })).toBeInTheDocument()
    })
  })

  describe('when draft type Tool is given', () => {
    test('renders Tool draft list', async () => {
      useParams.mockImplementation(() => ({ draftType: 'tools' }))

      setup({})

      await waitForResponse()

      const rows = screen.getAllByRole('row')

      expect(within(rows[1]).getByRole('cell', { name: 'Tool TD1200000092 short name' })).toBeInTheDocument()
      expect(within(rows[1]).getByRole('cell', { name: 'Tool TD1200000092 long name' })).toBeInTheDocument()
      expect(within(rows[1]).getByRole('cell', { name: 'Friday, December 8, 2023 5:56 PM' })).toBeInTheDocument()
      expect(within(rows[1]).getByRole('button', { name: /Download JSON/ })).toBeInTheDocument()

      expect(within(rows[2]).getByRole('cell', { name: '<Blank Name>' })).toBeInTheDocument()
      expect(within(rows[2]).getByRole('cell', { name: '<Blank Long Name>' })).toBeInTheDocument()
      expect(within(rows[2]).getByRole('cell', { name: 'Wednesday, November 8, 2023 5:56 PM' })).toBeInTheDocument()
      expect(within(rows[2]).getByRole('button', { name: /Download JSON/ })).toBeInTheDocument()

      expect(within(rows[3]).getByRole('cell', { name: 'Tool TD1200000094 short name' })).toBeInTheDocument()
      expect(within(rows[3]).getByRole('cell', { name: 'Tool TD1200000094 long name' })).toBeInTheDocument()
      expect(within(rows[3]).getByRole('cell', { name: 'Sunday, October 8, 2023 5:56 PM' })).toBeInTheDocument()
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
        name: 'No Tool drafts exist'
      })).toBeInTheDocument()
    })
  })

  describe('when draft type Tool is given, error shown', () => {
    test('renders Tool draft list', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {})

      setup({
        overrideMocks: [{
          request: {
            query: GET_TOOL_DRAFTS,
            variables: {
              params: {
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
        JSON.stringify(mockToolDrafts.items[0].ummMetadata, null, 2),
        'TD1200000092-MMT_2'
      )
    })
  })
})
