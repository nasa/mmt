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

import conceptTypeDraftQueries from '@/js/constants/conceptTypeDraftQueries'

import Providers from '@/js/providers/Providers/Providers'

import MetadataFormPage from '../MetadataFormPage'

vi.mock('@/js/components/ErrorBanner/ErrorBanner')
vi.mock('@/js/components/JsonPreview/JsonPreview')
vi.mock('@/js/components/FormNavigation/FormNavigation')
vi.mock('@/js/utils/errorLogger')

const mockedUsedNavigate = vi.fn()

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}))

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
    revisionId: '2',
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

  const user = userEvent.setup()

  render(
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
  )

  return {
    user
  }
}

describe('MetadataFormPage', () => {
  describe('renders the breadcrumbs with form name', () => {
    test('renders the breadcrumbs', async () => {
      setup({
        pageUrl: '/drafts/tools/TD1000000-MMT/related-urls'
      })

      const breadcrumbParent = await screen.findByRole('navigation', { name: 'breadcrumb' })
      const breadcrumbLinks = within(breadcrumbParent).getAllByRole('link')

      expect(breadcrumbLinks.at(0)).toHaveAttribute('href', '/drafts/tools')
      expect(breadcrumbLinks.at(0)).toHaveTextContent('Tool Drafts')

      expect(breadcrumbLinks.at(1)).toHaveAttribute('href', '/drafts/tools/TD1000000-MMT')
      expect(breadcrumbLinks.at(1)).toHaveTextContent('Updating draft')

      const breadcrumbActive = within(breadcrumbParent).getByText('Edit Updating draft')
      expect(breadcrumbActive).toHaveClass('active')
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
                    revisionId: '2',
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

      const breadcrumbParent = await screen.findByRole('navigation', { name: 'breadcrumb' })
      const breadcrumbLinks = within(breadcrumbParent).getAllByRole('link')

      expect(breadcrumbLinks.at(0)).toHaveAttribute('href', '/drafts/tools')
      expect(breadcrumbLinks.at(0)).toHaveTextContent('Tool Drafts')

      expect(breadcrumbLinks.at(1)).toHaveAttribute('href', '/drafts/tools/TD1000000-MMT')
      expect(breadcrumbLinks.at(1)).toHaveTextContent('<Blank Name>')

      const breadcrumbActive = within(breadcrumbParent).getByText('Edit <Blank Name>')
      expect(breadcrumbActive).toHaveClass('active')
    })
  })

  describe('when draft is null', () => {
    test('renders the page', async () => {
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
                draft: null
              }
            }
          }
        ],
        pageUrl: '/drafts/tools/TD1000000-MMT/tool-information'
      })

      const breadcrumbParent = await screen.findByRole('navigation', { name: 'breadcrumb' })
      const breadcrumbLinks = within(breadcrumbParent).getAllByRole('link')

      expect(breadcrumbLinks.at(0)).toHaveAttribute('href', '/drafts/tools')
      expect(breadcrumbLinks.at(0)).toHaveTextContent('Tool Drafts')
    })
  })
})
