import React from 'react'
import {
  MemoryRouter,
  Navigate,
  Route,
  Routes,
  useParams
} from 'react-router'
import { render, screen } from '@testing-library/react'
import DraftPreview from '../../../components/DraftPreview/DraftPreview'
import MetadataForm from '../../../components/MetadataForm/MetadataForm'
import TemplatesPage from '../TemplatesPage'
import TemplateList from '../../../components/TemplateList/TemplateList'

vi.mock('../../../components/TemplateList/TemplateList')
vi.mock('../../../components/DraftPreview/DraftPreview')
vi.mock('../../../components/MetadataForm/MetadataForm')

vi.mock('react-router', async () => ({
  ...await vi.importActual('react-router'),
  Navigate: vi.fn()
}))

DraftPreview.mockImplementation(() => {
  const { id } = useParams()

  return (
    <span>
      Template ID:
      {' '}
      {id}
    </span>
  )
})

MetadataForm.mockImplementation(() => {
  const { id, sectionName, fieldName } = useParams()

  return (
    <>
      {
        id && (
          <span>
            Template ID:
            {' '}
            {id}
          </span>
        )
      }
      {
        sectionName && (
          <span>
            Section Name:
            {' '}
            {sectionName}
          </span>
        )
      }
      {
        fieldName && (
          <span>
            Field Name:
            {' '}
            {fieldName}
          </span>
        )
      }
    </>
  )
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe('TemplatesPage component', () => {
  describe('when rendering the index route', () => {
    describe('when the template type is invalid', () => {
      test('renders the 404 page', async () => {
        render(
          <MemoryRouter initialEntries={
            [{
              pathname: '/templates/asdf',
              search: ''
            }]
          }
          >
            <Routes>
              <Route path="/templates/:templateType/*" element={<TemplatesPage />} />
            </Routes>
          </MemoryRouter>
        )

        expect(TemplateList).toHaveBeenCalledTimes(0)
        expect(Navigate).toHaveBeenCalledTimes(1)
        expect(Navigate).toHaveBeenCalledWith(
          {
            replace: true,
            to: '/404'
          },
          {}
        )
      })
    })

    describe('when the template type is valid', () => {
      test('renders the collection template list page', async () => {
        render(
          <MemoryRouter initialEntries={
            [{
              pathname: '/templates/collections',
              search: ''
            }]
          }
          >
            <Routes>
              <Route path="/templates/:templateType/*" element={<TemplatesPage />} />
            </Routes>
          </MemoryRouter>
        )

        expect(TemplateList).toHaveBeenCalledTimes(1)
        expect(TemplateList).toHaveBeenCalledWith({ templateType: 'Collection' }, {})
      })
    })
  })

  describe('when a template id is provided', () => {
    test('renders the DraftPreview', async () => {
      render(
        <MemoryRouter initialEntries={
          [{
            pathname: '/templates/collections/test-template',
            search: ''
          }]
        }
        >
          <Routes>
            <Route path="/templates/:templateType/*" element={<TemplatesPage />} />
          </Routes>
        </MemoryRouter>
      )

      expect(DraftPreview).toHaveBeenCalledTimes(1)
      expect(DraftPreview).toHaveBeenCalledWith({}, {})
      expect(screen.queryByText('Template ID: test-template')).toBeInTheDocument()
    })
  })

  describe('when a template id and a section name is provided', () => {
    test('render the metadata form', async () => {
      render(
        <MemoryRouter initialEntries={
          [{
            pathname: '/templates/collections/test-template/testSection',
            search: ''
          }]
        }
        >
          <Routes>
            <Route path="/templates/:templateType/*" element={<TemplatesPage />} />
          </Routes>
        </MemoryRouter>
      )

      expect(MetadataForm).toHaveBeenCalledTimes(1)
      expect(MetadataForm).toHaveBeenCalledWith({}, {})
      expect(screen.queryByText('Template ID: test-template')).toBeInTheDocument()
      expect(screen.queryByText('Section Name: testSection')).toBeInTheDocument()
    })
  })

  describe('when a template id, section name and field name are provided', () => {
    test('render the metadata form', async () => {
      render(
        <MemoryRouter initialEntries={
          [{
            pathname: '/templates/collections/test-template/testSection/testField',
            search: ''
          }]
        }
        >
          <Routes>
            <Route path="/templates/:templateType/*" element={<TemplatesPage />} />
          </Routes>
        </MemoryRouter>
      )

      expect(MetadataForm).toHaveBeenCalledTimes(1)
      expect(MetadataForm).toHaveBeenCalledWith({}, {})
      expect(screen.queryByText('Template ID: test-template')).toBeInTheDocument()
      expect(screen.queryByText('Section Name: testSection')).toBeInTheDocument()
      expect(screen.queryByText('Field Name: testField')).toBeInTheDocument()
    })
  })
})
