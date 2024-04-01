import React from 'react'
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

import { GET_TOOL_DRAFTS } from '../../../operations/queries/getToolDrafts'

import ManagePage from '../ManagePage'
import AppContext from '../../../context/AppContext'

const setup = (overrideMocks) => {
  const mocks = [
    {
      request: {
        query: GET_TOOL_DRAFTS,
        variables: {
          params: {
            conceptType: 'Tool',
            provider: 'TESTPROV',
            limit: 5,
            sortKey: ['-revision_date']
          }
        }
      },
      result: {
        data: {
          drafts: {
            count: 1,
            items: [
              {
                conceptId: 'TD1000000000-TESTPROV',
                revisionDate: '2023-11-30 00:00:00',
                ummMetadata: {
                  Name: 'Tool Draft 1 Name',
                  LongName: 'Tool Draft 1 Long Name'
                },
                previewMetadata: {
                  name: 'Tool Draft 1 Name',
                  longName: 'Tool Draft 1 Long Name',
                  __typename: 'Tool'
                }
              },
              {
                conceptId: 'TD1000000001-TESTPROV',
                revisionDate: '2023-11-30 00:00:00',
                ummMetadata: {
                  Name: 'Tool Draft 2 Name',
                  LongName: 'Tool Draft 2 Long Name'
                },
                previewMetadata: {
                  name: 'Tool Draft 2 Name',
                  longName: 'Tool Draft 2 Long Name',
                  __typename: 'Tool'
                }
              }
            ]
          }
        }
      }
    }
  ]

  render(
    <AppContext.Provider value={
      {
        user: {
          providerId: 'TESTPROV'
        },
        setDraft: vi.fn(),
        setOriginalDraft: vi.fn()
      }
    }
    >
      <MemoryRouter initialEntries={['/manage/tools']}>
        <MockedProvider
          mocks={overrideMocks || mocks}
        >
          <Routes>
            <Route
              path="/manage/:type"
              element={<ManagePage />}
            />
            <Route
              path="/drafts/tools/new"
              element={<>New Draft Page</>}
            />
            <Route
              path="/drafts/tools"
              element={<>View All Tool Drafts Page</>}
            />
          </Routes>
        </MockedProvider>
      </MemoryRouter>
    </AppContext.Provider>
  )
}

describe('ManagePage component', () => {
  describe('when all metadata is provided', () => {
    beforeEach(() => {
      setup()
    })

    test('renders the correct heading for the "create" section', async () => {
      expect(screen.queryByRole('heading', { name: 'Create Tool Record' })).toBeInTheDocument()
    })

    test('renders the correct heading for the "drafts" section', async () => {
      expect(screen.queryByRole('heading', { name: 'TESTPROV Tool Drafts' })).toBeInTheDocument()
    })

    test('initializes the draft list with placeholders', async () => {
      const draftsSection = screen.queryByRole('heading', { name: 'TESTPROV Tool Drafts' }).parentElement

      expect(within(draftsSection).queryAllByRole('presentation', { hidden: true }).length).toEqual(5)
    })

    test('renders a "create" button', () => {
      expect(screen.queryByRole('link', { name: 'Create New Record' })).toBeInTheDocument()
    })

    test('renders a message to link to the search bar tooltip', () => {
      const createRecordSection = screen.queryByRole('heading', { name: 'Create Tool Record' }).parentElement
      const searchBarTooltipMessage = within(createRecordSection).queryByText('to clone or edit.', { exact: false })
      expect(within(searchBarTooltipMessage).queryByRole('button')).toBeInTheDocument()
    })

    describe('when clicking the "create" button', () => {
      test('navigates to the new drafts page', async () => {
        const user = userEvent.setup()
        const button = screen.queryByRole('link', { name: 'Create New Record' })

        await user.click(button)

        await waitFor(() => {
          expect(screen.queryByText('New Draft Page')).toBeInTheDocument()
        })
      })
    })

    test('renders a "view all drafts" button', () => {
      expect(screen.queryByRole('link', { name: 'View All Tool Drafts' })).toBeInTheDocument()
    })

    describe('when clicking the "view all drafts" button', () => {
      test('navigates to the "view all drafts" page', async () => {
        const user = userEvent.setup()
        const button = screen.queryByRole('link', { name: 'View All Tool Drafts' })

        await user.click(button)

        await waitFor(() => {
          expect(screen.queryByText('View All Tool Drafts Page')).toBeInTheDocument()
        })
      })
    })

    describe('when the drafts have loaded', () => {
      test('renders the drafts in the list', async () => {
        await waitForResponse()

        const draftsSection = screen.queryByText('TESTPROV Tool Drafts').parentElement
        const draftLinks = within(draftsSection.querySelector('.list-group')).queryAllByRole('link')

        expect(draftLinks.length).toEqual(2)
        expect(within(draftLinks[0]).queryByText('Tool Draft 1 Name')).toBeInTheDocument()
        expect(within(draftLinks[0]).queryByText('Tool Draft 1 Long Name')).toBeInTheDocument()
        expect(within(draftLinks[0]).queryByText('11/30/2023, 24:00:00')).toBeInTheDocument()
        expect(within(draftLinks[1]).queryByText('Tool Draft 2 Name')).toBeInTheDocument()
        expect(within(draftLinks[1]).queryByText('Tool Draft 2 Long Name')).toBeInTheDocument()
        expect(within(draftLinks[1]).queryByText('11/30/2023, 24:00:00')).toBeInTheDocument()
      })
    })
  })

  describe('when a name or long name are missing', () => {
    test('displays a fallback', async () => {
      setup([
        {
          request: {
            query: GET_TOOL_DRAFTS,
            variables: {
              params: {
                conceptType: 'Tool',
                provider: 'TESTPROV',
                limit: 5,
                sortKey: ['-revision_date']
              }
            }
          },
          result: {
            data: {
              drafts: {
                count: 1,
                items: [
                  {
                    conceptId: 'TD1000000000-TESTPROV',
                    revisionDate: '2023-11-30 00:00:00',
                    ummMetadata: {
                      Name: null,
                      LongName: null
                    },
                    previewMetadata: {
                      name: null,
                      longName: null,
                      __typename: 'Tool'
                    }
                  }
                ]
              }
            }
          }
        }
      ])

      await waitForResponse()

      const draftsSection = screen.queryByText('TESTPROV Tool Drafts').parentElement
      const draftLinks = within(draftsSection.querySelector('.list-group')).queryAllByRole('link')

      expect(draftLinks.length).toEqual(1)
      expect(within(draftLinks[0]).queryByText('<Blank Name>')).toBeInTheDocument()
      expect(within(draftLinks[0]).queryByText('<Untitled Record>')).toBeInTheDocument()
    })
  })

  describe('when the drafts request receives an error', () => {
    test('displays the error state', async () => {
      setup([
        {
          request: {
            query: GET_TOOL_DRAFTS,
            variables: {
              params: {
                conceptType: 'Tool',
                provider: 'TESTPROV',
                limit: 5,
                sortKey: ['-revision_date']
              }
            }
          },
          error: new Error('An error occurred')
        }
      ])

      await waitForResponse()

      const draftsSection = screen.queryByText('TESTPROV Tool Drafts').parentElement
      const draftList = draftsSection.querySelector('.list-group')

      expect(draftList).not.toBeInTheDocument()
      expect(within(draftsSection).queryByRole('alert', { name: '' })).toBeInTheDocument()
      expect(within(draftsSection).queryByRole('alert', { name: '' }).textContent).toEqual('Sorry! An error occurred')
    })
  })
})
