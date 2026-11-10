import React from 'react'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'
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
import errorLogger from '@/js/utils/errorLogger'

import BulkActionsEditPage from '../BulkActionsEditPage'

vi.mock('@/js/utils/errorLogger')

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
        LongName: 'Goddard'
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
        LongName: 'Goddard'
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
        { ShortName: 'NASA/JPL' },
        { ShortName: 'NASA/MSFC' }
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

    test('prepopulates the updateValue JSON with every field, Characteristics included, for Platforms', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_REPLACE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'PLATFORMS')

      // FIND_AND_REPLACE supports multiple entries, so the skeleton is array-wrapped.
      expect(screen.getByLabelText('updateValue JSON')).toHaveValue(
        JSON.stringify([{
          Type: '',
          ShortName: '',
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

      expect(screen.getByText('Update With')).toBeInTheDocument()
      expect(screen.queryByText('Replace With')).not.toBeInTheDocument()
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

      expect(screen.getByText(label)).toBeInTheDocument()
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

  describe('Science Keywords destructive update warnings', () => {
    // DetailedVariable itself now legitimately appears elsewhere on the page too (a Find
    // label, a key in the updateValue JSON skeleton), so these assertions match each type's
    // actual warning sentence rather than just the word, to avoid a false positive.
    test.each([
      ['FIND_AND_REPLACE', /DetailedVariable can be used to find Science Keywords entries.*Replace With/],
      ['FIND_AND_UPDATE', /DetailedVariable can be used to find Science Keywords entries.*Update With/],
      ['CLEAR_ALL_AND_REPLACE', /Existing Science Keywords entries may have a DetailedVariable value set/],
      ['FIND_AND_REMOVE', /DetailedVariable can be used to find Science Keywords entries/]
    ])('warns about DetailedVariable for %s', async (type, expectedWarning) => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), type)
      await user.selectOptions(screen.getByLabelText('Target Field'), 'SCIENCE_KEYWORDS')

      expect(screen.getByText(expectedWarning)).toBeInTheDocument()
    })

    test('does not warn for an action type that only appends new entries, since it never touches existing ones', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'ADD_TO_EXISTING')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'SCIENCE_KEYWORDS')

      expect(screen.queryByText(/can be used to find Science Keywords entries/)).not.toBeInTheDocument()
      expect(screen.queryByText(/may have a DetailedVariable value set/)).not.toBeInTheDocument()
    })

    test('does not warn for an unrelated field even with the same action type', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_REPLACE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'DATA_CENTERS')

      expect(screen.queryByText(/can be used to find Science Keywords entries/)).not.toBeInTheDocument()
    })

    test('renders below the Find section (its Additional Free-Text Criteria subsection) but above Replace With', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_REPLACE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'SCIENCE_KEYWORDS')

      const warning = screen.getByText(/DetailedVariable can be used to find/)
      const findHeading = screen.getByRole('heading', { name: 'Find' })
      const replaceWithHeading = screen.getByRole('heading', { name: 'Replace With' })

      expect(warning.compareDocumentPosition(findHeading))
        .toBe(Node.DOCUMENT_POSITION_PRECEDING)

      expect(warning.compareDocumentPosition(replaceWithHeading))
        .toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    })

    test('renders above the Replace With section even when there is no Find section', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'CLEAR_ALL_AND_REPLACE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'SCIENCE_KEYWORDS')

      const warning = screen.getByText(/may have a DetailedVariable value set/)
      const replaceWithHeading = screen.getByRole('heading', { name: 'Replace With' })

      expect(warning.compareDocumentPosition(replaceWithHeading))
        .toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    })
  })

  describe('Location Keywords destructive update warnings', () => {
    test.each([
      ['FIND_AND_REPLACE', /DetailedLocation can be used to find Location Keywords entries.*Replace With/],
      ['FIND_AND_UPDATE', /DetailedLocation can be used to find Location Keywords entries.*Update With/],
      ['CLEAR_ALL_AND_REPLACE', /Existing Location Keywords entries may have a DetailedLocation value set/],
      ['FIND_AND_REMOVE', /DetailedLocation can be used to find Location Keywords entries/]
    ])('warns about DetailedLocation for %s', async (type, expectedWarning) => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), type)
      await user.selectOptions(screen.getByLabelText('Target Field'), 'LOCATION_KEYWORDS')

      expect(screen.getByText(expectedWarning)).toBeInTheDocument()
    })

    test('does not warn for an action type that only appends new entries, since it never touches existing ones', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'ADD_TO_EXISTING')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'LOCATION_KEYWORDS')

      expect(screen.queryByText(/can be used to find Location Keywords entries/)).not.toBeInTheDocument()
      expect(screen.queryByText(/may have a DetailedLocation value set/)).not.toBeInTheDocument()
    })

    test('does not warn for an unrelated field even with the same action type', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_REPLACE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'DATA_CENTERS')

      expect(screen.queryByText(/can be used to find Location Keywords entries/)).not.toBeInTheDocument()
    })
  })

  describe('when a find value is invalid', () => {
    test('keeps the invalid input visible and disables Submit even though another field is filled', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: 'Select collection' }))
      await user.selectOptions(screen.getByLabelText('Action Type'), 'FIND_AND_REPLACE')
      await user.selectOptions(screen.getByLabelText('Target Field'), 'INSTRUMENTS')

      await user.type(
        screen.getByLabelText('ShortName', { selector: '#bulk-actions-find-value_ShortName' }),
        'MODIS'
      )

      await user.type(
        screen.getByLabelText(
          'NumberOfInstruments',
          { selector: '#bulk-actions-find-value_NumberOfInstruments' }
        ),
        '2.5'
      )

      expect(
        screen.getByLabelText(
          'NumberOfInstruments',
          { selector: '#bulk-actions-find-value_NumberOfInstruments' }
        )
      ).toHaveValue(2.5)

      expect(screen.getByText(/NumberOfInstruments must be a whole number/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Submit Bulk Action' })).toBeDisabled()
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
        LongName: 'Goddard'
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
        LongName: 'Goddard'
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
        LongName: 'Goddard'
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
        LongName: 'Goddard'
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
        LongName: 'Goddard'
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
        LongName: 'Goddard'
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
        LongName: 'Goddard'
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
        { ShortName: 'NASA/JPL' },
        { ShortName: 'NASA/MSFC' }
      ])

      await user.click(screen.getByRole('button', { name: 'Submit Bulk Action' }))

      expect(await screen.findByText('BU-4442')).toBeInTheDocument()
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
