import React, { Suspense } from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'

import ummTSchema from '../../../schemas/umm/ummTSchema'
import toolsConfiguration from '../../../schemas/uiForms/toolsConfiguration'

import conceptTypeDraftQueries from '../../../constants/conceptTypeDraftQueries'

import DraftPreview from '../DraftPreview'
import PreviewProgress from '../../PreviewProgress/PreviewProgress'
import Providers from '../../../providers/Providers/Providers'
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary'
import MetadataPreview from '../../MetadataPreview/MetadataPreview'

vi.mock('../../../utils/createTemplate')
vi.mock('../../ErrorBanner/ErrorBanner')
vi.mock('../../PreviewProgress/PreviewProgress')
vi.mock('../../../utils/errorLogger')
vi.mock('../../MetadataPreview/MetadataPreview')

global.fetch = vi.fn()

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
  pageUrl = '/drafts/tools/TD1000000-MMT',
  path = '/drafts/tools'
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

  render(
    <Providers>
      <MockedProvider
        mocks={overrideMocks || mocks}
      >
        <MemoryRouter initialEntries={[pageUrl]}>
          <Routes>
            <Route
              path={path}
            >
              <Route
                path=":conceptId"
                element={
                  (
                    <ErrorBoundary>
                      <Suspense>
                        <DraftPreview />
                      </Suspense>
                    </ErrorBoundary>
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
    user: userEvent.setup()
  }
}

describe('DraftPreview', () => {
  describe('when the requests in a success', () => {
    test('renders a PreviewProgress and MetadataPreview component', async () => {
      setup({})

      await waitForResponse()

      expect(PreviewProgress).toHaveBeenCalledTimes(1)
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

      expect(MetadataPreview).toHaveBeenCalledTimes(1)
      expect(MetadataPreview).toHaveBeenCalledWith({
        conceptId: 'TD1000000-MMT',
        conceptType: 'Tool'
      }, {})
    })
  })
})
