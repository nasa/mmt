import React from 'react'
import { MockedProvider } from '@apollo/client/testing'
import {
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRoutesStub, Link } from 'react-router'

import { GET_COLLECTIONS } from '@/js/operations/queries/getCollections'
import {
  GET_COLLECTIONS_DETAILED_KEYWORDS
} from '@/js/operations/queries/getCollectionsDetailedKeywords'
import {
  CREATE_BULK_UPDATE_COLLECTION_TASK
} from '@/js/operations/mutations/createBulkUpdateCollectionTask'

import CollectionSelectionContextProvider from '@/js/providers/CollectionSelectionContextProvider/CollectionSelectionContextProvider'
import NotificationsContextProvider from '@/js/providers/NotificationsContextProvider/NotificationsContextProvider'
import Notifications from '@/js/components/Notifications/Notifications'
import useCollectionSelectionContext from '@/js/hooks/useCollectionSelectionContext'
import useControlledKeywords from '@/js/hooks/useControlledKeywords'
import fetchCmrKeywords from '@/js/utils/fetchCmrKeywords'
import errorLogger from '@/js/utils/errorLogger'

import BulkActionsEditPage from '../BulkActionsEditPage'

vi.mock('@/js/utils/errorLogger')

// The controlled-value pickers (KeywordPicker, PlatformField, InstrumentField,
// DataCenterField) each have their own unit tests covering KMS-fetching -- these default
// mocks just keep that network traffic out of page-level tests. A few tests below override
// one per-test with real-ish data to prove the picker is wired into the page end to end.
vi.mock('@/js/hooks/useControlledKeywords', () => ({
  __esModule: true,
  default: vi.fn(() => ({
    keywords: {},
    isLoading: false
  }))
}))

vi.mock('@/js/utils/fetchCmrKeywords', () => ({
  __esModule: true,
  // An empty-but-well-formed response -- parseCmrResponse/parseCmrInstrumentsResponse/
  // getKeywords all expect at least one top-level key holding an array to traverse into.
  default: vi.fn().mockResolvedValue({ keywordRoot: [] })
}))

// Mock CodeMirror to render a standard textarea, so userEvent.type works easily -- matches
// the pattern used by JsonPreview's tests, which wrap the same underlying editor.
vi.mock('@uiw/react-codemirror', () => ({
  __esModule: true,
  default: ({ value, onChange }) => (
    <textarea
      aria-label="updateValue JSON"
      value={value || ''}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
    />
  )
}))

const getCollectionsMock = {
  request: {
    query: GET_COLLECTIONS,
    variables: {
      params: {
        conceptId: ['C1-TESTPROV'],
        limit: 1
      }
    }
  },
  result: {
    data: {
      collections: {
        count: 1,
        items: [
          {
            conceptId: 'C1-TESTPROV',
            shortName: 'ShortName1',
            version: '1',
            title: 'Title1',
            provider: 'TESTPROV',
            entryTitle: 'EntryTitle1',
            revisionId: '1',
            granules: { count: 0 },
            tagDefinitions: { items: [] },
            tags: null,
            revisionDate: '2024-01-01T00:00:00.000Z'
          }
        ]
      }
    }
  }
}

const createBulkUpdateMock = {
  request: {
    query: CREATE_BULK_UPDATE_COLLECTION_TASK,
    variables: {
      conceptIds: ['C1-TESTPROV'],
      providerId: 'TESTPROV',
      updateField: 'DATA_CENTERS',
      updateType: 'FIND_AND_REPLACE',
      findValue: { ShortName: 'NASA/GSFC' },
      updateValue: {
        ShortName: 'NASA/GSFC',
        LongName: 'Goddard',
        Roles: ['ARCHIVER']
      }
    }
  },
  result: {
    data: {
      createBulkUpdateCollectionTask: {
        taskId: 'BU-4439'
      }
    }
  }
}

// Matches only if updateValue has LongName stripped -- MockedProvider only resolves this
// mutation if that stripping actually happened. Roles is filled in (not left at its []
// skeleton default), since FIND_AND_REPLACE requires it on the replaced entry.
const createBulkUpdateStrippedMock = {
  request: {
    query: CREATE_BULK_UPDATE_COLLECTION_TASK,
    variables: {
      conceptIds: ['C1-TESTPROV'],
      providerId: 'TESTPROV',
      updateField: 'DATA_CENTERS',
      updateType: 'FIND_AND_REPLACE',
      findValue: { ShortName: 'NASA/GSFC' },
      updateValue: {
        ShortName: 'NASA/GSFC',
        Roles: ['ARCHIVER']
      }
    }
  },
  result: {
    data: {
      createBulkUpdateCollectionTask: {
        taskId: 'BU-4443'
      }
    }
  }
}

// Matches only if updateValue keeps NumberOfInstruments: 0 -- MockedProvider only resolves
// this mutation if 0 survived stripping instead of being dropped as if it were the untouched
// skeleton default.
const createBulkUpdateInstrumentZeroMock = {
  request: {
    query: CREATE_BULK_UPDATE_COLLECTION_TASK,
    variables: {
      conceptIds: ['C1-TESTPROV'],
      providerId: 'TESTPROV',
      updateField: 'INSTRUMENTS',
      updateType: 'FIND_AND_UPDATE',
      findValue: { ShortName: 'ATM' },
      updateValue: {
        Technique: 'Updated',
        NumberOfInstruments: 0
      }
    }
  },
  result: {
    data: {
      createBulkUpdateCollectionTask: {
        taskId: 'BU-4444'
      }
    }
  }
}

const createBulkUpdateDelayedMock = {
  ...createBulkUpdateMock,
  // Keeps the mutation pending long enough to observe the Submit button's disabled state
  // while a request is already in flight.
  delay: 50
}

const createBulkUpdateErrorMock = {
  request: {
    query: CREATE_BULK_UPDATE_COLLECTION_TASK,
    variables: {
      conceptIds: ['C1-TESTPROV'],
      providerId: 'TESTPROV',
      updateField: 'DATA_CENTERS',
      updateType: 'FIND_AND_REPLACE',
      findValue: { ShortName: 'NASA/GSFC' },
      updateValue: {
        ShortName: 'NASA/GSFC',
        LongName: 'Goddard',
        Roles: ['ARCHIVER']
      }
    }
  },
  error: new Error('An error occurred')
}

const createBulkUpdateHomePageUrlMock = {
  request: {
    query: CREATE_BULK_UPDATE_COLLECTION_TASK,
    variables: {
      conceptIds: ['C1-TESTPROV'],
      providerId: 'TESTPROV',
      updateField: 'DATA_CENTERS',
      updateType: 'FIND_AND_UPDATE_HOME_PAGE_URL',
      findValue: { ShortName: 'NASA/GSFC' },
      updateValue: {
        ContactInformation: {
          RelatedUrls: [
            {
              URLContentType: 'DataCenterURL',
              Type: 'HOME PAGE',
              URL: 'https://example.gov'
            }
          ]
        }
      }
    }
  },
  result: {
    data: {
      createBulkUpdateCollectionTask: {
        taskId: 'BU-4440'
      }
    }
  }
}

const createBulkUpdateHomePageUrlRemovalMock = {
  request: {
    query: CREATE_BULK_UPDATE_COLLECTION_TASK,
    variables: {
      conceptIds: ['C1-TESTPROV'],
      providerId: 'TESTPROV',
      updateField: 'DATA_CENTERS',
      updateType: 'FIND_AND_UPDATE_HOME_PAGE_URL',
      findValue: { ShortName: 'NASA/GSFC' },
      updateValue: {
        ContactInformation: {
          RelatedUrls: []
        }
      }
    }
  },
  result: {
    data: {
      createBulkUpdateCollectionTask: {
        taskId: 'BU-4441'
      }
    }
  }
}

const createBulkUpdateMultipleEntriesMock = {
  request: {
    query: CREATE_BULK_UPDATE_COLLECTION_TASK,
    variables: {
      conceptIds: ['C1-TESTPROV'],
      providerId: 'TESTPROV',
      updateField: 'DATA_CENTERS',
      updateType: 'ADD_TO_EXISTING',
      findValue: undefined,
      updateValue: [
        {
          ShortName: 'NASA/JPL',
          Roles: ['ARCHIVER']
        },
        {
          ShortName: 'NASA/MSFC',
          Roles: ['ARCHIVER']
        }
      ]
    }
  },
  result: {
    data: {
      createBulkUpdateCollectionTask: {
        taskId: 'BU-4442'
      }
    }
  }
}

// Covers the detailed-keyword pre-submit check (MMT-4225) -- fetches scienceKeywords/
// locationKeywords for whichever collections are selected, ahead of the actual bulk-update
// mutation, so the page can warn if an existing DetailedVariable/DetailedLocation value
// would be lost. Only one collection is selected for most of these.
const getCollectionsDetailedKeywordsNoLossMock = {
  request: {
    query: GET_COLLECTIONS_DETAILED_KEYWORDS,
    variables: {
      params: {
        conceptId: ['C1-TESTPROV'],
        limit: 1
      }
    }
  },
  result: {
    data: {
      collections: {
        items: [
          {
            conceptId: 'C1-TESTPROV',
            shortName: 'ShortName1',
            version: '1',
            scienceKeywords: [
              {
                category: 'EARTH SCIENCE',
                topic: 'ATMOSPHERE',
                term: 'CLOUDS'
              }
            ],
            locationKeywords: []
          }
        ]
      }
    }
  }
}

const getCollectionsDetailedKeywordsScienceLossMock = {
  request: {
    query: GET_COLLECTIONS_DETAILED_KEYWORDS,
    variables: {
      params: {
        conceptId: ['C1-TESTPROV'],
        limit: 1
      }
    }
  },
  result: {
    data: {
      collections: {
        items: [
          {
            conceptId: 'C1-TESTPROV',
            shortName: 'ShortName1',
            version: '1',
            scienceKeywords: [
              {
                category: 'EARTH SCIENCE',
                topic: 'ATMOSPHERE',
                term: 'CLOUDS',
                detailedVariable: 'Cloud Base Height'
              }
            ],
            locationKeywords: []
          }
        ]
      }
    }
  }
}

const getCollectionsDetailedKeywordsScienceLossDelayedMock = {
  ...getCollectionsDetailedKeywordsScienceLossMock,
  // Keeps the check pending long enough to observe the Submit button's "Checking
  // collections…" state while the request is in flight.
  delay: 50
}

const getCollectionsDetailedKeywordsLocationLossMock = {
  request: {
    query: GET_COLLECTIONS_DETAILED_KEYWORDS,
    variables: {
      params: {
        conceptId: ['C1-TESTPROV'],
        limit: 1
      }
    }
  },
  result: {
    data: {
      collections: {
        items: [
          {
            conceptId: 'C1-TESTPROV',
            shortName: 'ShortName1',
            version: '1',
            scienceKeywords: [],
            locationKeywords: [
              {
                category: 'CONTINENT',
                type: 'AFRICA',
                detailedLocation: 'Sahara Desert'
              }
            ]
          }
        ]
      }
    }
  }
}

const getCollectionsDetailedKeywordsErrorMock = {
  request: {
    query: GET_COLLECTIONS_DETAILED_KEYWORDS,
    variables: {
      params: {
        conceptId: ['C1-TESTPROV'],
        limit: 1
      }
    }
  },
  error: new Error('An error occurred')
}

// For the "Remove N collections and submit" scenario -- two collections selected, only
// one (C1) has a value that would be lost.
const getCollectionsTwoMock = {
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
        items: [
          {
            conceptId: 'C1-TESTPROV',
            shortName: 'ShortName1',
            version: '1',
            title: 'Title1',
            provider: 'TESTPROV',
            entryTitle: 'EntryTitle1',
            revisionId: '1',
            granules: { count: 0 },
            tagDefinitions: { items: [] },
            tags: null,
            revisionDate: '2024-01-01T00:00:00.000Z'
          },
          {
            conceptId: 'C2-TESTPROV',
            shortName: 'ShortName2',
            version: '2',
            title: 'Title2',
            provider: 'TESTPROV',
            entryTitle: 'EntryTitle2',
            revisionId: '1',
            granules: { count: 0 },
            tagDefinitions: { items: [] },
            tags: null,
            revisionDate: '2024-01-01T00:00:00.000Z'
          }
        ]
      }
    }
  }
}

const getCollectionsDetailedKeywordsTwoMock = {
  request: {
    query: GET_COLLECTIONS_DETAILED_KEYWORDS,
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
        items: [
          {
            conceptId: 'C1-TESTPROV',
            shortName: 'ShortName1',
            version: '1',
            scienceKeywords: [
              {
                category: 'EARTH SCIENCE',
                topic: 'ATMOSPHERE',
                term: 'CLOUDS',
                detailedVariable: 'Cloud Base Height'
              }
            ],
            locationKeywords: []
          },
          {
            conceptId: 'C2-TESTPROV',
            shortName: 'ShortName2',
            version: '2',
            scienceKeywords: [
              {
                category: 'EARTH SCIENCE',
                topic: 'ATMOSPHERE',
                term: 'CLOUDS'
              }
            ],
            locationKeywords: []
          }
        ]
      }
    }
  }
}

const createBulkUpdateScienceClearAllMock = {
  request: {
    query: CREATE_BULK_UPDATE_COLLECTION_TASK,
    variables: {
      conceptIds: ['C1-TESTPROV'],
      providerId: 'TESTPROV',
      updateField: 'SCIENCE_KEYWORDS',
      updateType: 'CLEAR_ALL_AND_REPLACE',
      findValue: undefined,
      updateValue: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'CLOUDS'
        }
      ]
    }
  },
  result: {
    data: {
      createBulkUpdateCollectionTask: {
        taskId: 'BU-4450'
      }
    }
  }
}

const createBulkUpdateScienceClearAllRemoveFilteredMock = {
  request: {
    query: CREATE_BULK_UPDATE_COLLECTION_TASK,
    variables: {
      conceptIds: ['C2-TESTPROV'],
      providerId: 'TESTPROV',
      updateField: 'SCIENCE_KEYWORDS',
      updateType: 'CLEAR_ALL_AND_REPLACE',
      findValue: undefined,
      updateValue: [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'CLOUDS'
        }
      ]
    }
  },
  result: {
    data: {
      createBulkUpdateCollectionTask: {
        taskId: 'BU-4451'
      }
    }
  }
}

const createBulkUpdateLocationFindAndRemoveMock = {
  request: {
    query: CREATE_BULK_UPDATE_COLLECTION_TASK,
    variables: {
      conceptIds: ['C1-TESTPROV'],
      providerId: 'TESTPROV',
      updateField: 'LOCATION_KEYWORDS',
      updateType: 'FIND_AND_REMOVE',
      findValue: { Category: 'CONTINENT' },
      updateValue: undefined
    }
  },
  result: {
    data: {
      createBulkUpdateCollectionTask: {
        taskId: 'BU-4452'
      }
    }
  }
}

// Pre-selects a single collection by rendering a button that calls the real context's
// toggleCollectionSelection, mirroring the pattern used by CollectionSelectionBar's tests.
const PreSelectCollection = () => {
  const { toggleCollectionSelection } = useCollectionSelectionContext()

  return (
    <button
      type="button"
      onClick={() => toggleCollectionSelection('C1-TESTPROV', 'TESTPROV')}
    >
      Select collection
    </button>
  )
}

// A second selectable collection, for tests that need more than one selected collection
// (e.g. the detailed-keyword pre-submit check's "Remove N collections and submit" action,
// which only excludes the affected ones rather than the whole selection).
const PreSelectSecondCollection = () => {
  const { toggleCollectionSelection } = useCollectionSelectionContext()

  return (
    <button
      type="button"
      onClick={() => toggleCollectionSelection('C2-TESTPROV', 'TESTPROV')}
    >
      Select second collection
    </button>
  )
}

// Rendered outside the routed page content, like CollectionSelectionBar is in production,
// so the selection context's state can be observed even after navigating away from the
// edit page.
const SelectionCountObserver = () => {
  const { selectedCollections } = useCollectionSelectionContext()

  return (
    <div data-testid="selection-count">{selectedCollections.length}</div>
  )
}

// Cancel no longer navigates away (it only clears the field/action-type selection) -- a few
// tests still need some way to actually leave the edit page, the same way a sidebar link
// would in production. Rendered alongside the page itself (not as a sibling of the router),
// since Link needs to be inside the Router's own tree to work.
const EditPageWithLeaveLink = () => (
  <>
    <BulkActionsEditPage />
    <Link to="/collections">Leave edit page</Link>
  </>
)

// A data router stub, rather than a plain MemoryRouter, since BulkActionsEditPage renders
// BulkActionsEditNavigationGuard, which uses useBlocker -- only supported by data routers.
const Stub = createRoutesStub([
  {
    path: '/:type/bulk-actions/edit',
    Component: EditPageWithLeaveLink
  },
  {
    path: '/:type',
    Component: () => <div>All Collections page</div>
  },
  {
    path: '/:type/bulk-actions',
    Component: () => <div>Bulk actions landing page</div>
  },
  {
    path: '/:type/bulk-actions/:taskId',
    Component: () => <div>Bulk actions task page</div>
  },
  {
    path: '/404',
    Component: () => <div>404 page</div>
  }
])

const setup = ({
  mocks = [getCollectionsMock],
  initialEntries = ['/collections/bulk-actions/edit']
} = {}) => {
  const user = userEvent.setup()

  render(
    <MockedProvider mocks={mocks}>
      <NotificationsContextProvider>
        <CollectionSelectionContextProvider>
          <PreSelectCollection />
          <PreSelectSecondCollection />
          <SelectionCountObserver />
          <Notifications />
          <Stub initialEntries={initialEntries} />
        </CollectionSelectionContextProvider>
      </NotificationsContextProvider>
    </MockedProvider>
  )

  return { user }
}

const selectFieldAndType = async (user) => {
  await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_REPLACE')
  await user.selectOptions(screen.getByLabelText('Target Field'), 'DATA_CENTERS')
}

// Replaces the updateValue JSON editor's content with the given value, escaping the
// characters userEvent.type treats as special key syntax ('{' and '[').
const fillUpdateValueJson = async (user, value) => {
  const editor = screen.getByLabelText('updateValue JSON')
  const text = JSON.stringify(value).replace(/{/g, '{{').replace(/\[/g, '[[')

  await user.clear(editor)
  await user.type(editor, text)
}

describe('BulkActionsEditPage component', () => {
  describe('when the :type has no bulk-update configuration', () => {
    test('redirects to 404 instead of rendering', async () => {
      setup({ initialEntries: ['/variables/bulk-actions/edit'] })

      expect(await screen.findByText('404 page')).toBeInTheDocument()
      expect(screen.queryByText('Configure Bulk Update')).not.toBeInTheDocument()
    })

    test('redirects to 404 for a :type matching an inherited Object.prototype property', async () => {
      setup({ initialEntries: ['/toString/bulk-actions/edit'] })

      expect(await screen.findByText('404 page')).toBeInTheDocument()
      expect(screen.queryByText('Configure Bulk Update')).not.toBeInTheDocument()
    })
  })

  test('shows the selected collection count', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: 'Select collection' }))

    expect(await screen.findByText('You are configuring an update for 1 collection(s).')).toBeInTheDocument()
  })

  describe('when a collection is removed', () => {
    test('removes it and shows an Undo toast', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await screen.findByText('ShortName1')

      await user.click(screen.getByRole('button', { name: 'Remove' }))

      expect(screen.getByText('Collection removed from selection')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument()
      expect(await screen.findByText('You are configuring an update for 0 collection(s).')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Undo' }))

      expect(await screen.findByText('You are configuring an update for 1 collection(s).')).toBeInTheDocument()
    })

    test('does not resurrect the selection if Undo is clicked after leaving the page', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await screen.findByText('ShortName1')

      await user.click(screen.getByRole('button', { name: 'Remove' }))

      expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument()
      expect(screen.getByTestId('selection-count')).toHaveTextContent('0')

      // The Undo toast (rendered outside the routed page, as in production) outlives the
      // page itself -- leaving before clicking it exercises exactly that window. Cancel no
      // longer leaves the page, so this uses a plain link instead (standing in for a
      // sidebar link, like in production) to actually trigger the unmount.
      await user.click(screen.getByRole('link', { name: 'Leave edit page' }))
      await screen.findByText('All Collections page')

      await user.click(screen.getByRole('button', { name: 'Undo' }))

      expect(screen.getByTestId('selection-count')).toHaveTextContent('0')
    })
  })

  describe('when a field and action type are chosen', () => {
    test('shows the matching Find and Replace With forms', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectFieldAndType(user)

      expect(screen.getByText('Find')).toBeInTheDocument()
      expect(screen.getByText('Replace With')).toBeInTheDocument()
    })

    test('shows a tooltip next to "What will be sent to CMR" warning that FIND_AND_REPLACE drops an omitted field instead of keeping it', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      // SelectFieldAndType chooses FIND_AND_REPLACE, which overwrites the whole matched
      // entry -- unlike FIND_AND_UPDATE's partial merge, a blank/deleted key here is left
      // out of the replacement, not kept from the entry being replaced.
      await selectFieldAndType(user)

      const helpIcon = screen.getByRole('button', { name: 'help' })
      const label = screen.getByText('What will be sent to CMR')

      expect(label.compareDocumentPosition(helpIcon)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)

      await user.hover(helpIcon)

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveTextContent(
          "This replaces the whole entry, so a key left blank or deleted is left out of it, not kept from the entry it's replacing."
        )
      })
    })

    test('shows a tooltip next to "What will be sent to CMR" explaining how to keep, blank, or null a field for FIND_AND_UPDATE\'s partial merge', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'DATA_CENTERS')

      const helpIcon = screen.getByRole('button', { name: 'help' })

      await user.hover(helpIcon)

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveTextContent(
          'Delete a key or leave it blank to keep the existing value. Set it to null to remove it -- except a key marked required, which can never be set to null.'
        )
      })
    })

    test('reveals the tooltip on keyboard focus, not just a pointer hover', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectFieldAndType(user)

      // A real, focusable button (not the plain, non-focusable span this used to be) is
      // required for a keyboard-only user to ever reach this tooltip at all.
      const helpIcon = screen.getByRole('button', { name: 'help' })
      helpIcon.focus()

      expect(helpIcon).toHaveFocus()

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })
    })

    test('prepopulates the updateValue JSON with every field, Characteristics included, for Platforms', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_REPLACE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'PLATFORMS')

      // FIND_AND_REPLACE supports multiple entries, so the skeleton is array-wrapped.
      expect(screen.getByLabelText('updateValue JSON')).toHaveValue(
        JSON.stringify([{
          ShortName: '',
          Type: '',
          LongName: '',
          Characteristics: []
        }], null, 2)
      )
    })

    test('prepopulates NumberOfInstruments as an empty string, like the other untouched fields', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_REPLACE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'INSTRUMENTS')

      // Unlike the other fields' '' / [] defaults, 0 is itself a value a user might
      // legitimately submit for NumberOfInstruments, so it can't double as the "untouched"
      // sentinel -- '' fills that role here too, same as ShortName/LongName/Technique.
      expect(screen.getByLabelText('updateValue JSON')).toHaveValue(
        JSON.stringify([{
          ShortName: '',
          LongName: '',
          Technique: '',
          NumberOfInstruments: '',
          Characteristics: []
        }], null, 2)
      )
    })

    test('labels the update section "Update With" for Find and Update, not "Replace With"', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'DATA_CENTERS')

      expect(screen.getByRole('heading', { name: 'Update With' })).toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: 'Replace With' })).not.toBeInTheDocument()
    })

    test.each([
      ['ADD_TO_EXISTING', 'Add'],
      ['CLEAR_ALL_AND_REPLACE', 'Replace With'],
      ['FIND_AND_REPLACE', 'Replace With'],
      ['FIND_AND_UPDATE', 'Update With']
    ])('labels the update section "%s" as "%s"', async (type, label) => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), type)
      await user.selectOptions(screen.getByLabelText('Target Field'), 'DATA_CENTERS')

      // A heading lookup, not a plain text lookup -- the entry-list picker's own "Add" button
      // (rendered for ADD_TO_EXISTING's Data Centers picker) also contains the word "Add".
      expect(screen.getByRole('heading', { name: label })).toBeInTheDocument()
    })
  })

  describe('when required values are missing', () => {
    test('disables the Submit button', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectFieldAndType(user)

      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).toBeDisabled()
    })
  })

  describe('when the updateValue JSON is left as its unfilled skeleton', () => {
    test('disables Submit even though the action type needs no find value, then enables it once a field is filled in', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'CLEAR_ALL_AND_REPLACE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'SCIENCE_KEYWORDS')

      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).toBeDisabled()

      // CLEAR_ALL_AND_REPLACE submits a whole new entry, so Category alone isn't enough --
      // ScienceKeywordType requires Category, Topic and Term together.
      await fillUpdateValueJson(user, [{
        Category: 'EARTH SCIENCE',
        Topic: 'ATMOSPHERE',
        Term: 'CLOUDS'
      }])

      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).not.toBeDisabled()
    })
  })

  describe('when some updateValue fields are still at their unfilled skeleton default', () => {
    test('strips them before submitting, instead of sending them alongside the filled-in fields', async () => {
      const { user } = setup({
        mocks: [getCollectionsMock, createBulkUpdateStrippedMock]
      })

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectFieldAndType(user)

      await user.type(
        screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }),
        'NASA/GSFC'
      )

      // LongName is left at its skeleton default and should be dropped, not sent alongside
      // ShortName/Roles (createBulkUpdateStrippedMock only matches a stripped updateValue).
      // Roles is filled in, since FIND_AND_REPLACE requires it on the replaced entry.
      await fillUpdateValueJson(user, {
        ShortName: 'NASA/GSFC',
        LongName: '',
        Roles: ['ARCHIVER']
      })

      const submitButton = screen.getByRole('button', { name: 'Submit Bulk Action' })
      expect(submitButton).not.toBeDisabled()

      await user.click(submitButton)

      expect(await screen.findByText('Bulk Update Submitted')).toBeInTheDocument()
      expect(screen.getByText('BU-4443')).toBeInTheDocument()
    })
  })

  describe('when a number field is explicitly set to 0', () => {
    test('submits it alongside the other filled-in fields, instead of silently dropping it', async () => {
      const { user } = setup({
        mocks: [getCollectionsMock, createBulkUpdateInstrumentZeroMock]
      })

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'INSTRUMENTS')

      await user.type(
        screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }),
        'ATM'
      )

      // 0 is a real, legitimate value for NumberOfInstruments -- it must survive both
      // schema validation and the unfilled-skeleton strip, not be treated as untouched.
      await fillUpdateValueJson(user, {
        Technique: 'Updated',
        NumberOfInstruments: 0
      })

      const submitButton = screen.getByRole('button', { name: 'Submit Bulk Action' })
      expect(submitButton).not.toBeDisabled()

      await user.click(submitButton)

      expect(await screen.findByText('Bulk Update Submitted')).toBeInTheDocument()
      expect(screen.getByText('BU-4444')).toBeInTheDocument()
    })

    test('does not disable Submit for a zero-only update', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'INSTRUMENTS')

      await user.type(
        screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }),
        'ATM'
      )

      await fillUpdateValueJson(user, { NumberOfInstruments: 0 })

      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).not.toBeDisabled()
    })
  })

  describe.each([
    ['SCIENCE_KEYWORDS', 'DetailedVariable'],
    ['LOCATION_KEYWORDS', 'DetailedLocation']
  ])('%s', (field, freeTextKey) => {
    test.each([
      'ADD_TO_EXISTING',
      'CLEAR_ALL_AND_REPLACE',
      'FIND_AND_REPLACE',
      'FIND_AND_REMOVE',
      'FIND_AND_UPDATE'
    ])('does not render %s or warn about it for %s', async (type) => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), type)
      await user.selectOptions(screen.getByLabelText('Target Field'), field)

      expect(screen.queryByLabelText(freeTextKey)).not.toBeInTheDocument()
      expect(screen.queryByText(new RegExp(`"${freeTextKey}"`))).not.toBeInTheDocument()
      expect(screen.queryByText(new RegExp(`may have a ${freeTextKey} value set`))).not.toBeInTheDocument()
    })
  })

  describe('controlled value picker', () => {
    // Restores the default (empty) mocks from the top of the file -- `clearMocks` alone
    // doesn't undo a `mockReturnValue`/`mockResolvedValue` override between tests.
    afterEach(() => {
      useControlledKeywords.mockReturnValue({
        keywords: {},
        isLoading: false
      })

      fetchCmrKeywords.mockResolvedValue({ keywordRoot: [] })
    })

    test('shows no removable entry for Data Centers before anything has been picked', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'ADD_TO_EXISTING')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'DATA_CENTERS')

      // Roles' blank skeleton default is `[]`, which is truthy in JS, unlike ShortName/
      // LongName's `''` -- queried by role "img" (not "button") since the selected-
      // collections table above also has an unrelated "Remove" button.
      expect(screen.queryByRole('img', { name: 'Remove' })).not.toBeInTheDocument()
    })

    test('picking a Science Keyword writes it into the updateValue JSON', async () => {
      useControlledKeywords.mockReturnValue({
        keywords: {
          category: [
            {
              value: 'EARTH SCIENCE',
              subfields: ['topic'],
              topic: [
                {
                  value: 'ATMOSPHERE',
                  subfields: ['term'],
                  term: [
                    { value: 'CLOUDS' }
                  ]
                }
              ]
            }
          ]
        },
        isLoading: false
      })

      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_REPLACE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'SCIENCE_KEYWORDS')

      await user.click(screen.getByRole('link', { name: 'View EARTH SCIENCE' }))
      await user.click(screen.getByRole('link', { name: 'View ATMOSPHERE' }))
      await user.click(screen.getByRole('checkbox', { name: 'CLOUDS' }))

      expect(screen.getByRole('button', { name: 'add' })).toHaveTextContent('Add Keyword')

      await user.click(screen.getByRole('button', { name: 'add' }))

      expect(screen.getByLabelText('updateValue JSON')).toHaveValue(JSON.stringify([
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'CLOUDS'
        }
      ], null, 2))
    })

    test('adding a Science Keyword that is the parent of an already-added one adds it as a second, separate entry', async () => {
      useControlledKeywords.mockReturnValue({
        keywords: {
          category: [
            {
              value: 'EARTH SCIENCE',
              subfields: ['topic'],
              topic: [
                {
                  value: 'ATMOSPHERE',
                  subfields: ['term'],
                  term: [
                    { value: 'CLOUDS' }
                  ]
                }
              ]
            }
          ]
        },
        isLoading: false
      })

      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'ADD_TO_EXISTING')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'SCIENCE_KEYWORDS')

      await user.click(screen.getByRole('link', { name: 'View EARTH SCIENCE' }))
      await user.click(screen.getByRole('link', { name: 'View ATMOSPHERE' }))
      await user.click(screen.getByRole('checkbox', { name: 'CLOUDS' }))
      await user.click(screen.getByRole('button', { name: 'add' }))

      // ATMOSPHERE is CLOUDS' own parent -- its path is a prefix of the already-added
      // CLOUDS entry's path, which used to be mistaken for the same keyword and rejected.
      // They're two distinct keywords, so adding ATMOSPHERE here must not be a no-op.
      await user.click(screen.getByRole('link', { name: 'EARTH SCIENCE' }))
      await user.click(screen.getByRole('link', { name: 'View EARTH SCIENCE' }))
      await user.click(screen.getByRole('checkbox', { name: 'ATMOSPHERE' }))
      await user.click(screen.getByRole('button', { name: 'add' }))

      expect(screen.getByLabelText('updateValue JSON')).toHaveValue(JSON.stringify([
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'CLOUDS'
        },
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE'
        }
      ], null, 2))
    })

    test('labels the Science Keywords submit button "Select Keyword" for Find and Update, since picking again replaces rather than adds', async () => {
      useControlledKeywords.mockReturnValue({
        keywords: {
          category: [
            {
              value: 'EARTH SCIENCE',
              subfields: ['topic'],
              topic: [
                { value: 'ATMOSPHERE' }
              ]
            }
          ]
        },
        isLoading: false
      })

      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'SCIENCE_KEYWORDS')

      expect(screen.getByRole('button', { name: 'add' })).toHaveTextContent('Select Keyword')
    })

    test('replacing a picked Science Keyword with its own parent actually replaces it', async () => {
      useControlledKeywords.mockReturnValue({
        keywords: {
          category: [
            {
              value: 'EARTH SCIENCE',
              subfields: ['topic'],
              topic: [
                {
                  value: 'ATMOSPHERE',
                  subfields: ['term'],
                  term: [
                    { value: 'CLOUDS' }
                  ]
                }
              ]
            }
          ]
        },
        isLoading: false
      })

      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'SCIENCE_KEYWORDS')

      await user.click(screen.getByRole('link', { name: 'View EARTH SCIENCE' }))
      await user.click(screen.getByRole('link', { name: 'View ATMOSPHERE' }))
      await user.click(screen.getByRole('checkbox', { name: 'CLOUDS' }))
      await user.click(screen.getByRole('button', { name: 'add' }))

      expect(screen.getByLabelText('updateValue JSON')).toHaveValue(JSON.stringify({
        Category: 'EARTH SCIENCE',
        Topic: 'ATMOSPHERE',
        Term: 'CLOUDS'
      }, null, 2))

      // ATMOSPHERE is CLOUDS' own parent -- its path ("EARTH SCIENCE>ATMOSPHERE") is a
      // substring of the already-picked CLOUDS entry's path, which is exactly what
      // KeywordPicker's own "already added" check would otherwise reject in this
      // single-value "replace" mode, leaving the stale CLOUDS pick in place.
      await user.click(screen.getByRole('link', { name: 'EARTH SCIENCE' }))
      await user.click(screen.getByRole('link', { name: 'View EARTH SCIENCE' }))
      await user.click(screen.getByRole('checkbox', { name: 'ATMOSPHERE' }))
      await user.click(screen.getByRole('button', { name: 'add' }))

      expect(screen.getByLabelText('updateValue JSON')).toHaveValue(JSON.stringify({
        Category: 'EARTH SCIENCE',
        Topic: 'ATMOSPHERE'
      }, null, 2))
    })

    test('picking a Platform Short Name writes it (and its auto-filled Type/LongName) into the updateValue JSON', async () => {
      fetchCmrKeywords.mockResolvedValue({
        basis: [
          {
            value: 'Air-based Platforms',
            subfields: ['category'],
            category: [
              {
                value: 'Jet',
                subfields: ['short_name'],
                short_name: [
                  {
                    value: 'A340-600',
                    subfields: ['long_name'],
                    long_name: [
                      { value: 'Airbus A340-600' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      })

      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'PLATFORMS')

      await user.click(await screen.findByText('Select Short Name'))
      await user.click(await screen.findByText('A340-600'))
      await user.click(screen.getByRole('button', { name: 'add' }))

      // The skeleton's Characteristics (no controlled vocabulary, so the picker never
      // touches it) survives alongside the picked ShortName/Type/LongName.
      expect(screen.getByLabelText('updateValue JSON')).toHaveValue(JSON.stringify({
        Characteristics: [],
        ShortName: 'A340-600',
        Type: 'Jet',
        LongName: 'Airbus A340-600'
      }, null, 2))

      // The entry's label follows the KMS hierarchy's own order (Type > ShortName >
      // LongName), not the Find/Replace With form fields' order (ShortName, Type, LongName).
      expect(screen.getByText('Jet > A340-600 > Airbus A340-600')).toBeInTheDocument()
    })

    test('picking an Instrument Short Name and typing Technique/NumberOfInstruments writes all of them into the updateValue JSON', async () => {
      fetchCmrKeywords.mockResolvedValue({
        category: [{
          value: 'Earth Remote Sensing Instruments',
          subfields: ['short_name'],
          short_name: [{
            value: 'ATM',
            subfields: ['long_name'],
            long_name: [{ value: 'Airborne Topographic Mapper' }]
          }]
        }]
      })

      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'INSTRUMENTS')

      await user.click(await screen.findByText('Select Short Name'))
      await user.click(await screen.findByText('ATM'))

      await user.type(
        screen.getByLabelText('Technique', { selector: '#bulk-actions-instrument-technique' }),
        'Lidar'
      )

      await user.type(
        screen.getByLabelText(
          'Number Of Instruments',
          { selector: '#bulk-actions-instrument-number-of-instruments' }
        ),
        '2'
      )

      await user.click(screen.getByRole('button', { name: 'add' }))

      expect(screen.getByLabelText('updateValue JSON')).toHaveValue(JSON.stringify({
        Characteristics: [],
        ShortName: 'ATM',
        LongName: 'Airborne Topographic Mapper',
        Technique: 'Lidar',
        NumberOfInstruments: 2
      }, null, 2))
    })

    test('switching Target Field discards an in-progress, not-yet-added pick instead of leaking it into the new field\'s picker', async () => {
      fetchCmrKeywords.mockImplementation((scheme) => {
        if (scheme === 'platforms') {
          return Promise.resolve({
            basis: [{
              value: 'Air-based Platforms',
              subfields: ['category'],
              category: [{
                value: 'Jet',
                subfields: ['short_name'],
                short_name: [{
                  value: 'A340-600',
                  subfields: ['long_name'],
                  long_name: [{ value: 'Airbus A340-600' }]
                }]
              }]
            }]
          })
        }

        return Promise.resolve({
          category: [{
            value: 'Earth Remote Sensing Instruments',
            subfields: ['short_name'],
            short_name: [{
              value: 'ATM',
              subfields: ['long_name'],
              long_name: [{ value: 'Airborne Topographic Mapper' }]
            }]
          }]
        })
      })

      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'ADD_TO_EXISTING')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'PLATFORMS')

      // Pick a Platform Short Name but never click "add" -- it's only ever held in
      // BulkActionsControlledEntryList's own pendingEntry state, not yet in updateValue JSON.
      await user.click(await screen.findByText('Select Short Name'))
      await user.click(await screen.findByText('A340-600'))
      expect(screen.getByText('A340-600')).toBeInTheDocument()

      await user.selectOptions(screen.getByLabelText('Target Field'), 'INSTRUMENTS')

      // Without a fresh picker instance, the stale Platforms pick (ShortName: 'A340-600')
      // would still be sitting in the shared pendingEntry and show up as the Instruments
      // picker's already-selected Short Name, even though the user never touched it.
      expect(await screen.findByText('Select Short Name')).toBeInTheDocument()
      expect(screen.queryByText('A340-600')).not.toBeInTheDocument()
    })

    test('picking a Data Center Short Name and checking Roles writes both into the updateValue JSON', async () => {
      fetchCmrKeywords.mockResolvedValue({
        short_name: [{
          value: 'ASF',
          subfields: ['long_name'],
          long_name: [{ value: 'Alaska Satellite Facility' }]
        }]
      })

      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'DATA_CENTERS')

      await user.click(await screen.findByText('Select Short Name'))
      await user.click(await screen.findByText('ASF'))

      // DataCenterField's own Short Name select is also a combobox -- Roles' is the one
      // rendered after it, so it's always the last of the two.
      await user.click(screen.getAllByRole('combobox').at(-1))
      await user.click(screen.getByRole('option', { name: 'ARCHIVER' }))

      await user.click(screen.getAllByRole('combobox').at(-1))
      await user.click(screen.getByRole('option', { name: 'DISTRIBUTOR' }))

      await user.click(screen.getByRole('button', { name: 'add' }))

      expect(screen.getByLabelText('updateValue JSON')).toHaveValue(JSON.stringify({
        ShortName: 'ASF',
        LongName: 'Alaska Satellite Facility',
        Roles: ['ARCHIVER', 'DISTRIBUTOR']
      }, null, 2))
    })

    test('picking only Roles, without a Short Name, keeps Add disabled instead of adding a blank-looking entry', async () => {
      fetchCmrKeywords.mockResolvedValue({
        short_name: [{
          value: 'ASF',
          subfields: ['long_name'],
          long_name: [{ value: 'Alaska Satellite Facility' }]
        }]
      })

      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'ADD_TO_EXISTING')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'DATA_CENTERS')

      // DataCenterField's own Short Name select is also a combobox -- Roles' is the one
      // rendered after it, so it's always the last of the two.
      await user.click(screen.getAllByRole('combobox').at(-1))
      await user.click(screen.getByRole('option', { name: 'ARCHIVER' }))

      // ShortName is required too (alongside Roles) -- picking only Roles must not be enough
      // to add an entry, since it would show up in the list with no ShortName/LongName to
      // display and would only fail Submit's own validation later.
      expect(screen.getByRole('button', { name: 'add' })).toBeDisabled()

      await user.click(await screen.findByText('Select Short Name'))
      await user.click(await screen.findByText('ASF'))

      expect(screen.getByRole('button', { name: 'add' })).not.toBeDisabled()

      await user.click(screen.getByRole('button', { name: 'add' }))

      expect(screen.getByLabelText('updateValue JSON')).toHaveValue(JSON.stringify([
        {
          ShortName: 'ASF',
          LongName: 'Alaska Satellite Facility',
          Roles: ['ARCHIVER']
        }
      ], null, 2))
    })

    test('picking the same Short Name and Roles as an already-added entry keeps Add disabled', async () => {
      fetchCmrKeywords.mockResolvedValue({
        short_name: [{
          value: 'ASF',
          subfields: ['long_name'],
          long_name: [{ value: 'Alaska Satellite Facility' }]
        }]
      })

      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'ADD_TO_EXISTING')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'DATA_CENTERS')

      await user.click(await screen.findByText('Select Short Name'))
      await user.click(await screen.findByText('ASF'))
      await user.click(screen.getAllByRole('combobox').at(-1))
      await user.click(screen.getByRole('option', { name: 'ARCHIVER' }))
      await user.click(screen.getByRole('button', { name: 'add' }))

      // ASF has already been added -- picking it again (with the same Roles) is a duplicate
      // of an existing entry, not a second distinct one.
      await user.click(await screen.findByText('Select Short Name'))
      await user.click(await screen.findByText('ASF'))
      await user.click(screen.getAllByRole('combobox').at(-1))
      await user.click(screen.getByRole('option', { name: 'ARCHIVER' }))

      expect(screen.getByRole('button', { name: 'add' })).toBeDisabled()
    })

    test('for a single-value action type, picking only Roles is enough to commit -- a partial merge does not need ShortName re-specified', async () => {
      fetchCmrKeywords.mockResolvedValue({
        short_name: [{
          value: 'ASF',
          subfields: ['long_name'],
          long_name: [{ value: 'Alaska Satellite Facility' }]
        }]
      })

      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'DATA_CENTERS')

      await user.click(screen.getAllByRole('combobox').at(-1))
      await user.click(screen.getByRole('option', { name: 'ARCHIVER' }))

      // FIND_AND_UPDATE only merges the fields actually specified onto the matched entry --
      // ShortName is required for a whole new/replaced entry (allowMultiple), not here, so
      // Select must not block committing a Roles-only pick the way Add does for those types.
      expect(screen.getByRole('button', { name: 'add' })).not.toBeDisabled()

      await user.click(screen.getByRole('button', { name: 'add' }))

      expect(screen.getByLabelText('updateValue JSON')).toHaveValue(JSON.stringify({
        Roles: ['ARCHIVER']
      }, null, 2))

      // The committed pick has no ShortName/LongName to identify it by -- it renders no chip
      // at all (rather than one with a confusing label), even though the pick itself is
      // valid and already reflected in the updateValue JSON above.
      expect(screen.queryByRole('img', { name: 'Remove' })).not.toBeInTheDocument()

      // Confirms the picker's own gating now actually agrees with Submit's validation --
      // this was the bug: the schema already allowed this, but the picker blocked it anyway.
      await user.type(
        screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }),
        'ASF'
      )

      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).not.toBeDisabled()
    })

    test('for a single-value action type, picking only Technique/NumberOfInstruments renders no chip either, for the same reason', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'INSTRUMENTS')

      await user.type(screen.getByLabelText('Technique'), 'Updated')
      await user.type(screen.getByLabelText('Number Of Instruments'), '3')
      await user.click(screen.getByRole('button', { name: 'add' }))

      expect(screen.getByLabelText('updateValue JSON')).toHaveValue(JSON.stringify({
        Characteristics: [],
        Technique: 'Updated',
        NumberOfInstruments: 3
      }, null, 2))

      expect(screen.queryByRole('img', { name: 'Remove' })).not.toBeInTheDocument()
    })
  })

  describe('when the updateValue JSON is invalid', () => {
    test('shows an error and disables the Submit button', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectFieldAndType(user)

      await user.type(
        screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }),
        'NASA/GSFC'
      )

      const editor = screen.getByLabelText('updateValue JSON')
      await user.clear(editor)
      await user.type(editor, '{{not valid json')

      expect(screen.getByText(/Invalid JSON:/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).toBeDisabled()
    })
  })

  describe('when a Data Center entry is missing Roles', () => {
    test('disables Submit for an action type that replaces the whole entry', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      // FIND_AND_REPLACE submits a whole replaced Data Center entry -- CMR's UMM-C schema
      // requires Roles on it, so leaving it at its unfilled skeleton default must block
      // Submit instead of letting CMR's own validation reject it after the fact.
      await selectFieldAndType(user)

      await user.type(
        screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }),
        'NASA/GSFC'
      )

      await fillUpdateValueJson(user, {
        ShortName: 'NASA/GSFC',
        LongName: 'Goddard Space Flight Center',
        Roles: []
      })

      expect(screen.getByText(/Roles must NOT have fewer than 1 items/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).toBeDisabled()
    })

    test('does not block Submit when Roles is left blank/untouched instead of nulled', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'DATA_CENTERS')

      await user.type(
        screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }),
        'NASA/GSFC'
      )

      await fillUpdateValueJson(user, { LongName: 'Goddard Space Flight Center' })

      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).not.toBeDisabled()
    })

    test('blocks Submit under a partial-merge action type too, since null is never valid for a required field', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'DATA_CENTERS')

      await user.type(
        screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }),
        'NASA/GSFC'
      )

      await fillUpdateValueJson(user, { Roles: null })

      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).toBeDisabled()
    })
  })

  describe('when a Data Center entry has ShortName explicitly set to null', () => {
    test('disables Submit for an action type that replaces the whole entry', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectFieldAndType(user)

      await user.type(
        screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }),
        'NASA/GSFC'
      )

      // ShortName is the other UMM-C required field on a Data Center (alongside Roles) --
      // an explicit null still has to be rejected, not just an empty string/skeleton default,
      // since `required` alone doesn't catch a present-but-null key.
      await fillUpdateValueJson(user, {
        ShortName: null,
        LongName: 'Goddard Space Flight Center',
        Roles: ['ARCHIVER']
      })

      expect(screen.getByText(/ShortName must be string/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).toBeDisabled()
    })

    test('blocks Submit under a partial-merge action type too, since null is never valid for a required field', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'DATA_CENTERS')

      await user.type(
        screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }),
        'NASA/GSFC'
      )

      await fillUpdateValueJson(user, { ShortName: null })

      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).toBeDisabled()
    })

    test('does not block Submit when ShortName is left blank/untouched instead of nulled', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'DATA_CENTERS')

      await user.type(
        screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }),
        'NASA/GSFC'
      )

      await fillUpdateValueJson(user, { LongName: 'Goddard Space Flight Center' })

      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).not.toBeDisabled()
    })
  })

  describe('when a Platform entry is missing ShortName or has it explicitly set to null', () => {
    test('disables Submit for an action type that replaces the whole entry', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'ADD_TO_EXISTING')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'PLATFORMS')

      // ShortName is PlatformType's own UMM-C required field -- a new entry missing it (or
      // with it explicitly nulled) would fail CMR's validation on submit.
      await fillUpdateValueJson(user, {
        ShortName: null,
        Type: 'Jet',
        LongName: 'Airbus A340-600'
      })

      expect(screen.getByText(/ShortName must be string/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).toBeDisabled()
    })

    test('blocks Submit under a partial-merge action type too, since null is never valid for a required field', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'PLATFORMS')

      await user.type(
        screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }),
        'A340-600'
      )

      await fillUpdateValueJson(user, { ShortName: null })

      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).toBeDisabled()
    })

    test('does not block Submit when ShortName is left blank/untouched instead of nulled', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'PLATFORMS')

      await user.type(
        screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }),
        'A340-600'
      )

      await fillUpdateValueJson(user, { LongName: 'Airbus A340-600' })

      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).not.toBeDisabled()
    })
  })

  describe('when an Instrument entry is missing ShortName or has it explicitly set to null', () => {
    test('disables Submit for an action type that replaces the whole entry', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'ADD_TO_EXISTING')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'INSTRUMENTS')

      // ShortName is InstrumentType's own UMM-C required field -- a new entry missing it (or
      // with it explicitly nulled) would fail CMR's validation on submit.
      await fillUpdateValueJson(user, {
        ShortName: null,
        LongName: 'Airborne Topographic Mapper'
      })

      expect(screen.getByText(/ShortName must be string/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).toBeDisabled()
    })

    test('blocks Submit under a partial-merge action type too, since null is never valid for a required field', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'INSTRUMENTS')

      await user.type(
        screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }),
        'ATM'
      )

      await fillUpdateValueJson(user, { ShortName: null })

      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).toBeDisabled()
    })

    test('does not block Submit when ShortName is left blank/untouched instead of nulled', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'INSTRUMENTS')

      await user.type(
        screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }),
        'ATM'
      )

      await fillUpdateValueJson(user, { LongName: 'Airborne Topographic Mapper' })

      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).not.toBeDisabled()
    })
  })

  describe('when a Science Keyword entry is missing Topic/Term or has a required field explicitly set to null', () => {
    test('disables Submit for an action type that replaces the whole entry', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'CLEAR_ALL_AND_REPLACE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'SCIENCE_KEYWORDS')

      // Category, Topic and Term are all required by ScienceKeywordType -- a new entry
      // missing Topic/Term would fail CMR's validation on submit.
      await fillUpdateValueJson(user, [{ Category: 'EARTH SCIENCE' }])

      expect(screen.getByText(/Topic must have required property 'Topic'/)).toBeInTheDocument()
      expect(screen.getByText(/Term must have required property 'Term'/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).toBeDisabled()
    })

    test('blocks Submit under a partial-merge action type too, since null is never valid for a required field', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'SCIENCE_KEYWORDS')

      await user.type(
        screen.getByLabelText('Category', { selector: '#bulk-actions-find-value_Category' }),
        'EARTH SCIENCE'
      )

      await fillUpdateValueJson(user, { Topic: null })

      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).toBeDisabled()
    })

    test('does not block Submit under a partial-merge action type when Topic/Term are left blank/untouched instead of nulled', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'SCIENCE_KEYWORDS')

      await user.type(
        screen.getByLabelText('Category', { selector: '#bulk-actions-find-value_Category' }),
        'EARTH SCIENCE'
      )

      // FIND_AND_UPDATE only merges the fields actually specified onto the matched entry --
      // Category/Term aren't required to be re-specified alongside Topic.
      await fillUpdateValueJson(user, { Topic: 'ATMOSPHERE' })

      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).not.toBeDisabled()
    })
  })

  describe('when a submission is already in flight', () => {
    test('disables the Submit button so it cannot be clicked again', async () => {
      const { user } = setup({
        mocks: [getCollectionsMock, createBulkUpdateDelayedMock]
      })

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectFieldAndType(user)

      await user.type(
        screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }),
        'NASA/GSFC'
      )

      await fillUpdateValueJson(user, {
        ShortName: 'NASA/GSFC',
        LongName: 'Goddard',
        Roles: ['ARCHIVER']
      })

      const submitButton = screen.getByRole('button', { name: 'Submit Bulk Action' })

      await user.click(submitButton)

      expect(submitButton).toBeDisabled()

      expect(await screen.findByText('Bulk Update Submitted')).toBeInTheDocument()
    })

    test('disables the Cancel button, since leaving would not actually stop the submission', async () => {
      const { user } = setup({
        mocks: [getCollectionsMock, createBulkUpdateDelayedMock]
      })

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectFieldAndType(user)

      await user.type(
        screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }),
        'NASA/GSFC'
      )

      await fillUpdateValueJson(user, {
        ShortName: 'NASA/GSFC',
        LongName: 'Goddard',
        Roles: ['ARCHIVER']
      })

      await user.click(screen.getByRole('button', { name: 'Submit Bulk Action' }))

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()

      expect(await screen.findByText('Bulk Update Submitted')).toBeInTheDocument()
    })
  })

  describe('when the bulk update is submitted successfully', () => {
    test('shows the submitted modal with the task id', async () => {
      const { user } = setup({
        mocks: [getCollectionsMock, createBulkUpdateMock]
      })

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectFieldAndType(user)

      await user.type(
        screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }),
        'NASA/GSFC'
      )

      await fillUpdateValueJson(user, {
        ShortName: 'NASA/GSFC',
        LongName: 'Goddard',
        Roles: ['ARCHIVER']
      })

      const submitButton = screen.getByRole('button', { name: 'Submit Bulk Action' })
      expect(submitButton).not.toBeDisabled()

      await user.click(submitButton)

      expect(await screen.findByText('Bulk Update Submitted')).toBeInTheDocument()
      expect(screen.getByText('BU-4439')).toBeInTheDocument()
    })

    test('View Job Status navigates to the task page', async () => {
      const { user } = setup({
        mocks: [getCollectionsMock, createBulkUpdateMock]
      })

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectFieldAndType(user)

      await user.type(
        screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }),
        'NASA/GSFC'
      )

      await fillUpdateValueJson(user, {
        ShortName: 'NASA/GSFC',
        LongName: 'Goddard',
        Roles: ['ARCHIVER']
      })

      await user.click(screen.getByRole('button', { name: 'Submit Bulk Action' }))
      await screen.findByText('Bulk Update Submitted')

      await user.click(screen.getByRole('button', { name: 'View Job Status' }))

      expect(await screen.findByText('Bulk actions task page')).toBeInTheDocument()
    })

    test('Close navigates to the bulk actions landing page', async () => {
      const { user } = setup({
        mocks: [getCollectionsMock, createBulkUpdateMock]
      })

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectFieldAndType(user)

      await user.type(
        screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }),
        'NASA/GSFC'
      )

      await fillUpdateValueJson(user, {
        ShortName: 'NASA/GSFC',
        LongName: 'Goddard',
        Roles: ['ARCHIVER']
      })

      await user.click(screen.getByRole('button', { name: 'Submit Bulk Action' }))
      await screen.findByText('Bulk Update Submitted')

      await user.click(screen.getByRole('button', { name: 'Close' }))

      expect(await screen.findByText('Bulk actions landing page')).toBeInTheDocument()
    })
  })

  describe('when the bulk update submission fails', () => {
    test('shows an error notification and calls errorLogger', async () => {
      const { user } = setup({
        mocks: [getCollectionsMock, createBulkUpdateErrorMock]
      })

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectFieldAndType(user)

      await user.type(
        screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }),
        'NASA/GSFC'
      )

      await fillUpdateValueJson(user, {
        ShortName: 'NASA/GSFC',
        LongName: 'Goddard',
        Roles: ['ARCHIVER']
      })

      await user.click(screen.getByRole('button', { name: 'Submit Bulk Action' }))

      expect(await screen.findByText('Error submitting bulk update')).toBeInTheDocument()
      expect(screen.queryByText('Bulk Update Submitted')).not.toBeInTheDocument()

      expect(errorLogger).toHaveBeenCalledTimes(1)
      expect(errorLogger).toHaveBeenCalledWith(
        new Error('An error occurred'),
        'Bulk Actions Edit Page: createBulkUpdateCollectionTask Mutation'
      )
    })
  })

  describe('Cancel and Submit Bulk Action visibility', () => {
    test('are hidden until both Target Field and Action Type are chosen', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))

      expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Submit Bulk Action' })).not.toBeInTheDocument()

      await user.selectOptions(screen.getByLabelText('Target Field'), 'DATA_CENTERS')

      // Target Field alone isn't enough -- Action Type is still blank.
      expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Submit Bulk Action' })).not.toBeInTheDocument()

      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE')

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).toBeInTheDocument()
    })
  })

  describe('when Cancel is clicked', () => {
    test('clears Target Field and Action Type instead of leaving the page', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectFieldAndType(user)

      await user.click(screen.getByRole('button', { name: 'Cancel' }))

      expect(screen.getByLabelText('Target Field')).toHaveValue('')
      expect(screen.getByLabelText('Action Type')).toHaveValue('')

      // Cleared back to blank, so Cancel/Submit are hidden again too.
      expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument()
      expect(screen.queryByText('All Collections page')).not.toBeInTheDocument()
    })

    test('does not clear the collection selection', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectFieldAndType(user)
      expect(screen.getByTestId('selection-count')).toHaveTextContent('1')

      await user.click(screen.getByRole('button', { name: 'Cancel' }))

      expect(screen.getByTestId('selection-count')).toHaveTextContent('1')
    })
  })

  describe('when leaving the page after a successful submit', () => {
    test('clears the collection selection', async () => {
      const { user } = setup({
        mocks: [getCollectionsMock, createBulkUpdateMock]
      })

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectFieldAndType(user)

      await user.type(
        screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }),
        'NASA/GSFC'
      )

      await fillUpdateValueJson(user, {
        ShortName: 'NASA/GSFC',
        LongName: 'Goddard',
        Roles: ['ARCHIVER']
      })

      await user.click(screen.getByRole('button', { name: 'Submit Bulk Action' }))
      await screen.findByText('Bulk Update Submitted')

      await user.click(screen.getByRole('button', { name: 'Close' }))
      await screen.findByText('Bulk actions landing page')

      expect(screen.getByTestId('selection-count')).toHaveTextContent('0')
    })
  })

  describe('Find and Update Home Page URL availability', () => {
    test('is not offered as an action type until Data Centers is the target field', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))

      expect(screen.queryByRole('option', { name: 'Find and Update Home Page URL' })).not.toBeInTheDocument()

      await user.selectOptions(screen.getByLabelText('Target Field'), 'SCIENCE_KEYWORDS')

      expect(screen.queryByRole('option', { name: 'Find and Update Home Page URL' })).not.toBeInTheDocument()

      await user.selectOptions(screen.getByLabelText('Target Field'), 'DATA_CENTERS')

      expect(screen.getByRole('option', { name: 'Find and Update Home Page URL' })).toBeInTheDocument()
    })

    test('resets the action type when the field changes away from Data Centers', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Target Field'), 'DATA_CENTERS')
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE_HOME_PAGE_URL')

      expect(screen.getByLabelText('Action Type')).toHaveValue('FIND_AND_UPDATE_HOME_PAGE_URL')

      await user.selectOptions(screen.getByLabelText('Target Field'), 'SCIENCE_KEYWORDS')

      expect(screen.getByLabelText('Action Type')).toHaveValue('')
    })
  })

  describe('when Find and Update Home Page URL is selected', () => {
    const selectHomePageUrlType = async (user) => {
      await user.selectOptions(screen.getByLabelText('Target Field'), 'DATA_CENTERS')
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE_HOME_PAGE_URL')
    }

    test('shows a Home Page URL input instead of the generic Replace With form', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectHomePageUrlType(user)

      expect(screen.getByLabelText('Home Page URL')).toBeInTheDocument()
      expect(screen.queryByText('Replace With')).not.toBeInTheDocument()
    })

    test('submits the constructed ContactInformation payload when a url is provided', async () => {
      const { user } = setup({
        mocks: [getCollectionsMock, createBulkUpdateHomePageUrlMock]
      })

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectHomePageUrlType(user)

      await user.type(screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }), 'NASA/GSFC')
      await user.type(screen.getByLabelText('Home Page URL'), 'https://example.gov')

      await user.click(screen.getByRole('button', { name: 'Submit Bulk Action' }))

      expect(await screen.findByText('BU-4440')).toBeInTheDocument()
    })

    test('allows submitting with a blank url, to remove the existing home page url', async () => {
      const { user } = setup({
        mocks: [getCollectionsMock, createBulkUpdateHomePageUrlRemovalMock]
      })

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectHomePageUrlType(user)

      await user.type(screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }), 'NASA/GSFC')

      const submitButton = screen.getByRole('button', { name: 'Submit Bulk Action' })
      expect(submitButton).not.toBeDisabled()

      await user.click(submitButton)

      expect(await screen.findByText('BU-4441')).toBeInTheDocument()
    })
  })

  describe('when the action type supports multiple update value entries', () => {
    test('allows adding more than one entry and submits an array when more than one is filled in', async () => {
      const { user } = setup({
        mocks: [getCollectionsMock, createBulkUpdateMultipleEntriesMock]
      })

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Target Field'), 'DATA_CENTERS')
      await user.selectOptions(screen.getByLabelText('Action Type'), 'ADD_TO_EXISTING')

      // The prepopulated skeleton is already wrapped in an array, since this action type
      // supports multiple entries -- editing it directly covers adding a second entry.
      expect(screen.getByLabelText('updateValue JSON')).toHaveValue(
        JSON.stringify([{
          ShortName: '',
          LongName: '',
          Roles: []
        }], null, 2)
      )

      await fillUpdateValueJson(user, [
        {
          ShortName: 'NASA/JPL',
          Roles: ['ARCHIVER']
        },
        {
          ShortName: 'NASA/MSFC',
          Roles: ['ARCHIVER']
        }
      ])

      await user.click(screen.getByRole('button', { name: 'Submit Bulk Action' }))

      expect(await screen.findByText('BU-4442')).toBeInTheDocument()
    })

    test('disables Submit again after adding then removing the only picked entry', async () => {
      fetchCmrKeywords.mockResolvedValue({
        basis: [
          {
            value: 'Air-based Platforms',
            subfields: ['category'],
            category: [
              {
                value: 'Jet',
                subfields: ['short_name'],
                short_name: [
                  {
                    value: 'A340-600',
                    subfields: ['long_name'],
                    long_name: [
                      { value: 'Airbus A340-600' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      })

      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'ADD_TO_EXISTING')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'PLATFORMS')

      await user.click(await screen.findByText('Select Short Name'))
      await user.click(await screen.findByText('A340-600'))
      await user.click(screen.getByRole('button', { name: 'add' }))

      const submitButton = screen.getByRole('button', { name: 'Submit Bulk Action' })
      expect(submitButton).not.toBeDisabled()

      // Removing leaves the JSON as `[]`, not the skeleton's placeholder shape -- both mean
      // "nothing to submit". Clicked via role "img" since the page also has an unrelated
      // "Remove" button for the selected-collections table.
      await user.click(screen.getByRole('img', { name: 'Remove' }))

      expect(screen.getByLabelText('updateValue JSON')).toHaveValue('[]')
      expect(submitButton).toBeDisabled()
    })

    test('prepopulates a single object, not an array, for an action type that does not support multiple entries', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Target Field'), 'DATA_CENTERS')
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_UPDATE')

      expect(screen.getByLabelText('updateValue JSON')).toHaveValue(
        JSON.stringify({
          ShortName: '',
          LongName: '',
          Roles: []
        }, null, 2)
      )
    })
  })

  describe('the DetailedVariable/DetailedLocation pre-submit check', () => {
    const selectScienceClearAll = async (user) => {
      await user.selectOptions(screen.getByLabelText('Action Type'), 'CLEAR_ALL_AND_REPLACE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'SCIENCE_KEYWORDS')
      await fillUpdateValueJson(user, [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'CLOUDS'
        }
      ])
    }

    test('submits immediately, without showing the review modal, when no value would be lost', async () => {
      const { user } = setup({
        mocks: [
          getCollectionsMock,
          getCollectionsDetailedKeywordsNoLossMock,
          createBulkUpdateScienceClearAllMock
        ]
      })

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectScienceClearAll(user)

      await user.click(screen.getByRole('button', { name: 'Submit Bulk Action' }))

      expect(await screen.findByText('Bulk Update Submitted')).toBeInTheDocument()
      expect(screen.queryByText('Review Before Submitting')).not.toBeInTheDocument()
    })

    test('shows "Checking collections…" while the check is in flight, then the review modal listing the affected collection', async () => {
      const { user } = setup({
        mocks: [getCollectionsMock, getCollectionsDetailedKeywordsScienceLossDelayedMock]
      })

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectScienceClearAll(user)

      const submitButton = screen.getByRole('button', { name: 'Submit Bulk Action' })

      await user.click(submitButton)

      expect(screen.getByRole('button', { name: 'Checking collections…' })).toBeDisabled()

      const dialog = await screen.findByRole('dialog')

      expect(within(dialog).getByText('Review Before Submitting')).toBeInTheDocument()
      expect(within(dialog).getByText(
        '1 of 1 selected collections have DetailedVariable values that this update will permanently remove.'
      )).toBeInTheDocument()

      expect(within(dialog).getByText('ShortName1')).toBeInTheDocument()
      expect(within(dialog).getByText(
        'EARTH SCIENCE > ATMOSPHERE > CLOUDS > DetailedVariable: Cloud Base Height'
      )).toBeInTheDocument()
    })

    test('words the count sentence differently for Find and Remove', async () => {
      const { user } = setup({
        mocks: [
          getCollectionsMock,
          getCollectionsDetailedKeywordsLocationLossMock,
          createBulkUpdateLocationFindAndRemoveMock
        ]
      })

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_REMOVE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'LOCATION_KEYWORDS')

      await user.type(
        screen.getByLabelText('Category', { selector: '#bulk-actions-find-value_Category' }),
        'CONTINENT'
      )

      await user.click(screen.getByRole('button', { name: 'Submit Bulk Action' }))

      const dialog = await screen.findByRole('dialog')

      expect(within(dialog).getByText(
        '1 of 1 selected collections have DetailedLocation values on a keyword this update will remove, which will delete them too.'
      )).toBeInTheDocument()

      await user.click(within(dialog).getByRole('button', { name: 'Submit Anyway' }))

      expect(await screen.findByText('Bulk Update Submitted')).toBeInTheDocument()
      expect(screen.getByText('BU-4452')).toBeInTheDocument()
    })

    test('Submit Anyway submits the bulk update unchanged, keeping the collection selected', async () => {
      const { user } = setup({
        mocks: [
          getCollectionsMock,
          getCollectionsDetailedKeywordsScienceLossMock,
          createBulkUpdateScienceClearAllMock
        ]
      })

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectScienceClearAll(user)

      await user.click(screen.getByRole('button', { name: 'Submit Bulk Action' }))

      const dialog = await screen.findByRole('dialog')

      await user.click(within(dialog).getByRole('button', { name: 'Submit Anyway' }))

      expect(await screen.findByText('Bulk Update Submitted')).toBeInTheDocument()
      expect(screen.getByText('BU-4450')).toBeInTheDocument()
      expect(screen.getByTestId('selection-count')).toHaveTextContent('1')
    })

    test('disables "Remove and submit" when every selected collection is affected, since CMR rejects an empty conceptIds list', async () => {
      const { user } = setup({
        mocks: [getCollectionsMock, getCollectionsDetailedKeywordsScienceLossMock]
      })

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectScienceClearAll(user)

      await user.click(screen.getByRole('button', { name: 'Submit Bulk Action' }))

      const dialog = await screen.findByRole('dialog')

      expect(within(dialog).getByRole('button', { name: 'Remove 1 collection and submit' })).toBeDisabled()
      expect(within(dialog).getByText(
        'Every selected collection is affected, so removing them all would leave none to submit.'
      )).toBeInTheDocument()
    })

    test('Back closes the review modal without submitting', async () => {
      const { user } = setup({
        mocks: [getCollectionsMock, getCollectionsDetailedKeywordsScienceLossMock]
      })

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectScienceClearAll(user)

      await user.click(screen.getByRole('button', { name: 'Submit Bulk Action' }))

      const dialog = await screen.findByRole('dialog')

      await user.click(within(dialog).getByRole('button', { name: 'Back' }))

      expect(screen.queryByText('Review Before Submitting')).not.toBeInTheDocument()
      expect(screen.queryByText('Bulk Update Submitted')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).not.toBeDisabled()
    })

    test('Remove N collection(s) and submit excludes the affected collection, deselects it, and submits the rest', async () => {
      const { user } = setup({
        mocks: [
          getCollectionsTwoMock,
          getCollectionsDetailedKeywordsTwoMock,
          createBulkUpdateScienceClearAllRemoveFilteredMock
        ]
      })

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.click(screen.getByRole('button', { name: 'Select second collection' }))
      await selectScienceClearAll(user)

      await user.click(screen.getByRole('button', { name: 'Submit Bulk Action' }))

      const dialog = await screen.findByRole('dialog')

      expect(within(dialog).getByText(
        '1 of 2 selected collections have DetailedVariable values that this update will permanently remove.'
      )).toBeInTheDocument()

      await user.click(within(dialog).getByRole('button', { name: 'Remove 1 collection and submit' }))

      expect(await screen.findByText('Bulk Update Submitted')).toBeInTheDocument()
      expect(screen.getByText('BU-4451')).toBeInTheDocument()
      expect(screen.getByTestId('selection-count')).toHaveTextContent('1')
    })

    test('shows an error modal offering only Back when the check itself fails', async () => {
      const { user } = setup({
        mocks: [getCollectionsMock, getCollectionsDetailedKeywordsErrorMock]
      })

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await selectScienceClearAll(user)

      await user.click(screen.getByRole('button', { name: 'Submit Bulk Action' }))

      const dialog = await screen.findByRole('dialog')

      expect(within(dialog).getByText(
        "We couldn't check the selected collections for DetailedVariable values."
      )).toBeInTheDocument()

      expect(within(dialog).getByRole('button', { name: 'Back' })).toBeInTheDocument()
      expect(within(dialog).queryByRole('button', { name: 'Submit Anyway' })).not.toBeInTheDocument()

      expect(errorLogger).toHaveBeenCalledWith(
        expect.any(Error),
        'Bulk Actions Edit Page: detailed keyword pre-submit check'
      )

      await user.click(within(dialog).getByRole('button', { name: 'Back' }))

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    test('does not run the check for ADD_TO_EXISTING, since nothing is ever removed', async () => {
      const createBulkUpdateScienceAddMock = {
        request: {
          query: CREATE_BULK_UPDATE_COLLECTION_TASK,
          variables: {
            conceptIds: ['C1-TESTPROV'],
            providerId: 'TESTPROV',
            updateField: 'SCIENCE_KEYWORDS',
            updateType: 'ADD_TO_EXISTING',
            findValue: undefined,
            updateValue: [
              {
                Category: 'EARTH SCIENCE',
                Topic: 'ATMOSPHERE',
                Term: 'CLOUDS'
              }
            ]
          }
        },
        result: {
          data: {
            createBulkUpdateCollectionTask: {
              taskId: 'BU-4453'
            }
          }
        }
      }

      const { user } = setup({
        // Deliberately no GET_COLLECTIONS_DETAILED_KEYWORDS mock -- if the check ran
        // anyway, the missing mock would surface as the check-failed error modal here
        // instead of submitting.
        mocks: [getCollectionsMock, createBulkUpdateScienceAddMock]
      })

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'ADD_TO_EXISTING')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'SCIENCE_KEYWORDS')
      await fillUpdateValueJson(user, [
        {
          Category: 'EARTH SCIENCE',
          Topic: 'ATMOSPHERE',
          Term: 'CLOUDS'
        }
      ])

      await user.click(screen.getByRole('button', { name: 'Submit Bulk Action' }))

      expect(await screen.findByText('Bulk Update Submitted')).toBeInTheDocument()
      expect(screen.queryByText('Review Before Submitting')).not.toBeInTheDocument()
    })
  })
})
