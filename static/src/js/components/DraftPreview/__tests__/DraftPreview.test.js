import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'
import { ToolPreview } from '@edsc/metadata-preview'
import * as router from 'react-router'

import ummTSchema from '../../../schemas/umm/ummTSchema'
import toolsConfiguration from '../../../schemas/uiForms/toolsConfiguration'

import { DELETE_DRAFT } from '../../../operations/mutations/deleteDraft'

import conceptTypeDraftQueries from '../../../constants/conceptTypeDraftQueries'

import errorLogger from '../../../utils/errorLogger'

import DraftPreview from '../DraftPreview'
import ErrorBanner from '../../ErrorBanner/ErrorBanner'
import PreviewProgress from '../../PreviewProgress/PreviewProgress'
import Providers from '../../../providers/Providers/Providers'

jest.mock('@edsc/metadata-preview')
jest.mock('../../ErrorBanner/ErrorBanner')
jest.mock('../../PreviewProgress/PreviewProgress')
jest.mock('../../../utils/errorLogger')

const mockedUsedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
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
  overrideMocks = false
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
    <MockedProvider
      mocks={overrideMocks || mocks}
    >
      <Providers>
        <MemoryRouter initialEntries={['/drafts/tools/TD1000000-MMT']}>
          <Routes>
            <Route
              path="/drafts/tools"
            >
              <Route
                path=":conceptId"
                element={<DraftPreview />}
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </Providers>
    </MockedProvider>
  )

  return {
    user: userEvent.setup()
  }
}

describe('DraftPreview', () => {
  describe('when the concept type is tool', () => {
    test('renders a ToolPreview component', async () => {
      setup({})

      await waitForResponse()

      expect(ToolPreview).toHaveBeenCalledTimes(1)
      expect(ToolPreview).toHaveBeenCalledWith({
        conceptId: 'TD1000000-MMT',
        conceptType: 'tool-draft',
        conceptUrlTemplate: '/{conceptType}/{conceptId}',
        isPlugin: true,
        tool: mockDraft.previewMetadata
      }, {})
    })
  })

  test('renders a PreviewProgress component', async () => {
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
  })

  describe('when the request results in an error', () => {
    test('calls errorLogger and renders an ErrorBanner', async () => {
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
            error: new Error('An error occurred')
          }
        ]
      })

      await waitForResponse()

      expect(errorLogger).toHaveBeenCalledTimes(1)
      expect(errorLogger).toHaveBeenCalledWith(new Error('An error occurred'), 'DraftPreview: getDraft Query')

      expect(ErrorBanner).toHaveBeenCalledTimes(1)
      expect(ErrorBanner).toHaveBeenCalledWith(expect.objectContaining({
        message: 'An error occurred'
      }), {})
    })
  })

  describe('when the draft could not be returned after 5', () => {
    test('calls errorLogger and renders an ErrorBanner', async () => {
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
        ]
      })

      await waitForResponse()

      expect(errorLogger).toHaveBeenCalledTimes(1)
      expect(errorLogger).toHaveBeenCalledWith('Max retries allowed', 'DraftPreview: getDraft Query')

      expect(ErrorBanner).toHaveBeenCalledTimes(1)
      expect(ErrorBanner).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Draft could not be loaded.'
      }), {})
    })
  })

  describe('no draft could be loaded', () => {
    // Skipping because MockedProvider doesn't seem to be able to provide different results to the same query
    test.skip('calls getDraft again', async () => {
      setup([], [{
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
      }, {
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
      }])

      await waitForResponse()
      await waitForResponse()

      expect(screen.queryByText('Loading')).not.toBeInTheDocument()

      expect(PreviewProgress).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the loaded draft is not the correct revisionId', () => {
    // Skipping because MockedProvider doesn't seem to be able to provide different results to the same query
    // Also don't know how to mock savedDraft effectively
    test.skip('calls getDraft again', async () => {
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
              draft: {
                ...mockDraft,
                // A previous revisionId from the savedDraft
                revisionId: '1'
              }
            }
          }
        }, {
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
        }]
      })

      await waitForResponse()

      expect(screen.queryByText('Loading')).not.toBeInTheDocument()

      expect(PreviewProgress).toHaveBeenCalledTimes(1)
    })
  })

  describe('when there is an error loading the draft', () => {
    test('displays an ErrorBanner', async () => {
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
          error: new Error('An error occurred')
        }]
      })

      await waitForResponse()

      expect(ErrorBanner).toHaveBeenCalledTimes(1)
      expect(ErrorBanner).toHaveBeenCalledWith(expect.objectContaining({
        message: 'An error occurred'
      }), {})
    })
  })

  describe('when clicking the Delete button', () => {
    test('shows the DeleteDraftModal', async () => {
      const { user } = setup({})

      await waitForResponse()

      const button = screen.getByRole('link', { name: 'Delete Tool Draft' })
      await user.click(button)

      expect(screen.getByText('Are you sure you want to delete this draft?')).toBeInTheDocument()
    })

    describe('when clicking the Yes button in the modal', () => {
      test('calls the deleteDraft mutation and navigates to the manage/tools page', async () => {
        const navigateSpy = jest.fn()
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          additionalMocks: [{
            request: {
              query: DELETE_DRAFT,
              variables: {
                conceptType: 'Tool',
                nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
                providerId: 'MMT_2'
              }
            },
            result: {
              data: {
                deleteDraft: {
                  conceptId: 'TD1000000-MMT',
                  revisionId: '2'
                }
              }
            }
          }]
        })

        await waitForResponse()

        const button = screen.getByRole('link', { name: 'Delete Tool Draft' })
        await user.click(button)

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        await waitForResponse()

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/manage/tools')
      })
    })

    describe('when clicking the Yes button in the modal results in an error', () => {
      test('calls addNotification and errorLogger', async () => {
        const navigateSpy = jest.fn()
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          additionalMocks: [{
            request: {
              query: DELETE_DRAFT,
              variables: {
                conceptType: 'Tool',
                nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
                providerId: 'MMT_2'
              }
            },
            error: new Error('An error occurred')
          }]
        })

        await waitForResponse()

        const button = screen.getByRole('link', { name: 'Delete Tool Draft' })
        await user.click(button)

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        await waitForResponse()

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith(new Error('An error occurred'), 'DraftPreview: deleteDraftMutation')
      })
    })

    describe('when clicking the No button in the modal', () => {
      test('calls the deleteDraft mutation and navigates to the manage/tools page', async () => {
        const navigateSpy = jest.fn()
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          additionalMocks: [{
            request: {
              query: DELETE_DRAFT,
              variables: {
                conceptType: 'Tool',
                nativeId: 'MMT_2331e312-cbbc-4e56-9d6f-fe217464be2c',
                providerId: 'MMT_2'
              }
            },
            result: {
              data: {
                deleteDraft: {
                  conceptId: 'TD1000000-MMT',
                  revisionId: '2'
                }
              }
            }
          }]
        })

        await waitForResponse()

        const button = screen.getByRole('link', { name: 'Delete Tool Draft' })
        await user.click(button)

        const noButton = screen.getByRole('button', { name: 'No' })
        await user.click(noButton)

        await waitForResponse()

        expect(screen.queryByText('Are you sure you want to delete this draft?')).not.toBeInTheDocument()

        expect(navigateSpy).toHaveBeenCalledTimes(0)
      })
    })
  })
})
