import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'

import FormNavigation from '../FormNavigation'
import NavigationItem from '../../NavigationItem/NavigationItem'
import saveTypes from '../../../constants/saveTypes'

jest.mock('../../NavigationItem/NavigationItem')

const setup = (overrideProps = {}) => {
  const props = {
    draft: {},
    formSections: [{
      displayName: 'Section 1',
      properties: ['Field1']
    }, {
      displayName: 'Section 2',
      properties: ['Field2']
    }],
    loading: false,
    schema: {},
    validationErrors: [],
    visitedFields: [],
    onCancel: jest.fn(),
    onSave: jest.fn(),
    setFocusField: jest.fn(),
    uiSchema: {
      'section-1': {}
    },
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
            element={<FormNavigation {...props} />}
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

describe('FormNavigation', () => {
  test('renders a NavigationItem component for each form section', () => {
    const { props } = setup()

    expect(NavigationItem).toHaveBeenCalledTimes(2)
    expect(NavigationItem).toHaveBeenCalledWith({
      draft: {},
      required: false,
      section: {
        displayName: 'Section 1',
        properties: ['Field1']
      },
      setFocusField: props.setFocusField,
      validationErrors: [],
      visitedFields: []
    }, {})

    expect(NavigationItem).toHaveBeenCalledWith({
      draft: {},
      required: false,
      section: {
        displayName: 'Section 2',
        properties: ['Field2']
      },
      setFocusField: props.setFocusField,
      validationErrors: [],
      visitedFields: []
    }, {})
  })

  describe('when the loading prop is true', () => {
    test('renders a spinner', () => {
      setup({
        loading: true
      })

      expect(screen.getByRole('status').className).toContain('spinner')
    })
  })

  describe('when clicking the Save & Continue button', () => {
    test('calls onSave', async () => {
      const { props, user } = setup()

      const button = screen.getByRole('button', { name: 'Save & Continue' })

      await user.click(button)

      expect(props.onSave).toHaveBeenCalledTimes(1)
      expect(props.onSave).toHaveBeenCalledWith(saveTypes.saveAndContinue)
    })
  })

  describe('when clicking the Save dropdown item', () => {
    test('calls onSave', async () => {
      const { props, user } = setup()

      const dropdown = screen.getByRole('button', { name: 'Save Options' })
      await user.click(dropdown)

      const button = screen.getByRole('button', { name: 'Save' })

      await user.click(button)

      expect(props.onSave).toHaveBeenCalledTimes(1)
      expect(props.onSave).toHaveBeenCalledWith(saveTypes.save)
    })
  })

  describe('when clicking the Save & Continue dropdown item', () => {
    test('calls onSave', async () => {
      const { props, user } = setup()

      const dropdown = screen.getByRole('button', { name: 'Save Options' })
      await user.click(dropdown)

      const button = screen.getAllByRole('button', { name: 'Save & Continue' }).at(1)

      await user.click(button)

      expect(props.onSave).toHaveBeenCalledTimes(1)
      expect(props.onSave).toHaveBeenCalledWith(saveTypes.saveAndContinue)
    })
  })

  describe('when clicking the Save & Publish dropdown item', () => {
    test('calls onSave', async () => {
      const { props, user } = setup()

      const dropdown = screen.getByRole('button', { name: 'Save Options' })
      await user.click(dropdown)

      const button = screen.getByRole('button', { name: 'Save & Publish' })

      await user.click(button)

      expect(props.onSave).toHaveBeenCalledTimes(1)
      expect(props.onSave).toHaveBeenCalledWith(saveTypes.saveAndPublish)
    })
  })

  describe('when clicking the Save & Preview dropdown item', () => {
    test('calls onSave', async () => {
      const { props, user } = setup()

      const dropdown = screen.getByRole('button', { name: 'Save Options' })
      await user.click(dropdown)

      const button = screen.getByRole('button', { name: 'Save & Preview' })

      await user.click(button)

      expect(props.onSave).toHaveBeenCalledTimes(1)
      expect(props.onSave).toHaveBeenCalledWith(saveTypes.saveAndPreview)
    })
  })

  describe('when clicking the Cancel button', () => {
    test('calls onCancel', async () => {
      const { props, user } = setup()

      const button = screen.getByRole('button', { name: 'Cancel' })

      await user.click(button)

      expect(props.onCancel).toHaveBeenCalledTimes(1)
    })
  })
})
