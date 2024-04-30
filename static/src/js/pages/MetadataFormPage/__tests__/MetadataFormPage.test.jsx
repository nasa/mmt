import React, { Suspense } from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'

import { Cookies, CookiesProvider } from 'react-cookie'
import conceptTypeDraftQueries from '../../../constants/conceptTypeDraftQueries'

import MetadataFormPage from '../MetadataFormPage'
import Providers from '../../../providers/Providers/Providers'

vi.mock('../../ErrorBanner/ErrorBanner')
vi.mock('../../JsonPreview/JsonPreview')
vi.mock('../../FormNavigation/FormNavigation')
vi.mock('../../../utils/errorLogger')

global.fetch = vi.fn()

const mockedUsedNavigate = vi.fn()

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}))

Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => 'mock-uuid'
  }
})

const mockDraft = {
  conceptId: 'TD1000000-MMT',
  conceptType: 'tool-draft',
  deleted: false,
  name: 'Editing draft',
  nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
  providerId: 'MMT_2',
  revisionDate: '2023-12-08T16:14:28.177Z',
  revisionId: '2',
  ummMetadata: {
    LongName: 'Long Name',
    MetadataSpecification: {
      URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
      Name: 'UMM-T',
      Version: '1.1'
    }
  },
  previewMetadata: {
    accessConstraints: null,
    ancillaryKeywords: null,
    associationDetails: null,
    conceptId: 'TD1000000-MMT',
    contactGroups: null,
    contactPersons: null,
    description: null,
    doi: null,
    nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
    lastUpdatedDate: null,
    longName: 'Long Name',
    metadataSpecification: {
      url: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
      name: 'UMM-T',
      version: '1.1'
    },
    name: 'Updating draft',
    organizations: null,
    pageTitle: 'Updating draft',
    potentialAction: null,
    quality: null,
    relatedUrls: null,
    searchAction: null,
    supportedBrowsers: null,
    supportedInputFormats: null,
    supportedOperatingSystems: null,
    supportedOutputFormats: null,
    supportedSoftwareLanguages: null,
    toolKeywords: null,
    type: null,
    url: null,
    useConstraints: null,
    version: null,
    versionDescription: null,
    __typename: 'Tool'
  },
  __typename: 'Draft'
}

const setup = ({
  additionalMocks = [],
  overrideMocks = false,
  pageUrl = '/drafts/tools/TD1000000-MMT/tool-information'
}) => {
  const mocks = [{
    request: {
      query: conceptTypeDraftQueries.Tool,
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
  }, ...additionalMocks]

  let expires = new Date()
  expires.setMinutes(expires.getMinutes() + 15)
  expires = new Date(expires)

  const cookie = new Cookies(
    {
      loginInfo: ({
        providerId: 'MMT_2',
        name: 'User Name',
        token: {
          tokenValue: 'ABC-1',
          tokenExp: expires.valueOf()
        }
      })
    }
  )
  cookie.HAS_DOCUMENT_COOKIE = false

  render(
    <CookiesProvider defaultSetOptions={{ path: '/' }} cookies={cookie}>
      <Providers>
        <MockedProvider
          mocks={overrideMocks || mocks}
        >
          <MemoryRouter initialEntries={[pageUrl]}>
            <Routes>
              <Route
                path="/drafts/:draftType"
              >
                <Route
                  element={
                    (
                      <Suspense>
                        <MetadataFormPage />
                      </Suspense>
                    )
                  }
                  path="new"
                />
                <Route
                  path=":conceptId/:sectionName"
                  element={
                    (
                      <Suspense>
                        <MetadataFormPage />
                      </Suspense>
                    )
                  }
                />
              </Route>
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      </Providers>
    </CookiesProvider>
  )

  return {
    user: userEvent.setup()
  }
}

describe('MetadataFormPage', () => {
  describe('renders the breadcrumbs with form name', () => {
    test('renders a Form component', async () => {
      setup({
        pageUrl: '/drafts/tools/TD1000000-MMT/related-urls'
      })

      await waitForResponse()

      const breadcrumbs = screen.getByRole('navigation', { name: 'breadcrumb' })
      const breadcrumbOne = within(breadcrumbs).getAllByText('Edit Updating draft')

      expect(breadcrumbOne[1]).toHaveClass('active')
    })
  })

  describe('when rendering a new draft form', () => {
    test('renders the breadcrumbs with New Tool Draft', async () => {
      setup({
        overrideMocks: [],
        pageUrl: '/drafts/tools/new'
      })

      const breadcrumbs = screen.getByRole('navigation', { name: 'breadcrumb' })
      const breadcrumbOne = within(breadcrumbs).getByText('New Tool Draft')

      expect(breadcrumbOne).toHaveClass('active')
    })
  })

  describe('when rendering a existing draft with no name', () => {
    test('renders the breadcrumbs with <Blank Name>', async () => {
      setup({
        overrideMocks: [
          {
            request: {
              query: conceptTypeDraftQueries.Tool,
              variables: {
                params: {
                  conceptId: 'TD1000000-MMT',
                  conceptType: 'Tool'
                }
              }
            },
            result: {
              data: {
                draft: {
                  conceptId: 'TD1000000-MMT',
                  conceptType: 'tool-draft',
                  deleted: false,
                  name: 'null',
                  nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
                  providerId: 'MMT_2',
                  revisionDate: '2023-12-08T16:14:28.177Z',
                  revisionId: '2',
                  ummMetadata: {
                    LongName: 'Long Name',
                    MetadataSpecification: {
                      URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
                      Name: 'UMM-T',
                      Version: '1.1'
                    }
                  },
                  previewMetadata: {
                    accessConstraints: null,
                    ancillaryKeywords: null,
                    associationDetails: null,
                    conceptId: 'TD1000000-MMT',
                    contactGroups: null,
                    contactPersons: null,
                    description: null,
                    doi: null,
                    nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
                    lastUpdatedDate: null,
                    longName: 'Long Name',
                    metadataSpecification: {
                      url: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
                      name: 'UMM-T',
                      version: '1.1'
                    },
                    name: 'null',
                    organizations: null,
                    pageTitle: null,
                    potentialAction: null,
                    quality: null,
                    relatedUrls: null,
                    searchAction: null,
                    supportedBrowsers: null,
                    supportedInputFormats: null,
                    supportedOperatingSystems: null,
                    supportedOutputFormats: null,
                    supportedSoftwareLanguages: null,
                    toolKeywords: null,
                    type: null,
                    url: null,
                    useConstraints: null,
                    version: null,
                    versionDescription: null,
                    __typename: 'Tool'
                  },
                  __typename: 'Draft'
                }
              }
            }
          }
        ],
        pageUrl: '/drafts/tools/TD1000000-MMT/related-urls'
      })

      await waitForResponse()

      const breadcrumbs = screen.getByRole('navigation', { name: 'breadcrumb' })
      const breadcrumbOne = within(breadcrumbs).getAllByText('Edit <Blank Name>')

      expect(breadcrumbOne[1]).toHaveClass('active')
    })
  })
})
