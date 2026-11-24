import React from 'react'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'

import AppContext from '@/js/context/AppContext'
import CollectionSelectionContextProvider from '@/js/providers/CollectionSelectionContextProvider/CollectionSelectionContextProvider'
import useCollectionSelectionContext from '@/js/hooks/useCollectionSelectionContext'
import useAvailableProviders from '@/js/hooks/useAvailableProviders'

import {
  GET_BULK_UPDATE_COLLECTION_TASK
} from '@/js/operations/queries/getBulkUpdateCollectionTask'
import {
  GET_BULK_UPDATE_COLLECTION_TASKS
} from '@/js/operations/queries/getBulkUpdateCollectionTasks'

import downloadBulkUpdateTaskCsv from '@/js/utils/downloadBulkUpdateTaskCsv'

import BulkActionsLandingPage from '../BulkActionsLandingPage'

vi.mock('@/js/hooks/useAvailableProviders')
vi.mock('@/js/utils/downloadBulkUpdateTaskCsv')

useAvailableProviders.mockReturnValue({ providerIds: ['MMT_1', 'MMT_2'] })

// Pre-selects collections by rendering a button that calls the real context's
// toggleCollectionSelection, mirroring the pattern used by CollectionSelectionBar's tests.
const PreSelectCollections = () => {
  const { toggleCollectionSelection } = useCollectionSelectionContext()

  return (
    <button
      type="button"
      onClick={
        () => {
          toggleCollectionSelection('C1-TESTPROV', 'TESTPROV')
          toggleCollectionSelection('C2-TESTPROV', 'TESTPROV')
        }
      }
    >
      Select collections
    </button>
  )
}

const buildTaskSummary = (index, overrides = {}) => ({
  taskId: `BU-${1000 + index}`,
  name: null,
  createdAt: `2024-01-0${index}T00:00:00.000Z`,
  status: 'COMPLETE',
  statusMessage: null,
  requestJsonBody: {
    'concept-ids': ['C1-MMT_2', 'C2-MMT_2']
  },
  ...overrides
})

const buildTasksMock = (providerId, items) => ({
  request: {
    query: GET_BULK_UPDATE_COLLECTION_TASKS,
    variables: {
      params: { providerId }
    }
  },
  result: {
    data: {
      bulkUpdateCollectionTasks: { items }
    }
  }
})

const setup = ({
  mocks = [],
  providerId = 'MMT_2',
  setProviderId = vi.fn(),
  initialEntry = '/collections/bulk-actions'
} = {}) => {
  const user = userEvent.setup()

  render(
    <AppContext.Provider value={
      {
        providerId,
        setProviderId
      }
    }
    >
      <MockedProvider mocks={mocks}>
        <CollectionSelectionContextProvider>
          <PreSelectCollections />
          <MemoryRouter initialEntries={[initialEntry]}>
            <Routes>
              <Route path="/:type/bulk-actions" element={<BulkActionsLandingPage />} />
              <Route path="/:type/bulk-actions/edit" element={<div>Bulk actions edit page</div>} />
              <Route path="/:type/bulk-actions/:taskId" element={<div>Bulk actions task page</div>} />
            </Routes>
          </MemoryRouter>
        </CollectionSelectionContextProvider>
      </MockedProvider>
    </AppContext.Provider>
  )

  return {
    user,
    setProviderId
  }
}

describe('BulkActionsLandingPage component', () => {
  test('renders the page title and subtext', () => {
    setup({ mocks: [buildTasksMock('MMT_2', [])] })

    expect(screen.getByRole('heading', { name: 'Bulk Actions History' })).toBeInTheDocument()
    expect(screen.getByText('View past bulk updates and monitor pending jobs.')).toBeInTheDocument()
  })

  describe('when no collections are selected', () => {
    test('does not show a selection banner', () => {
      setup({ mocks: [buildTasksMock('MMT_2', [])] })

      expect(screen.queryByText(/selected from/)).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Continue to Configure Bulk Update' })).not.toBeInTheDocument()
    })
  })

  describe('when collections are already selected', () => {
    test('shows the selection and a way to continue to the edit page', async () => {
      const { user } = setup({ mocks: [buildTasksMock('MMT_2', [])] })

      await user.click(screen.getByRole('button', { name: 'Select collections' }))

      expect(screen.getByText('2 collections selected from TESTPROV.')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Continue to Configure Bulk Update' }))

      expect(await screen.findByText('Bulk actions edit page')).toBeInTheDocument()
    })
  })

  describe('provider selector', () => {
    test('offers every available provider and calls setProviderId when changed', async () => {
      const { user, setProviderId } = setup({ mocks: [buildTasksMock('MMT_2', [])] })

      const select = screen.getByRole('combobox', { name: 'Select Provider Context' })

      expect(select).toHaveValue('MMT_2')

      await user.selectOptions(select, 'MMT_1')

      expect(setProviderId).toHaveBeenCalledWith('MMT_1')
    })
  })

  describe('Job History', () => {
    test('shows a loading spinner, then the provider-scoped header once loaded', async () => {
      setup({ mocks: [buildTasksMock('MMT_2', [])] })

      expect(screen.getByText(/Loading job history/)).toBeInTheDocument()
      expect(await screen.findByText('Job History: MMT_2')).toBeInTheDocument()
    })

    test('shows an error message instead of treating a failed lookup as empty', async () => {
      const errorMock = {
        request: {
          query: GET_BULK_UPDATE_COLLECTION_TASKS,
          variables: {
            params: { providerId: 'MMT_2' }
          }
        },
        error: new Error('An error occurred')
      }

      setup({ mocks: [errorMock] })

      expect(await screen.findByText(/An error occurred/)).toBeInTheDocument()
      expect(screen.getByText(/Try refreshing the page/)).toBeInTheDocument()
    })

    test('shows an empty-state message when the provider has no jobs', async () => {
      setup({ mocks: [buildTasksMock('MMT_2', [])] })

      expect(await screen.findByText('No bulk update jobs found for this provider.')).toBeInTheDocument()
    })

    test('renders every job, newest first, with its status and total collections', async () => {
      const mocks = [
        buildTasksMock('MMT_2', [
          buildTaskSummary(1, {
            createdAt: '2024-01-01T00:00:00.000Z',
            status: 'COMPLETE'
          }),
          buildTaskSummary(2, {
            createdAt: '2024-01-03T00:00:00.000Z',
            status: 'IN_PROGRESS'
          })
        ])
      ]

      setup({ mocks })

      const jobIdCells = await screen.findAllByRole('link', { name: /BU-100/ })

      // BU-1002 (Jan 3) was created after BU-1001 (Jan 1), so it sorts first.
      expect(jobIdCells[0]).toHaveTextContent('BU-1002')
      expect(jobIdCells[1]).toHaveTextContent('BU-1001')
      expect(jobIdCells[0]).toHaveAttribute('href', '/collections/bulk-actions/BU-1002?providerId=MMT_2')

      expect(screen.getByText('COMPLETE')).toBeInTheDocument()
      expect(screen.getByText('IN_PROGRESS')).toBeInTheDocument()

      // Both mocked tasks' requestJsonBody has 2 concept-ids.
      expect(screen.getAllByText('2')).toHaveLength(2)
    })

    test('shows "All" for the ["ALL"] conceptIds sentinel and an em dash for a malformed body', async () => {
      const mocks = [
        buildTasksMock('MMT_2', [
          buildTaskSummary(1, { requestJsonBody: { 'concept-ids': ['ALL'] } }),
          buildTaskSummary(2, { requestJsonBody: {} })
        ])
      ]

      setup({ mocks })

      expect(await screen.findByText('All')).toBeInTheDocument()
      expect(screen.getByText('—')).toBeInTheDocument()
    })

    describe('when there are more than 25 jobs', () => {
      test('shows 25 per page and pages to the rest', async () => {
        const indices = Array.from({ length: 27 }, (_, index) => index + 1)
        const items = indices.map((index) => buildTaskSummary(index, {
          createdAt: `2024-01-${String(index).padStart(2, '0')}T00:00:00.000Z`
        }))

        setup({ mocks: [buildTasksMock('MMT_2', items)] })

        // Newest-first: BU-1027 (Jan 27) is page 1's first row, BU-1003 its last (27 - 24).
        expect(await screen.findByRole('link', { name: 'BU-1027' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'BU-1003' })).toBeInTheDocument()
        expect(screen.queryByRole('link', { name: 'BU-1002' })).not.toBeInTheDocument()

        const user = userEvent.setup()
        await user.click(screen.getByRole('button', { name: 'Goto Next Page' }))

        expect(await screen.findByRole('link', { name: 'BU-1002' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'BU-1001' })).toBeInTheDocument()
        expect(screen.queryByRole('link', { name: 'BU-1027' })).not.toBeInTheDocument()
      })
    })

    describe('CSV Report', () => {
      test('lazily fetches the task detail, then downloads the CSV', async () => {
        const taskDetailMock = {
          request: {
            query: GET_BULK_UPDATE_COLLECTION_TASK,
            variables: {
              params: {
                providerId: 'MMT_2',
                taskId: 'BU-1001'
              }
            }
          },
          result: {
            data: {
              bulkUpdateCollectionTask: {
                taskId: 'BU-1001',
                name: null,
                createdAt: '2024-01-01T00:00:00.000Z',
                status: 'COMPLETE',
                statusMessage: null,
                requestJsonBody: {},
                collectionStatuses: []
              }
            }
          }
        }

        const mocks = [
          buildTasksMock('MMT_2', [buildTaskSummary(1)]),
          taskDetailMock
        ]

        const { user } = setup({ mocks })

        const csvButton = await screen.findByRole('button', { name: 'CSV Report' })
        await user.click(csvButton)

        await screen.findByRole('button', { name: 'CSV Report' })

        expect(downloadBulkUpdateTaskCsv).toHaveBeenCalledTimes(1)

        const [{ task }] = downloadBulkUpdateTaskCsv.mock.calls[0]

        expect(task.taskId).toBe('BU-1001')
      })
    })
  })
})
