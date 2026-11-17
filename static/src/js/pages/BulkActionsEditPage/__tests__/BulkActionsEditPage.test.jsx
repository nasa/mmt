import React from 'react'
import { MockedProvider } from '@apollo/client/testing'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRoutesStub } from 'react-router'

import { GET_COLLECTIONS } from '@/js/operations/queries/getCollections'
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

// Rendered outside the routed page content, like CollectionSelectionBar is in production,
// so the selection context's state can be observed even after navigating away from the
// edit page.
const SelectionCountObserver = () => {
  const { selectedCollections } = useCollectionSelectionContext()

  return (
    <div data-testid="selection-count">{selectedCollections.length}</div>
  )
}

// A data router stub, rather than a plain MemoryRouter, since BulkActionsEditPage renders
// BulkActionsEditNavigationGuard, which uses useBlocker -- only supported by data routers.
const Stub = createRoutesStub([
  {
    path: '/:type/bulk-actions/edit',
    Component: BulkActionsEditPage
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
      // page itself -- leaving before clicking it exercises exactly that window.
      await user.click(screen.getByRole('button', { name: 'Cancel' }))
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
          "Delete a key or leave it blank to keep the existing value. Set it to null to remove it -- except a key marked required, which must always have a real value and can't be set to null."
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

    test('prepopulates NumberOfInstruments as an unquoted number for Instruments', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_REPLACE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'INSTRUMENTS')

      expect(screen.getByLabelText('updateValue JSON')).toHaveValue(
        JSON.stringify([{
          ShortName: '',
          LongName: '',
          Technique: '',
          NumberOfInstruments: 0,
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

      await fillUpdateValueJson(user, [{ Category: 'EARTH SCIENCE' }])

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

  describe('when Cancel is clicked', () => {
    test('navigates back to All Collections', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.click(screen.getByRole('button', { name: 'Cancel' }))

      expect(await screen.findByText('All Collections page')).toBeInTheDocument()
    })

    test('clears the collection selection', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      expect(screen.getByTestId('selection-count')).toHaveTextContent('1')

      await user.click(screen.getByRole('button', { name: 'Cancel' }))
      await screen.findByText('All Collections page')

      expect(screen.getByTestId('selection-count')).toHaveTextContent('0')
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
})
