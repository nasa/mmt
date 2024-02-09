import React from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'
import Placeholder from 'react-bootstrap/Placeholder'
import * as router from 'react-router'

import DraftList from '../DraftList'

import AppContext from '../../../context/AppContext'

import useDraftsQuery from '../../../hooks/useDraftsQuery'

import constructDownloadableFile from '../../../utils/constructDownloadableFile'

import { DOWNLOAD_DRAFT } from '../../../operations/queries/getDownloadDraft'

jest.mock('react-bootstrap/Placeholder', () => jest.fn())

jest.mock('../../../hooks/useDraftsQuery')
jest.mock('../../../utils/constructDownloadableFile')

const mockDraft = {
  conceptId: 'TD1000000-MMT',
  conceptType: 'tool-draft',
  ummMetadata: {
    LongName: 'Long Name',
    MetadataSpecification: {
      URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
      Name: 'UMM-T',
      Version: '1.1'
    }
  },
  __typename: 'Draft'
}

const setup = (overrideProps = {}) => {
  const mocks = [{
    request: {
      query: DOWNLOAD_DRAFT,
      variables: {
        params: {
          conceptId: 'TD1000000-MMT',
          conceptType: 'Tool'
        }
      }
    },
    result: {
      data: {
        draft: mockDraft
      }
    }
  }]

  const props = {
    draftType: 'Tool',
    ...overrideProps
  }

  render(
    <AppContext.Provider value={
      {
        user: {
          providerId: 'MMT_2'
        }
      }
    }
    >
      <MockedProvider
        mocks={mocks}
      >
        <BrowserRouter>
          <DraftList {...props} />
        </BrowserRouter>
      </MockedProvider>
    </AppContext.Provider>
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('DraftList', () => {
  describe('when draft type Tool is given', () => {
    test('renders Tool draft list', () => {
      useDraftsQuery.mockReturnValue({
        drafts: {
          count: 3,
          items: [
            {
              conceptId: 'TD1200000092-MMT_2',
              revisionDate: '2023-12-08T17:56:09.385Z',
              ummMetadata: {
                Name: 'Tool TD1200000092 short name',
                LongName: 'Tool TD1200000092 long name'
              },
              previewMetadata: {
                __typename: 'Tool'
              },
              __typename: 'Draft'
            },
            {
              conceptId: 'TD1200000093-MMT_2',
              revisionDate: '2023-11-08T17:56:09.385Z',
              ummMetadata: {},
              previewMetadata: {
                __typename: 'Tool'
              },
              __typename: 'Draft'
            },
            {
              conceptId: 'TD1200000094-MMT_2',
              revisionDate: '2023-10-08T17:56:09.385Z',
              ummMetadata: {
                Name: 'Tool TD1200000094 short name',
                LongName: 'Tool TD1200000094 long name'
              },
              previewMetadata: {
                __typename: 'Tool'
              },
              __typename: 'Draft'
            }
          ],
          __typename: 'DraftList'
        }
      })

      setup()

      expect(screen.getByRole('heading', {
        level: 2,
        value: 'MMT_2 Tool Drafts'
      })).toBeInTheDocument()

      const rows = screen.getAllByRole('row')

      expect(within(rows[1]).getByRole('cell', { name: 'Tool TD1200000092 short name' })).toBeInTheDocument()
      expect(within(rows[1]).getByRole('cell', { name: 'Tool TD1200000092 long name' })).toBeInTheDocument()
      expect(within(rows[1]).getByRole('cell', { name: '2023-12-08' })).toBeInTheDocument()
      expect(within(rows[1]).getByRole('button', { name: 'Download JSON' })).toBeInTheDocument()

      expect(within(rows[2]).getByRole('cell', { name: '<Blank Name>' })).toBeInTheDocument()
      expect(within(rows[2]).getByRole('cell', { name: '<Untitled Record>' })).toBeInTheDocument()
      expect(within(rows[2]).getByRole('cell', { name: '2023-11-08' })).toBeInTheDocument()
      expect(within(rows[2]).getByRole('button', { name: 'Download JSON' })).toBeInTheDocument()

      expect(within(rows[3]).getByRole('cell', { name: 'Tool TD1200000094 short name' })).toBeInTheDocument()
      expect(within(rows[3]).getByRole('cell', { name: 'Tool TD1200000094 long name' })).toBeInTheDocument()
      expect(within(rows[3]).getByRole('cell', { name: '2023-10-08' })).toBeInTheDocument()
      expect(within(rows[3]).getByRole('button', { name: 'Download JSON' })).toBeInTheDocument()
    })
  })

  describe('when draft type Tool is given but no Tool Draft found', () => {
    test('renders Tool draft list', () => {
      useDraftsQuery.mockReturnValue({
        drafts: {
          count: 0,
          items: [
          ],
          __typename: 'DraftList'
        }
      })

      setup()

      const rows = screen.getAllByRole('row')

      expect(within(rows[1]).getByRole('cell', {
        name: 'No Tool drafts exist for the provider MMT_2'
      })).toBeInTheDocument()
    })
  })

  describe('when draft type Tool is given, still loading', () => {
    test('renders Tool draft list', () => {
      useDraftsQuery.mockReturnValue({
        drafts: {},
        loading: true
      })

      setup()

      expect(Placeholder).toHaveBeenCalledTimes(17)
    })
  })

  describe('when draft type Tool is given, error shown', () => {
    test('renders Tool draft list', () => {
      useDraftsQuery.mockReturnValue({
        drafts: {},
        error: {
          networkError: {
            message: 'Mock Network Error'
          }
        },
        loading: false
      })

      setup()
      expect(screen.getByText('Mock Network Error')).toBeInTheDocument()
    })
  })

  describe('when clicking the New Tool Draft button', () => {
    test('navigates to the new tool form', async () => {
      const navigateSpy = jest.fn()
      jest.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup()

      const button = screen.getByRole('link', { name: 'New Tool Draft' })
      await user.click(button)

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('new', {
        replace: false
      })
    })
  })

  describe('when clicking the download json button', () => {
    test('downloads the draft', async () => {
      useDraftsQuery.mockReturnValue({
        drafts: {
          count: 1,
          items: [
            {
              conceptId: 'TD1000000-MMT',
              revisionDate: '2023-12-08T17:56:09.385Z',
              ummMetadata: {
                Name: 'Tool TD1000000-MMT short name',
                LongName: 'Tool TD1000000-MMT long name'
              },
              previewMetadata: {
                __typename: 'Tool'
              },
              __typename: 'Draft'
            }
          ],
          __typename: 'DraftList'
        }
      })

      const { user } = setup()

      const button = screen.getByRole('button', { name: 'Download JSON' })
      await user.click(button)

      expect(constructDownloadableFile).toHaveBeenCalledTimes(1)
      expect(constructDownloadableFile).toHaveBeenCalledWith(
        JSON.stringify(mockDraft.ummMetadata, null, 2),
        'TD1000000-MMT'
      )
    })
  })
})
