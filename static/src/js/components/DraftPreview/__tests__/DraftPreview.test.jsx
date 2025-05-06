import React, { Suspense } from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'

import ummTSchema from '@/js/schemas/umm/ummTSchema'
import toolsConfiguration from '@/js/schemas/uiForms/toolsConfiguration'

import conceptTypeDraftQueries from '@/js/constants/conceptTypeDraftQueries'

import Providers from '@/js/providers/Providers/Providers'

import PreviewProgress from '@/js/components/PreviewProgress/PreviewProgress'
import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import MetadataPreview from '@/js/components/MetadataPreview/MetadataPreview'

import DraftPreview from '../DraftPreview'

vi.mock('@/js/utils/createTemplate')
vi.mock('@/js/components/ErrorBanner/ErrorBanner')
vi.mock('@/js/components/PreviewProgress/PreviewProgress')
vi.mock('@/js/utils/errorLogger')
vi.mock('@/js/components/MetadataPreview/MetadataPreview')

const mockedUsedNavigate = vi.fn()

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}))

const mockDraft = {
  conceptId: 'TD1000000-MMT',
  conceptType: 'tool-draft',
  deleted: false,
  name: null,
  nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
  providerId: 'MMT_2',
  revisionDate: '2023-12-08T16:14:28.177Z',
  revisionId: '2',
  ummMetadata: {
    MetadataSpecification: {
      URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
      Name: 'UMM-T',
      Version: '1.1'
    },
    LongName: 'Long Name'
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
    name: null,
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

const mockErrorDraft = {
  conceptId: 'TD1000000-MMT',
  conceptType: 'tool-draft',
  deleted: false,
  name: null,
  nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
  providerId: 'MMT_2',
  revisionDate: '2023-12-08T16:14:28.177Z',
  revisionId: '2',
  ummMetadata: {
    errors: 'concept not found in DB'
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
    name: null,
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

const setup = ({
  additionalMocks = [],
  overrideMocks = false,
  pageUrl = '/tools/TD1000000-MMT',
  path = '/:draftType/:conceptId'
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
              path={path}
              element={
                (
                  <ErrorBoundary>
                    <Suspense fallback={<div>Loading...</div>}>
                      <DraftPreview />
                    </Suspense>
                  </ErrorBoundary>
                )
              }
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    </Providers>
  )

  return {
    user
  }
}

describe('DraftPreview', () => {
  describe('when the requests in a success', () => {
    test('renders a PreviewProgress and MetadataPreview component', async () => {
      setup({})

      await waitFor(() => {
        expect(PreviewProgress).toHaveBeenCalledWith({
          draftJson: {
            LongName: 'Long Name',
            MetadataSpecification: {
              Name: 'UMM-T',
              URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.1',
              Version: '1.1'
            }
          },
          schema: ummTSchema,
          sections: toolsConfiguration,
          validationErrors: [{
            name: 'required',
            property: 'Name',
            message: "must have required property 'Name'",
            params: { missingProperty: 'Name' },
            stack: "must have required property 'Name'",
            schemaPath: '#/required'
          }, {
            name: 'required',
            property: 'Type',
            message: "must have required property 'Type'",
            params: { missingProperty: 'Type' },
            stack: "must have required property 'Type'",
            schemaPath: '#/required'
          }, {
            name: 'required',
            property: 'Version',
            message: "must have required property 'Version'",
            params: { missingProperty: 'Version' },
            stack: "must have required property 'Version'",
            schemaPath: '#/required'
          }, {
            name: 'required',
            property: 'Description',
            message: "must have required property 'Description'",
            params: { missingProperty: 'Description' },
            stack: "must have required property 'Description'",
            schemaPath: '#/required'
          }, {
            name: 'required',
            property: 'ToolKeywords',
            message: "must have required property 'ToolKeywords'",
            params: { missingProperty: 'ToolKeywords' },
            stack: "must have required property 'ToolKeywords'",
            schemaPath: '#/required'
          }, {
            name: 'required',
            property: 'Organizations',
            message: "must have required property 'Organizations'",
            params: { missingProperty: 'Organizations' },
            stack: "must have required property 'Organizations'",
            schemaPath: '#/required'
          }, {
            name: 'required',
            property: 'URL',
            message: "must have required property 'URL'",
            params: { missingProperty: 'URL' },
            stack: "must have required property 'URL'",
            schemaPath: '#/required'
          }, {
            name: 'enum',
            property: '.MetadataSpecification.URL',
            message: 'must be equal to one of the allowed values',
            params: { allowedValues: ['https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0'] },
            stack: '.MetadataSpecification.URL must be equal to one of the allowed values',
            schemaPath: '#/definitions/MetadataSpecificationType/properties/URL/enum'
          }, {
            name: 'enum',
            property: '.MetadataSpecification.Version',
            message: 'must be equal to one of the allowed values',
            params: { allowedValues: ['1.2.0'] },
            stack: '.MetadataSpecification.Version must be equal to one of the allowed values',
            schemaPath: '#/definitions/MetadataSpecificationType/properties/Version/enum'
          }]
        }, {})
      })

      expect(PreviewProgress).toHaveBeenCalledTimes(1)

      expect(MetadataPreview).toHaveBeenCalledTimes(1)
      expect(MetadataPreview).toHaveBeenCalledWith({
        conceptId: 'TD1000000-MMT',
        conceptType: 'Tool'
      }, {})
    })
  })

  describe('when cmr takes longer than react to populate', () => {
    test('renders a refresh page banner', async () => {
      setup({
        overrideMocks: [{
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
              draft: mockErrorDraft
            }
          }
        }]
      })

      expect(await screen.findByText('This record does not exist in CMR, please contact support@earthdata.nasa.gov if you believe this is an error.')).toBeVisible()
    })
  })
})
