import React from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'

import Providers from '@/js/providers/Providers/Providers'
import FormNavigation from '@/js/components/FormNavigation/FormNavigation'
import NavigationItem from '@/js/components/NavigationItem/NavigationItem'

import saveTypes from '@/js/constants/saveTypes'
import useAvailableProviders from '@/js/hooks/useAvailableProviders'

vi.mock('@/js/components/NavigationItem/NavigationItem', () => ({ default: vi.fn(() => null) }))

vi.mock('@/js/hooks/useAvailableProviders')
useAvailableProviders.mockReturnValue({
  providerIds: ['MMT_1', 'MMT_2']
})

const setup = ({
  overrideProps = {},
  overrideInitialEntries,
  overridePath,
  overridePathName
}) => {
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
    onCancel: vi.fn(),
    onSave: vi.fn(),
    schema: {},
    setFocusField: vi.fn(),
    visitedFields: [],
    ...overrideProps
  }

  const user = userEvent.setup({})

  render(
    <Providers>
      <MemoryRouter initialEntries={[overrideInitialEntries || '/tool-drafts/TD1000000-MMT/mock-section-name']}>
        <Routes>
          <Route
            path={overridePath || '/tool-drafts'}
          >
            <Route
              path={overridePathName || ':conceptId?/:sectionName?'}
              element={<FormNavigation {...props} />}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    </Providers>
  )

  return {
    props,
    user
  }
}

describe('FormNavigation', () => {
  test('renders a NavigationItem component for each form section', () => {
    const { props } = setup({})

    expect(NavigationItem).toHaveBeenCalledTimes(2)
    expect(NavigationItem).toHaveBeenCalledWith({
      draft: {},
      section: {
        displayName: 'Section 1',
        properties: ['Field1']
      },
      sectionIndex: 0,
      setFocusField: props.setFocusField,
      validationErrors: [],
      visitedFields: []
    }, {})

    expect(NavigationItem).toHaveBeenCalledWith({
      draft: {},
      section: {
        displayName: 'Section 2',
        properties: ['Field2']
      },
      sectionIndex: 1,
      setFocusField: props.setFocusField,
      validationErrors: [],
      visitedFields: []
    }, {})
  })

  describe('when the loading prop is true', () => {
    test('renders a spinner', () => {
      setup({
        overrideProps: {
          loading: true
        }
      })

      expect(screen.getByRole('status').className).toContain('spinner')
    })
  })

  describe('when clicking the Save & Continue button', () => {
    test('calls onSave', async () => {
      const { props, user } = setup({})

      const button = screen.getByRole('button', { name: 'Save & Continue' })

      await user.click(button)

      expect(props.onSave).toHaveBeenCalledTimes(1)
      expect(props.onSave).toHaveBeenCalledWith(saveTypes.saveAndContinue)
    })
  })

  describe('when clicking the Save dropdown item', () => {
    test('calls onSave', async () => {
      const { props, user } = setup({})

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
      const { props, user } = setup({})

      const dropdown = screen.getByRole('button', { name: 'Save Options' })
      await user.click(dropdown)

      const button = screen.getAllByRole('button', { name: 'Save & Continue' }).at(1)
      await user.click(button)

      expect(props.onSave).toHaveBeenCalledTimes(1)
      expect(props.onSave).toHaveBeenCalledWith(saveTypes.saveAndContinue)
    })
  })

  describe('when clicking the Save & Publish dropdown item', () => {
    let schema

    beforeEach(() => {
      schema = {
        properties: {
          bar: {
            type: 'number'
          },
          foo: {
            type: 'number'
          }
        }
      }
    })

    describe('when draft has errors', () => {
      describe('when the metadata record has not been saved', () => {
        beforeEach(async () => {
          const { user } = setup({
            overrideInitialEntries: '/tool-drafts/new',
            overrideProps: {
              draft: {
                foo: 'mock string'
              },
              schema
            }
          })

          const dropdown = screen.getByRole('button', { name: 'Save Options' })
          await user.click(dropdown)
        })

        test('has disabled publish button', async () => {
          const button = screen.getByRole('button', { name: 'Save & Publish' })
          expect(button).toHaveClass('disabled')
        })

        test('shows Publishing disabled until you save the record tooltip ', async () => {
          const tooltip = screen.getByRole('tooltip')
          expect(tooltip).toHaveAttribute('title', 'Publishing disabled until you save the record.')
        })
      })

      describe('when the metadata record is already saved', () => {
        beforeEach(async () => {
          const { user } = setup({
            overrideProps: {
              draft: {
                foo: 'mock string'
              },
              schema
            }
          })

          const dropdown = screen.getByRole('button', { name: 'Save Options' })
          await user.click(dropdown)
        })

        test('has disabled publish button', async () => {
          const button = screen.getByRole('button', { name: 'Save & Publish' })
          expect(button).toHaveClass('disabled')
        })

        test('shows Publishing disabled due to errors in metadata record tooltip', async () => {
          const tooltip = screen.getByRole('tooltip')
          expect(tooltip).toHaveAttribute('title', 'Publishing disabled due to errors in metadata record.')
        })
      })
    })

    test('shows save and publish option as enabled if draft has no errors', async () => {
      const { user } = setup({
        overrideProps: {
          draft: {
            bar: 2,
            foo: 1
          },
          schema
        }
      })

      const dropdown = screen.getByRole('button', { name: 'Save Options' })
      await user.click(dropdown)

      const button = screen.getByRole('button', { name: 'Save & Publish' })
      expect(button).not.toHaveClass('disabled')
    })

    test('calls onSave', async () => {
      const { props, user } = setup({})

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
      const { props, user } = setup({})

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
      const { props, user } = setup({})

      const button = screen.getByRole('button', { name: 'Cancel' })

      await user.click(button)

      expect(props.onCancel).toHaveBeenCalledTimes(1)
    })
  })

  describe('when clicking the Save & Create Draft dropdown item', () => {
    test('calls onSave', async () => {
      const { props, user } = setup({
        overrideInitialEntries: '/templates/collections/1234-abcd-5678-efgh',
        overridePath: '/',
        overridePathName: 'templates/:templateType/:id'
      })

      const dropdown = screen.getByRole('button', { name: 'Save Options' })
      await user.click(dropdown)

      const button = screen.getByRole('button', { name: 'Save & Create Draft' })

      await user.click(button)

      expect(props.onSave).toHaveBeenCalledTimes(1)
      expect(props.onSave).toHaveBeenCalledWith(saveTypes.saveAndCreateDraft)
    })
  })

  describe('when saving a new draft', () => {
    describe('when on the default route', () => {
      test('opens the choose provider modal', async () => {
        const { user } = setup({
          overrideInitialEntries: '/tool-drafts/new'
        })

        const button = screen.getByRole('button', { name: 'Save & Continue' })

        await user.click(button)

        const modal = screen.getByRole('dialog')
        const modalSubmit = within(modal).getByRole('button', { name: 'Save & Continue' })

        expect(modalSubmit).toBeInTheDocument()
      })

      describe('when on a nested page', () => {
        test('opens the choose provider modal', async () => {
          const { user } = setup({
            overrideInitialEntries: '/tool-drafts/new/mock-section-name'
          })

          const button = screen.getByRole('button', { name: 'Save & Continue' })

          await user.click(button)

          const modal = screen.getByRole('dialog')
          const modalSubmit = within(modal).getByRole('button', { name: 'Save & Continue' })

          expect(modalSubmit).toBeInTheDocument()
        })
      })
    })
  })

  describe('when saving a new template', () => {
    describe('when on the default route', () => {
      test('opens the choose provider modal', async () => {
        const { user } = setup({
          overrideInitialEntries: '/templates/collections/new',
          overridePath: '/templates/collections'
        })

        const button = screen.getByRole('button', { name: 'Save & Continue' })

        await user.click(button)

        const modal = screen.getByRole('dialog')
        const modalSubmit = within(modal).getByRole('button', { name: 'Save & Continue' })

        expect(modalSubmit).toBeInTheDocument()
      })

      describe('when on a nested page', () => {
        test('opens the choose provider modal', async () => {
          const { user } = setup({
            overrideInitialEntries: '/templates/collections/new/mock-section-name',
            overridePath: '/templates/collections'
          })

          const button = screen.getByRole('button', { name: 'Save & Continue' })

          await user.click(button)

          const modal = screen.getByRole('dialog')
          const modalSubmit = within(modal).getByRole('button', { name: 'Save & Continue' })

          expect(modalSubmit).toBeInTheDocument()
        })
      })
    })
  })
})
