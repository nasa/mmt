import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

import { MockedProvider } from '@apollo/client/testing'
import DraftList from '../DraftList'

import useAppContext from '../../../hooks/useAppContext'
import useDraftsQuery from '../../../hooks/useDraftsQuery'
import { DOWNLOAD_DRAFT } from '../../../operations/queries/getDownloadDraft'
import constructDownloadableFile from '../../../utils/constructDownloadableFile'

jest.mock('../../../hooks/useAppContext')
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
  useAppContext.mockReturnValue({ user: { providerId: 'MMT_2' } })

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

  const component = render(
    <MockedProvider
      mocks={mocks}
    >
      <BrowserRouter>
        <DraftList {...props} />
      </BrowserRouter>
    </MockedProvider>
  )

  return {
    component,
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
              previewMetadata: {
                name: 'Tool TD1200000092 short name',
                longName: 'Tool TD1200000092 long name',
                __typename: 'Tool'
              },
              __typename: 'Draft'
            },
            {
              conceptId: 'TD1200000093-MMT_2',
              revisionDate: '2023-11-08T17:56:09.385Z',
              previewMetadata: {
                __typename: 'Tool'
              },
              __typename: 'Draft'
            },
            {
              conceptId: 'TD1200000094-MMT_2',
              revisionDate: '2023-10-08T17:56:09.385Z',
              previewMetadata: {
                name: 'Tool TD1200000094 short name',
                longName: 'Tool TD1200000094 long name',
                __typename: 'Tool'
              },
              __typename: 'Draft'
            }
          ],
          __typename: 'DraftList'
        }
      })

      const { component } = setup()
      expect(component.container).toHaveTextContent('Showing all 3 Tool Drafts')
      expect(component.container).toHaveTextContent('Short Name')
      expect(component.container).toHaveTextContent('Entry Title')
      expect(component.container).toHaveTextContent('Last Modified')
      expect(component.container).toHaveTextContent('Download')
      expect(component.container).toHaveTextContent('12/8/2023')
      expect(component.container).toHaveTextContent('Tool TD1200000092 short name')
      expect(component.container).toHaveTextContent('Tool TD1200000092 long name')
      expect(component.container).toHaveTextContent('11/8/2023')
      expect(component.container).toHaveTextContent('No name provided')
      expect(component.container).toHaveTextContent('No longname provided')
      expect(component.container).toHaveTextContent('10/8/2023')
      expect(component.container).toHaveTextContent('Tool TD1200000094 short name')
      expect(component.container).toHaveTextContent('Tool TD1200000094 long name')
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

      const { component } = setup()
      expect(component.container).toHaveTextContent('No Tool drafts exist for the provider MMT_2.')
    })
  })

  describe('when draft type Tool is given, still loading', () => {
    test('renders Tool draft list', () => {
      useDraftsQuery.mockReturnValue({
        drafts: {},
        loading: true
      })

      const { component } = setup()
      const number = component.container.querySelectorAll('.placeholder-glow')
      expect(number.length).toBe(21)
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
        loading: true
      })

      const { component } = setup()
      expect(component.container).toHaveTextContent('Mock Network Error')
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
              previewMetadata: {
                name: 'Tool TD1000000-MMT short name',
                longName: 'Tool TD1000000-MMT long name',
                __typename: 'Tool'
              },
              __typename: 'Draft'
            }
          ],
          __typename: 'DraftList'
        }
      })

      const { user, component } = setup()

      const button = component.getByRole('button', { name: 'JSON' })
      await user.click(button)

      expect(constructDownloadableFile)
        .toBeCalledWith(
          JSON.stringify(mockDraft.ummMetadata, null, 2),
          'TD1000000-MMT'
        )
    })
  })
})
