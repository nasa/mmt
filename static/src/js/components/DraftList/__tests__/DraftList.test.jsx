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
import { GET_VISUALIZATION_DRAFTS } from '@/js/operations/queries/getVisualizationDrafts'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'

import {
  mockCollectionDrafts,
  mockToolDrafts,
  mockVisualizationDrafts
} from './__mocks__/DraftListMocks'

import DraftList from '../DraftList'

vi.mock('react-bootstrap/Placeholder', () => ({ default: vi.fn() }))
vi.mock('@/js/hooks/useDraftsQuery')
vi.mock('@/js/utils/constructDownloadableFile')

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useParams: vi.fn().mockImplementation(() => ({ draftType: 'tools' }))
}))

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

  const user = userEvent.setup()

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
    user
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

      const rows = await screen.findAllByRole('row')

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

      const rows = await screen.findAllByRole('row')

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

      const rows = await screen.findAllByRole('row')

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

      expect(await screen.findByText('An error occurred')).toBeInTheDocument()
    })
  })

  describe('when clicking the download json button', () => {
    test('downloads the draft', async () => {
      const { user } = setup({})

      const button = await screen.findAllByRole('button', { name: /Download JSON/ })
      await user.click(button[0])

      expect(constructDownloadableFile).toHaveBeenCalledTimes(1)
      expect(constructDownloadableFile).toHaveBeenCalledWith(
        JSON.stringify(mockToolDrafts.items[0].ummMetadata, null, 2),
        'TD1200000092-MMT_2'
      )
    })
  })

  describe('when draft type Visualization is given', () => {
    test('renders Visualization draft list', async () => {
      useParams.mockImplementation(() => ({ draftType: 'visualizations' }))

      setup({
        overrideMocks: [{
          request: {
            query: GET_VISUALIZATION_DRAFTS,
            variables: {
              params: {
                conceptType: 'Visualization',
                limit: 20,
                offset: 0,
                sortKey: ['-revision_date']
              }
            }
          },
          result: {
            data: {
              drafts: mockVisualizationDrafts
            }
          }
        }]
      })

      const rows = await screen.findAllByRole('row')

      expect(within(rows[1]).getByRole('cell', { name: 'Short Name 1' })).toBeInTheDocument()
      expect(within(rows[1]).getByRole('cell', { name: 'Friday, April 25, 2025 5:26 PM' })).toBeInTheDocument()
      expect(within(rows[1]).getByRole('cell', { name: 'MMT_1' })).toBeInTheDocument()
      expect(within(rows[1]).getByRole('button', { name: /Download JSON/ })).toBeInTheDocument()
    })
  })
})
