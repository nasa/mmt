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

const mockedUsedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}))

jest.mock('../../NavigationItemError/NavigationItemError')

const setup = (overrideProps = {}) => {
  const props = {
    draft: {},
    section: {
      displayName: 'Mock Section Name',
      properties: ['Name', 'URL', 'RelatedURLs']
    },
    validationErrors: [],
    visitedFields: [],
    setFocusField: jest.fn(),
    ...overrideProps
  }

  render(
    <MemoryRouter initialEntries={['/tool-drafts/TD1000000-MMT/mock-section-name']}>
      <Routes>
        <Route
          path="/tool-drafts"
        >
          <Route
            path=":conceptId/:sectionName"
            element={<NavigationItem {...props} />}
          />
        </Route>
      </Routes>
    </MemoryRouter>
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('NavigationItem', () => {
  describe('when there is no data in the form', () => {
    test('displays the form name', () => {
      setup()

      expect(screen.getByText('Mock Section Name')).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Mock Section Name' }).className).toContain('eui-fa-circle-o')
    })
  })

  describe('when there are no errors on the form', () => {
    test('displays the form name', () => {
      setup({
        draft: {
          Name: 'Mock data'
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
          visitedFields: ['Name'],
          validationErrors: [{
            name: 'required',
            property: 'Name',
            message: "must have required property 'Name'",
            params: {
              missingProperty: 'Name'
            },
            stack: "must have required property 'Name'",
            schemaPath: '#/required'
          }]
        })

        expect(screen.getByText('Mock Section Name')).toBeInTheDocument()
        expect(screen.getByRole('img', { name: 'Mock Section Name' }).className).toContain('eui-fa-times-circle')

        expect(NavigationItemError).toHaveBeenCalledTimes(1)
        expect(NavigationItemError).toHaveBeenCalledWith({
          className: null,
          error: {
            message: "must have required property 'Name'",
            name: 'required',
            params: { missingProperty: 'Name' },
            property: 'Name',
            schemaPath: '#/required',
            stack: "must have required property 'Name'",
            visited: false
          },
          setFocusField: props.setFocusField
        }, {})
      })
    })

    describe('when the error is in a nested field', () => {
      test('displays the error message', () => {
        const { props } = setup({
          visitedFields: ['URL'],
          validationErrors: [{
            name: 'required',
            property: '.URL.Type',
            message: "must have required property ' Type'",
            params: {
              missingProperty: 'Type'
            },
            stack: "must have required property ' Type'",
            schemaPath: '#/properties/URL/required'
          }]
        })

        expect(screen.getByText('Mock Section Name')).toBeInTheDocument()
        expect(screen.getByRole('img', { name: 'Mock Section Name' }).className).toContain('eui-fa-times-circle')

        expect(NavigationItemError).toHaveBeenCalledTimes(1)
        expect(NavigationItemError).toHaveBeenCalledWith({
          className: null,
          error: {
            errors: [{
              message: "must have required property ' Type'",
              name: 'required',
              params: { missingProperty: 'Type' },
              property: '.URL.Type',
              schemaPath: '#/properties/URL/required',
              stack: "must have required property ' Type'",
              visited: false
            }],
            fieldName: 'URL'
          },
          setFocusField: props.setFocusField
        }, {})
      })
    })

    describe('when the error is in an array field', () => {
      test('displays the error message', () => {
        const { props } = setup({
          visitedFields: ['RelatedURLs'],
          validationErrors: [{
            message: "must have required property 'URLContentType'",
            name: 'required',
            params: {
              missingProperty: 'URLContentType'
            },
            property: '.RelatedURLs.0.URLContentType',
            schemaPath: '#/properties/RelatedURLs/items/required',
            stack: "must have required property 'URLContentType'"
          }]
        })

        expect(screen.getByText('Mock Section Name')).toBeInTheDocument()
        expect(screen.getByRole('img', { name: 'Mock Section Name' }).className).toContain('eui-fa-times-circle')

        expect(NavigationItemError).toHaveBeenCalledTimes(1)
        expect(NavigationItemError).toHaveBeenCalledWith({
          className: null,
          error: {
            errors: [{
              message: "must have required property 'URLContentType'",
              name: 'required',
              params: {
                missingProperty: 'URLContentType'
              },
              property: '.RelatedURLs.0.URLContentType',
              schemaPath: '#/properties/RelatedURLs/items/required',
              stack: "must have required property 'URLContentType'",
              visited: false
            }],
            fieldName: 'RelatedURLs (1 of 1)'
          },
          setFocusField: props.setFocusField
        }, {})
      })
    })
  })

  describe('when hovering over the form name', () => {
    test('changes the background on the element', async () => {
      const { user } = setup()

      const button = screen.getByRole('button', { value: 'Mock Section Name' })
      await user.hover(button)

      expect(button.className).toContain('navigation-item__item--isFocused')
    })
  })

  describe('when hovering off the form name', () => {
    test('changes the background on the element', async () => {
      const { user } = setup()

      const button = screen.getByRole('button', { value: 'Mock Section Name' })
      await user.hover(button)

      expect(button.className).toContain('navigation-item__item--isFocused')

      await user.unhover(button)

      expect(button.className).not.toContain('navigation-item__item--isFocused')
    })
  })

  describe('when clicking on the form name', () => {
    test('navigates to the correct form', async () => {
      const navigateSpy = jest.fn()
      jest.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup()

      const button = screen.getByRole('button', { value: 'Mock Section Name' })
      await user.click(button)

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('../TD1000000-MMT/mock-section-name')
    })
  })
})
