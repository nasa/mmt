import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'
import * as router from 'react-router'

import NavigationItem from '../NavigationItem'
import NavigationItemError from '../../NavigationItemError/NavigationItemError'

const mockedUsedNavigate = vi.fn()

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}))

const navigationItemErrorCalls = []

vi.mock('../../NavigationItemError/NavigationItemError', () => ({
  default: vi.fn((props) => {
    navigationItemErrorCalls.push({
      props,
      stack: new Error().stack
    })

    return null
  })
}))

const setup = ({
  overrideProps = {},
  formSection = 'mock-section-name',
  overrideInitialEntries = null,
  overridePath = null,
  overridePathValue = null
}) => {
  const props = {
    draft: {},
    section: {
      displayName: 'Mock Section Name',
      properties: ['Name', 'URL', 'RelatedURLs']
    },
    sectionIndex: 0,
    setFocusField: vi.fn(),
    validationErrors: [],
    visitedFields: [],
    ...overrideProps
  }

  const user = userEvent.setup()

  render(
    <MemoryRouter initialEntries={[overrideInitialEntries || `/drafts/tools/TD1000000-MMT/${formSection}`]}>
      <Routes>
        <Route
          path={overridePath || '/drafts'}
        >
          <Route
            element={<NavigationItem {...props} />}
            path={overridePathValue || ':draftType/:conceptId/:sectionName'}
          />
          <Route
            element={<NavigationItem {...props} />}
            path={overridePathValue || ':draftType/new'}
          />
        </Route>
      </Routes>
    </MemoryRouter>
  )

  return {
    props,
    user
  }
}

describe('NavigationItem', () => {
  describe('when there is no data in the form', () => {
    test('displays the form name', () => {
      setup({})

      expect(screen.getByText('Mock Section Name')).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Mock Section Name' }).className).toContain('eui-fa-circle-o')
    })
  })

  describe('when there is only an empty array in the form', () => {
    test('displays the form name', () => {
      setup({
        overrideProps: {
          draft: {
            RelatedURLs: []
          }
        }
      })

      expect(screen.getByText('Mock Section Name')).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Mock Section Name' }).className).toContain('eui-fa-circle-o')
    })
  })

  describe('when there are no errors on the form', () => {
    test('displays the form name', () => {
      setup({
        overrideProps: {
          draft: {
            Name: 'Mock data'
          }
        }
      })

      expect(screen.getByText('Mock Section Name')).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Mock Section Name' }).className).toContain('eui-check')
    })
  })

  describe('when there are errors in the form', () => {
    describe('when the error is on a top level field', () => {
      test('displays the error message', () => {
        const { props } = setup({
          overrideProps: {
            validationErrors: [{
              message: "must have required property 'Name'",
              name: 'required',
              params: {
                missingProperty: 'Name'
              },
              property: 'Name',
              schemaPath: '#/required',
              stack: "must have required property 'Name'"
            }],
            visitedFields: ['Name']
          }
        })

        expect(screen.getByText('Mock Section Name')).toBeInTheDocument()
        expect(screen.getByRole('img', { name: 'Mock Section Name' }).className).toContain('eui-fa-times-circle')

        expect(NavigationItemError).toHaveBeenCalledTimes(1)
        expect(NavigationItemError).toHaveBeenCalledWith({
          error: {
            message: "must have required property 'Name'",
            name: 'required',
            params: {
              missingProperty: 'Name'
            },
            property: 'Name',
            schemaPath: '#/required',
            stack: "must have required property 'Name'"
          },
          setFocusField: props.setFocusField,
          visitedFields: ['Name']
        }, {})
      })
    })

    describe('when the error is in a nested field', () => {
      test('displays the error message', () => {
        const { props } = setup({
          overrideProps: {
            validationErrors: [{
              message: "must have required property ' Type'",
              name: 'required',
              params: {
                missingProperty: 'Type'
              },
              property: '.URL.Type',
              schemaPath: '#/properties/URL/required',
              stack: "must have required property ' Type'"
            }],
            visitedFields: ['URL']
          }
        })

        expect(screen.getByText('Mock Section Name')).toBeInTheDocument()
        expect(screen.getByRole('img', { name: 'Mock Section Name' }).className).toContain('eui-fa-times-circle')

        expect(NavigationItemError).toHaveBeenCalledTimes(1)
        expect(NavigationItemError).toHaveBeenCalledWith({
          error: {
            errors: [{
              message: "must have required property ' Type'",
              name: 'required',
              params: {
                missingProperty: 'Type'
              },
              property: '.URL.Type',
              schemaPath: '#/properties/URL/required',
              stack: "must have required property ' Type'"
            }],
            fieldName: 'URL'
          },
          setFocusField: props.setFocusField,
          visitedFields: ['URL']
        }, {})
      })
    })

    describe('when the error is in an array field', () => {
      test('displays the error message', () => {
        const { props } = setup({
          overrideProps: {
            validationErrors: [{
              message: "must have required property 'URLContentType'",
              name: 'required',
              params: {
                missingProperty: 'URLContentType'
              },
              property: '.RelatedURLs.0.URLContentType',
              schemaPath: '#/properties/RelatedURLs/items/required',
              stack: "must have required property 'URLContentType'"
            }],
            visitedFields: ['RelatedURLs']
          }

        })

        expect(screen.getByText('Mock Section Name')).toBeInTheDocument()
        expect(screen.getByRole('img', { name: 'Mock Section Name' }).className).toContain('eui-fa-times-circle')

        expect(NavigationItemError).toHaveBeenCalledTimes(1)
        expect(NavigationItemError).toHaveBeenCalledWith({
          error: {
            errors: [{
              message: "must have required property 'URLContentType'",
              name: 'required',
              params: {
                missingProperty: 'URLContentType'
              },
              property: '.RelatedURLs.0.URLContentType',
              schemaPath: '#/properties/RelatedURLs/items/required',
              stack: "must have required property 'URLContentType'"
            }],
            fieldName: 'RelatedURLs (1 of 1)'
          },
          setFocusField: props.setFocusField,
          visitedFields: ['RelatedURLs']
        }, {})
      })
    })

    describe('when the section with the errors is not currently being displayed', () => {
      test('does not display the error message', () => {
        setup(
          {
            overrideProps: {
              section: {
                displayName: 'Mock Section Name 2',
                properties: ['Mock Field']
              },
              validationErrors: [{
                message: "must have required property 'Name'",
                name: 'required',
                params: {
                  missingProperty: 'Name'
                },
                property: 'Name',
                schemaPath: '#/required',
                stack: "must have required property 'Name'"
              }],
              visitedFields: ['Name']
            }
          },
          'mock-section-name-2'
        )

        expect(screen.getByText('Mock Section Name 2')).toBeInTheDocument()
        expect(screen.getByRole('img', { name: 'Mock Section Name 2' }).className).toContain('eui-fa-circle-o')

        expect(NavigationItemError).toHaveBeenCalledTimes(0)
      })
    })

    describe('when section name is not in the URL', () => {
      test('displays the error message', () => {
        const { props } = setup({
          overrideInitialEntries: '/drafts/tools/new',
          overrideProps: {
            validationErrors: [{
              message: "must have required property 'Name'",
              name: 'required',
              params: {
                missingProperty: 'Name'
              },
              property: 'Name',
              schemaPath: '#/required',
              stack: "must have required property 'Name'"
            }],
            visitedFields: ['Name']
          }
        })

        expect(screen.getByText('Mock Section Name')).toBeInTheDocument()
        expect(screen.getByRole('img', { name: 'Mock Section Name' }).className).toContain('eui-fa-times-circle')

        expect(NavigationItemError).toHaveBeenCalledTimes(1)
        expect(NavigationItemError).toHaveBeenCalledWith({
          error: {
            message: "must have required property 'Name'",
            name: 'required',
            params: {
              missingProperty: 'Name'
            },
            property: 'Name',
            schemaPath: '#/required',
            stack: "must have required property 'Name'"
          },
          setFocusField: props.setFocusField,
          visitedFields: ['Name']
        }, {})
      })
    })
  })

  describe('when hovering over the form name', () => {
    test('changes the background on the element', async () => {
      const { user } = setup({})

      const button = screen.getByRole('button', { value: 'Mock Section Name' })
      await user.hover(button)

      expect(button.className).toContain('navigation-item__item--is-focused')
    })
  })

  describe('when hovering off the form name', () => {
    test('changes the background on the element', async () => {
      const { user } = setup({})

      const button = screen.getByRole('button', { value: 'Mock Section Name' })
      await user.hover(button)

      expect(button.className).toContain('navigation-item__item--is-focused')

      await user.unhover(button)

      expect(button.className).not.toContain('navigation-item__item--is-focused')
    })
  })

  describe('when clicking on the form name', () => {
    test('navigates to the correct form', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup({})

      const button = screen.getByRole('button', { value: 'Mock Section Name' })
      await user.click(button)

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('/drafts/tools/TD1000000-MMT/mock-section-name')
    })
  })

  describe('CollectionTemplates', () => {
    describe('when clicking on formName for a template', () => {
      test('navigates to the correct form', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          overrideInitialEntries: '/templates/collections/1234-abcd-5678-efgh/collection-information',
          overridePath: '/',
          overridePathValue: 'templates/:templateType/:id/:sectionName'
        })

        const button = screen.getByRole('button', { value: 'Mock Section Name' })
        await user.click(button)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('../templates/collections/1234-abcd-5678-efgh/mock-section-name')
      })
    })

    describe('when clicking on formName for a template', () => {
      test('navigates to the correct form', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          overrideInitialEntries: '/templates/collections/new',
          overridePath: '/',
          overridePathValue: 'templates/:templateType/new'
        })

        const button = screen.getByRole('button', { value: 'Mock Section Name' })
        await user.click(button)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('../templates/collections/new/mock-section-name')
      })
    })
  })
})
