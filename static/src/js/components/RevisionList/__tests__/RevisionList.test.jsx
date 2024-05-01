import React, { Suspense } from 'react'
import {
  render,
  screen,
  within,
  waitFor
} from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Routes,
  Route
} from 'react-router-dom'

import userEvent from '@testing-library/user-event'
import moment from 'moment'
import { collectionRevisions } from './__mocks__/revisionResults'

import AppContext from '../../../context/AppContext'

import RevisionList from '../RevisionList'
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary'
import NotificationsContext from '../../../context/NotificationsContext'
import {
  RESTORE_COLLECTION_REVISION
} from '../../../operations/mutations/restoreCollectionRevision'

import errorLogger from '../../../utils/errorLogger'

vi.mock('../../../utils/errorLogger')

const setup = ({
  additionalMocks = [],
  overrideInitialEntries,
  overrideMocks,
  overrideProps
}) => {
  const mocks = [
    collectionRevisions,
    ...additionalMocks
  ]

  let props = {}

  if (overrideProps) {
    props = {
      ...props,
      ...overrideProps
    }
  }

  const notificationContext = {
    addNotification: vi.fn()
  }

  render(
    <AppContext.Provider value={
      {
        user: {
          providerId: 'TESTPROV'
        }
      }
    }
    >
      <NotificationsContext.Provider value={notificationContext}>
        <MemoryRouter initialEntries={overrideInitialEntries || ['/collections/C1200000104-MMT_2/revisions']}>
          <MockedProvider
            mocks={overrideMocks || mocks}
          >
            <Routes>
              <Route
                path="/:type/:conceptId/revisions"
                element={
                  (
                    <ErrorBoundary>
                      <Suspense fallback="Loading...">
                        <RevisionList {...props} />
                      </Suspense>
                    </ErrorBoundary>
                  )
                }
              />
              <Route
                path="/404"
                element={<div>404 page</div>}
              />
            </Routes>
          </MockedProvider>
        </MemoryRouter>
      </NotificationsContext.Provider>
    </AppContext.Provider>
  )

  return {
    user: userEvent.setup()

  }
}

describe('RevisionList component', () => {
  describe('when all metadata is provided', () => {
    beforeEach(() => {
      setup({})
    })

    describe('while the request is loading', () => {
      test('renders the placeholders', async () => {
        expect(screen.queryByText('Loading...'))
      })
    })

    describe('when the request has loaded', () => {
      test('renders the data', async () => {
        await waitFor(() => {
          expect(screen.queryAllByRole('row').length).toEqual(9)
        })

        const date = new Date(2000, 1, 1, 13)
        vi.setSystemTime(date)
        const rows = screen.queryAllByRole('row')
        const row1 = rows[1]
        const row2 = rows[2]

        const row1Cells = within(row1).queryAllByRole('cell')
        const row2Cells = within(row2).queryAllByRole('cell')
        expect(row1Cells).toHaveLength(4)
        expect(row1Cells[0].textContent).toBe('8 - Published')
        expect(row1Cells[1].textContent).toBe(moment(date).format('LLLL'))
        expect(row1Cells[2].textContent).toBe('admin')
        expect(row1Cells[3].textContent).toBe('')

        expect(row2Cells).toHaveLength(4)
        expect(row2Cells[0].textContent).toBe('7 - Revision')
        expect(row2Cells[2].textContent).toBe('admin')
        expect(row2Cells[3].textContent).toBe('Revert to this revision')
      })
    })
  })

  describe('when reverting to a revision results in a success', () => {
    test('should call restore to revision mutation', async () => {
      const { user } = setup({
        additionalMocks: [
          {
            request: {
              query: RESTORE_COLLECTION_REVISION,
              variables: {
                conceptId: 'C1200000104-MMT_2',
                revisionId: '7'
              }
            },
            result: {
              data: {
                restoreCollectionRevision: {
                  conceptId: 'C1200000104-MMT_2',
                  revisionId: '8'
                }
              }
            }
          },
          collectionRevisions
        ]
      })

      await waitForResponse()

      const submitButton = screen.getAllByRole('button', { name: 'Revert to this revision' })

      await user.click(submitButton[0])

      expect(screen.getByText('8 - Published')).toBeInTheDocument()
    })
  })

  describe('when reverting to a revision results in a success', () => {
    test('should call restore to revision mutation', async () => {
      const { user } = setup({
        additionalMocks: [
          {
            request: {
              query: RESTORE_COLLECTION_REVISION,
              variables: {
                conceptId: 'C1200000104-MMT_2',
                revisionId: '7'
              }
            },
            error: new Error('An error occurred')
          }
        ]
      })

      await waitForResponse()

      const submitButton = screen.getAllByRole('button', { name: 'Revert to this revision' })

      await user.click(submitButton[0])

      expect(errorLogger).toHaveBeenCalledTimes(1)
      expect(errorLogger).toHaveBeenCalledWith('Error reverting record', 'handleRevert: restoreMutation')
    })
  })
})
