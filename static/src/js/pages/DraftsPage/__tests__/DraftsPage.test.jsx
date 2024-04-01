import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  MemoryRouter,
  Route,
  Routes,
  Navigate,
  useParams
} from 'react-router'

import DraftsPage from '../DraftsPage'
import DraftList from '../../../components/DraftList/DraftList'
import DraftPreview from '../../../components/DraftPreview/DraftPreview'
import MetadataForm from '../../../components/MetadataForm/MetadataForm'

vi.mock('../../../components/DraftList/DraftList')
vi.mock('../../../components/DraftPreview/DraftPreview')
vi.mock('../../../components/MetadataForm/MetadataForm')

vi.mock('react-router', async () => ({
  ...await vi.importActual('react-router'),
  Navigate: vi.fn()
}))

DraftPreview.mockImplementation(() => {
  const { conceptId } = useParams()

  return (
    <span>
      Concept ID:
      {' '}
      {conceptId}
    </span>
  )
})

MetadataForm.mockImplementation(() => {
  const { conceptId, sectionName, fieldName } = useParams()

  return (
    <>
      {
        conceptId && (
          <span>
            Concept ID:
            {' '}
            {conceptId}
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

describe('DraftsPage component', () => {
  describe('when rendering the index route', () => {
    describe('when the draft type is invalid', () => {
      test('renders the 404 page', async () => {
        render(
          <MemoryRouter initialEntries={
            [{
              pathname: '/drafts/asdf',
              search: ''
            }]
          }
          >
            <Routes>
              <Route path="/drafts/:draftType/*" element={<DraftsPage />} />
            </Routes>
          </MemoryRouter>
        )

        // Renders the default route
        expect(DraftList).toHaveBeenCalledTimes(0)
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

    describe('when the draft type is valid', () => {
      test('renders the tool drafts list page', async () => {
        render(
          <MemoryRouter initialEntries={
            [{
              pathname: '/drafts/tools',
              search: ''
            }]
          }
          >
            <Routes>
              <Route path="/drafts/:draftType/*" element={<DraftsPage />} />
            </Routes>
          </MemoryRouter>
        )

        // Renders the default route
        expect(DraftList).toHaveBeenCalledTimes(1)
        expect(DraftList).toHaveBeenCalledWith({ draftType: 'Tool' }, {})
      })
    })
  })

  describe('when rendering the index route', () => {
    test('when a conceptId is provided', () => {
      render(
        <MemoryRouter initialEntries={
          [{
            pathname: '/drafts/tools/TD100000000',
            search: ''
          }]
        }
        >
          <Routes>
            <Route path="/drafts/:draftType/*" element={<DraftsPage />} />
          </Routes>
        </MemoryRouter>
      )

      // Renders the default route
      expect(DraftPreview).toHaveBeenCalledTimes(1)
      expect(DraftPreview).toHaveBeenCalledWith({}, {})
      expect(screen.queryByText('Concept ID: TD100000000')).toBeInTheDocument()
    })
  })

  describe('when rendering the route with a concept id and section name', () => {
    test('renders the metadata form', () => {
      render(
        <MemoryRouter initialEntries={
          [{
            pathname: '/drafts/tools/TD100000000/testSection',
            search: ''
          }]
        }
        >
          <Routes>
            <Route path="/drafts/:draftType/*" element={<DraftsPage />} />
          </Routes>
        </MemoryRouter>
      )

      // Renders the default route
      expect(MetadataForm).toHaveBeenCalledTimes(1)
      expect(MetadataForm).toHaveBeenCalledWith({}, {})
      expect(screen.queryByText('Concept ID: TD100000000')).toBeInTheDocument()
      expect(screen.queryByText('Section Name: testSection')).toBeInTheDocument()
    })
  })

  describe('when rendering the route with a concept id, section name, field name', () => {
    test('renders the metadata form', () => {
      render(
        <MemoryRouter initialEntries={
          [{
            pathname: '/drafts/tools/TD100000000/testSection/testField',
            search: ''
          }]
        }
        >
          <Routes>
            <Route path="/drafts/:draftType/*" element={<DraftsPage />} />
          </Routes>
        </MemoryRouter>
      )

      // Renders the default route
      expect(MetadataForm).toHaveBeenCalledTimes(1)
      expect(MetadataForm).toHaveBeenCalledWith({}, {})
      expect(screen.queryByText('Concept ID: TD100000000')).toBeInTheDocument()
      expect(screen.queryByText('Section Name: testSection')).toBeInTheDocument()
      expect(screen.queryByText('Field Name: testField')).toBeInTheDocument()
    })
  })
})
