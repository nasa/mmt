import React from 'react'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation
} from 'react-router'

import AppContext from '@/js/context/AppContext'

import {
  GET_BULK_UPDATE_COLLECTION_TASK
} from '@/js/operations/queries/getBulkUpdateCollectionTask'

import BulkActionsTaskCollectionDetails from '@/js/components/BulkActionsTaskCollectionDetails/BulkActionsTaskCollectionDetails'
import downloadBulkUpdateTaskCsv from '@/js/utils/downloadBulkUpdateTaskCsv'

import BulkActionsTaskPage from '../BulkActionsTaskPage'

vi.mock('@/js/components/BulkActionsTaskCollectionDetails/BulkActionsTaskCollectionDetails')
vi.mock('@/js/utils/downloadBulkUpdateTaskCsv')

BulkActionsTaskCollectionDetails.mockReturnValue(<div>Collection details stub</div>)

const buildTaskMock = ({
  providerId = 'MMT_2',
  taskId = 'BU-1005',
  status = 'COMPLETE',
  statusMessage = null,
  requestJsonBody = {
    'provider-id': providerId,
    'concept-ids': ['C1-MMT_2', 'C2-MMT_2'],
    'update-field': 'SCIENCE_KEYWORDS',
    'update-type': 'FIND_AND_REPLACE',
    'find-value': { Category: 'EARTH SCIENCE' },
    'update-value': { Category: 'EARTH SCIENCE 2' }
  },
  collectionStatuses = [
    {
      conceptId: 'C1-MMT_2',
      status: 'UPDATED',
      statusMessage: null
    },
    {
      conceptId: 'C2-MMT_2',
      status: 'UPDATED',
      statusMessage: null
    }
  ]
} = {}) => ({
  request: {
    query: GET_BULK_UPDATE_COLLECTION_TASK,
    variables: {
      params: {
        providerId,
        taskId
      }
    }
  },
  result: {
    data: {
      bulkUpdateCollectionTask: {
        taskId,
        name: null,
        createdAt: '2024-01-01T00:00:00.000Z',
        status,
        statusMessage,
        requestJsonBody,
        collectionStatuses
      }
    }
  }
})

// Reads location.state back out as text, so a navigate() call's retry payload can be
// asserted on without mocking useNavigate.
const EditPageStub = () => {
  const location = useLocation()

  return <div>{`Bulk actions edit page: ${JSON.stringify(location.state)}`}</div>
}

const setup = ({
  mocks = [buildTaskMock()],
  initialEntry = '/collections/bulk-actions/BU-1005?providerId=MMT_2',
  appContextProviderId
} = {}) => {
  const user = userEvent.setup()

  render(
    <AppContext.Provider value={{ providerId: appContextProviderId }}>
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route path="/:type/bulk-actions/:taskId" element={<BulkActionsTaskPage />} />
            <Route path="/:type/bulk-actions/edit" element={<EditPageStub />} />
            <Route path="/:type/bulk-actions" element={<div>Bulk actions landing page</div>} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    </AppContext.Provider>
  )

  return { user }
}

describe('BulkActionsTaskPage component', () => {
  test('renders the task id in the title', async () => {
    setup()

    expect(await screen.findByRole('heading', { name: 'Job Status: BU-1005' })).toBeInTheDocument()
  })

  test('links Back to All Jobs with the providerId preserved', async () => {
    setup()

    await screen.findByRole('heading', { name: 'Job Status: BU-1005' })

    expect(screen.getByRole('link', { name: 'Back to All Jobs' }))
      .toHaveAttribute('href', '/collections/bulk-actions?providerId=MMT_2')
  })

  describe('when providerId is missing from the URL', () => {
    test('falls back to the app context provider and still loads the task', async () => {
      setup({
        initialEntry: '/collections/bulk-actions/BU-1005',
        appContextProviderId: 'MMT_2'
      })

      expect(await screen.findByRole('heading', { name: 'Job Status: BU-1005' })).toBeInTheDocument()
    })

    test('shows an error when there is also no app context provider to fall back to', () => {
      setup({
        initialEntry: '/collections/bulk-actions/BU-1005',
        appContextProviderId: undefined,
        mocks: []
      })

      expect(screen.getByText(/A provider is required to look up this task/)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Bulk Actions' })).toHaveAttribute('href', '/collections/bulk-actions')
    })
  })

  test('shows an error message instead of treating a failed lookup as empty', async () => {
    setup({
      mocks: [
        {
          request: {
            query: GET_BULK_UPDATE_COLLECTION_TASK,
            variables: {
              params: {
                providerId: 'MMT_2',
                taskId: 'BU-1005'
              }
            }
          },
          error: new Error('An error occurred')
        }
      ]
    })

    expect(await screen.findByText(/An error occurred/)).toBeInTheDocument()
    expect(screen.getByText(/Try refreshing the page/)).toBeInTheDocument()
  })

  describe('Overall Progress stats', () => {
    test('folds SKIPPED into Failed and counts every terminal status toward percent complete', async () => {
      setup({
        mocks: [
          buildTaskMock({
            collectionStatuses: [
              {
                conceptId: 'C1-MMT_2',
                status: 'UPDATED',
                statusMessage: null
              },
              {
                conceptId: 'C2-MMT_2',
                status: 'UPDATED',
                statusMessage: null
              },
              {
                conceptId: 'C3-MMT_2',
                status: 'FAILED',
                statusMessage: 'Bad schema'
              },
              {
                conceptId: 'C4-MMT_2',
                status: 'SKIPPED',
                statusMessage: 'Already up to date'
              },
              {
                conceptId: 'C5-MMT_2',
                status: 'PENDING',
                statusMessage: null
              }
            ]
          })
        ]
      })

      expect(await screen.findByText('80% Complete')).toBeInTheDocument()
      expect(screen.getByText('5 Items')).toBeInTheDocument()
    })
  })

  describe('when there are no FAILED collections', () => {
    test('does not render the New Bulk Update from Failed button', async () => {
      setup()

      await screen.findByText('100% Complete')
      expect(screen.queryByRole('button', { name: 'New Bulk Update from Failed' })).not.toBeInTheDocument()
    })
  })

  describe('when there is at least one FAILED collection', () => {
    const failedTaskMock = buildTaskMock({
      collectionStatuses: [
        {
          conceptId: 'C1-MMT_2',
          status: 'UPDATED',
          statusMessage: null
        },
        {
          conceptId: 'C2-MMT_2',
          status: 'FAILED',
          statusMessage: 'Bad schema'
        }
      ]
    })

    test('New Bulk Update from Failed navigates to the edit page with the failed conceptIds and the original request, using the camelCase field names the edit page expects', async () => {
      const { user } = setup({ mocks: [failedTaskMock] })

      const retryButton = await screen.findByRole('button', { name: 'New Bulk Update from Failed' })
      await user.click(retryButton)

      const stub = await screen.findByText(/Bulk actions edit page:/)
      const payload = JSON.parse(stub.textContent.replace('Bulk actions edit page: ', ''))

      expect(payload.retry).toEqual({
        conceptIds: ['C2-MMT_2'],
        providerId: 'MMT_2',
        updateField: 'SCIENCE_KEYWORDS',
        updateType: 'FIND_AND_REPLACE',
        findValue: { Category: 'EARTH SCIENCE' },
        updateValue: { Category: 'EARTH SCIENCE 2' }
      })
    })
  })

  describe('Download CSV', () => {
    test('calls downloadBulkUpdateTaskCsv with the loaded task', async () => {
      const { user } = setup()

      await screen.findByText('100% Complete')

      await user.click(screen.getByRole('button', { name: 'Download CSV' }))

      expect(downloadBulkUpdateTaskCsv).toHaveBeenCalledTimes(1)

      const [{ task }] = downloadBulkUpdateTaskCsv.mock.calls[0]

      expect(task.taskId).toBe('BU-1005')
      expect(task.collectionStatuses).toHaveLength(2)
    })
  })

  describe('Refresh', () => {
    test('refetches the task', async () => {
      const taskMock = buildTaskMock()

      const { user } = setup({ mocks: [taskMock, taskMock] })

      await screen.findByText('100% Complete')

      await user.click(screen.getByRole('button', { name: 'Refresh' }))

      expect(await screen.findByText('100% Complete')).toBeInTheDocument()
    })
  })
})
