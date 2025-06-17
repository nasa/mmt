import React from 'react'
import {
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import * as router from 'react-router'

import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import userEvent from '@testing-library/user-event'
import Providers from '../../../providers/Providers/Providers'
import TemplatePreview from '../TemplatePreview'
import PreviewProgress from '../../PreviewProgress/PreviewProgress'
import ErrorBanner from '../../ErrorBanner/ErrorBanner'

import deleteTemplate from '../../../utils/deleteTemplate'
import errorLogger from '../../../utils/errorLogger'
import getTemplate from '../../../utils/getTemplate'
import { INGEST_DRAFT } from '../../../operations/mutations/ingestDraft'

import staticConfig from '../../../../../../static.config.json'

vi.mock('../../../utils/getTemplate')
vi.mock('../../PreviewProgress/PreviewProgress')
vi.mock('../../../utils/errorLogger')
vi.mock('../../../utils/deleteTemplate')

vi.mock('../../ErrorBanner/ErrorBanner', () => ({ default: vi.fn(() => null) }))

const getConfig = () => staticConfig

const ummCVersion = getConfig().ummVersions.ummC

const setup = () => {
  const user = userEvent.setup()

  render(
    <Providers>
      <MockedProvider>
        <MemoryRouter initialEntries={['/templates/collections/1234-abcd-5678-efgh']}>
          <Routes>
            <Route
              element={<TemplatePreview />}
              path="templates/:templateType/:id"
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

const mutationSetup = ({ mocks }) => {
  const user = userEvent.setup()

  render(
    <Providers>
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={['/templates/collections/1234-abcd-5678-efgh']}>
          <Routes>
            <Route
              element={<TemplatePreview />}
              path="templates/:templateType/:id"
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

describe('TemplatePreview', () => {
  describe('when showing template preview', () => {
    test('render a template preview', async () => {
      getTemplate.mockReturnValue({
        response: {
          template: {
            TemplateName: 'Mock Template',
            ShortName: 'Template Form Test',
            Version: '1.0.0'
          },
          providerId: 'MMT-1'
        }
      })

      setup()

      await waitFor(() => {
        expect(PreviewProgress).toHaveBeenCalledWith(expect.objectContaining({
          draftJson: {
            TemplateName: 'Mock Template',
            ShortName: 'Template Form Test',
            Version: '1.0.0'
          },
          validationErrors: [
            {
              message: "must have required property 'EntryTitle'",
              name: 'required',
              params: {
                missingProperty: 'EntryTitle'
              },
              property: 'EntryTitle',
              schemaPath: '#/required',
              stack: "must have required property 'EntryTitle'"
            },
            {
              message: "must have required property 'Abstract'",
              name: 'required',
              params: {
                missingProperty: 'Abstract'
              },
              property: 'Abstract',
              schemaPath: '#/required',
              stack: "must have required property 'Abstract'"
            },
            {
              message: "must have required property 'DOI'",
              name: 'required',
              params: {
                missingProperty: 'DOI'
              },
              property: 'DOI',
              schemaPath: '#/required',
              stack: "must have required property 'DOI'"
            },
            {
              message: "must have required property 'DataCenters'",
              name: 'required',
              params: {
                missingProperty: 'DataCenters'
              },
              property: 'DataCenters',
              schemaPath: '#/required',
              stack: "must have required property 'DataCenters'"
            },
            {
              message: "must have required property 'ProcessingLevel'",
              name: 'required',
              params: {
                missingProperty: 'ProcessingLevel'
              },
              property: 'ProcessingLevel',
              schemaPath: '#/required',
              stack: "must have required property 'ProcessingLevel'"
            },
            {
              message: "must have required property 'ScienceKeywords'",
              name: 'required',
              params: {
                missingProperty: 'ScienceKeywords'
              },
              property: 'ScienceKeywords',
              schemaPath: '#/required',
              stack: "must have required property 'ScienceKeywords'"
            },
            {
              message: "must have required property 'TemporalExtents'",
              name: 'required',
              params: {
                missingProperty: 'TemporalExtents'
              },
              property: 'TemporalExtents',
              schemaPath: '#/required',
              stack: "must have required property 'TemporalExtents'"
            },
            {
              message: "must have required property 'SpatialExtent'",
              name: 'required',
              params: {
                missingProperty: 'SpatialExtent'
              },
              property: 'SpatialExtent',
              schemaPath: '#/required',
              stack: "must have required property 'SpatialExtent'"
            },
            {
              message: "must have required property 'Platforms'",
              name: 'required',
              params: {
                missingProperty: 'Platforms'
              },
              property: 'Platforms',
              schemaPath: '#/required',
              stack: "must have required property 'Platforms'"
            },
            {
              message: "must have required property 'CollectionProgress'",
              name: 'required',
              params: {
                missingProperty: 'CollectionProgress'
              },
              property: 'CollectionProgress',
              schemaPath: '#/required',
              stack: "must have required property 'CollectionProgress'"
            },
            {
              message: "must have required property 'MetadataSpecification'",
              name: 'required',
              params: {
                missingProperty: 'MetadataSpecification'
              },
              property: 'MetadataSpecification',
              schemaPath: '#/required',
              stack: "must have required property 'MetadataSpecification'"
            }
          ]
        }), {})
      })

      expect(PreviewProgress).toHaveBeenCalledTimes(1)
    })
  })

  describe('when showing template preview results in an error', () => {
    test('render a template preview', async () => {
      getTemplate.mockReturnValue({
        error: 'An error occurred'
      })

      setup()

      await waitFor(() => {
        expect(ErrorBanner).toHaveBeenCalledWith(expect.objectContaining({
          message: 'An error occurred'
        }), {})
      })

      expect(ErrorBanner).toHaveBeenCalledTimes(1)
    })
  })

  describe('showing the breadcrumbs', () => {
    test('renders the breadcrumbs', async () => {
      getTemplate.mockReturnValue({
        response: {}
      })

      setup()

      const breadcrumbs = await screen.findByRole('navigation', { name: 'breadcrumb' })
      const breadcrumbOne = within(breadcrumbs).getByText('Collection Templates')
      const breadcrumbTwo = within(breadcrumbs).getByText('<Blank Name>')

      expect(breadcrumbOne.href).toEqual('http://localhost:3000/templates/collections')
      expect(breadcrumbTwo).toHaveClass('active')
    })
  })

  describe('when clicking on  delete button', () => {
    describe('when clicking on Yes on the delete ', () => {
      test('should delete the template and navigate', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        getTemplate.mockReturnValue({
          response: {
            TemplateName: 'Mock Template',
            ShortName: 'Template Form Test',
            Version: '1.0.0'
          }
        })

        deleteTemplate.mockReturnValue({ response: { ok: true } })

        const { user } = setup()

        const deleteButton = await screen.findByRole('button', { name: /Delete/ })
        await user.click(deleteButton)

        expect(screen.getByText('Are you sure you want to delete this template?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        expect(deleteTemplate).toHaveBeenCalledTimes(1)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/templates/collections')
      })
    })

    describe('when clicking Yes on the delete modal results in a failure', () => {
      test('calls addNotification and errorLogger', async () => {
        getTemplate.mockReturnValue({
          response: {
            TemplateName: 'Mock Template',
            ShortName: 'Template Form Test',
            Version: '1.0.0'
          }
        })

        deleteTemplate.mockReturnValue({ response: { ok: false } })

        const { user } = setup()

        const deleteButton = await screen.findByRole('button', { name: /Delete/ })
        await user.click(deleteButton)

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith('Error deleting template', 'TemplatePreview: deleteTemplate')
      })
    })

    describe('when clicking No on the delete modal', () => {
      test('calls the deleteModal and clicks no', async () => {
        getTemplate.mockReturnValue({
          response: {
            TemplateName: 'Mock Template',
            ShortName: 'Template Form Test',
            Version: '1.0.0'
          }
        })

        const { user } = setup()

        const deleteButton = await screen.findByRole('button', { name: /Delete/ })
        await user.click(deleteButton)

        const noButton = screen.getByRole('button', { name: 'No' })
        await user.click(noButton)

        expect(deleteTemplate).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('Create Collection Draft button', () => {
    beforeEach(() => {
      getTemplate.mockReturnValue({
        response: {
          template: {
            TemplateName: 'Mock Template',
            ShortName: 'Template Form Test',
            Version: '1.0.0'
          },
          providerId: 'MMT_2'
        }
      })
    })

    describe('when clicking on create button results in a success', () => {
      test('should ingest a collectionDraft and navigate to collection draft', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = mutationSetup({
          mocks: [{
            request: {
              query: INGEST_DRAFT,
              variables: {
                conceptType: 'Collection',
                metadata: {
                  ShortName: 'Template Form Test',
                  Version: '1.0.0'
                },
                nativeId: 'MMT_mock-uuid',
                providerId: 'MMT_2',
                ummVersion: `${ummCVersion}`
              }
            },
            result: {
              data: {
                ingestDraft: {
                  conceptId: 'CD1000000-MMT',
                  revisionId: '1'
                }
              }
            }
          }]
        })

        const createButton = await screen.findByRole('button', { name: /Create Draft/ })
        await user.click(createButton)

        await waitFor(() => {
          expect(navigateSpy).toHaveBeenCalledWith('/drafts/collections/CD1000000-MMT')
        })

        expect(navigateSpy).toHaveBeenCalledTimes(1)
      })
    })

    describe('when clicking on create button results in a failure', () => {
      test('calls errorLogger', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = mutationSetup({
          mocks: [{
            request: {
              query: INGEST_DRAFT,
              variables: {
                conceptType: 'Collection',
                metadata: {
                  ShortName: 'Template Form Test',
                  Version: '1.0.0'
                },
                nativeId: 'MMT_mock-uuid',
                providerId: 'MMT_2',
                ummVersion: `${ummCVersion}`
              }
            },
            error: new Error('An error occurred')
          }]
        })

        const createButton = await screen.findByRole('button', { name: /Create Draft/ })
        await user.click(createButton)

        expect(navigateSpy).toHaveBeenCalledTimes(0)

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith('Unable to Ingest Draft', 'Template Preview: ingestDraft Mutation')
      })
    })
  })
})
