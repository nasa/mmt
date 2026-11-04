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

import BulkActionsEditPage from '../BulkActionsEditPage'

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
  }
])

const setup = ({ mocks = [getCollectionsMock] } = {}) => {
  const user = userEvent.setup()

  render(
    <MockedProvider mocks={mocks}>
      <NotificationsContextProvider>
        <CollectionSelectionContextProvider>
          <PreSelectCollection />
          <SelectionCountObserver />
          <Notifications />
          <Stub initialEntries={['/collections/bulk-actions/edit']} />
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
