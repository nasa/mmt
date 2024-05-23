import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { describe } from 'vitest'
import saveTypesToHumanizedStringMap from '@/js/constants/saveTypesToHumanizedStringMap'
import saveTypes from '@/js/constants/saveTypes'
import AppContext from '../../../context/AppContext'
import ChooseProviderModal from '../ChooseProviderModal'

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useNavigate: vi.fn()
}))

const defaultUser = {
  name: 'User Name',
  providerId: 'MMT-2'
}

const setup = ({
  overrideProps = {},
  overrideContext = {}
} = {}) => {
  const user = userEvent.setup()

  const props = {
    show: false,
    toggleModal: () => {},
    type: 'draft',
    onSubmit: () => {},
    primaryActionType: saveTypesToHumanizedStringMap[saveTypes.save],
    ...overrideProps
  }
  const context = {
    user: defaultUser,
    login: vi.fn(),
    logout: vi.fn(),
    providerIds: [],
    setProviderId: vi.fn(),
    ...overrideContext
  }

  const { container } = render(
    <AppContext.Provider value={context}>
      <ChooseProviderModal {...props} />
    </AppContext.Provider>
  )

  return {
    container,
    context,
    user
  }
}

describe('ChooseProviderModal component', () => {
  describe('when show is false', () => {
    test('does not render the modal', () => {
      const { container } = setup()

      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('when show is true', () => {
    test('renders the modal correctly', () => {
      setup({
        overrideProps: {
          show: true
        },
        overrideContext: {
          providerIds: [
            'MMT-1',
            'MMT-2'
          ]
        }
      })

      expect(screen.getByText('Choose a provider')).toBeDefined()
      expect(screen.getByText('Choose a provider before saving your draft.')).toBeDefined()
      expect(screen.getByRole('button', { name: /Close/i })).toBeDefined()
      expect(screen.getByRole('combobox', { name: 'Select a provider' })).toBeDefined()
      expect(screen.getByRole('combobox', { name: 'Select a provider' })).toHaveValue('MMT-2')
      expect(screen.getByRole('button', { name: saveTypesToHumanizedStringMap[saveTypes.save] })).toBeDefined()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeDefined()
    })
  })

  describe('when the select is changed', () => {
    test('sets the provider', async () => {
      const toggleModalMock = vi.fn()

      const { user, context } = setup({
        overrideProps: {
          show: true,
          toggleModal: toggleModalMock
        },
        overrideContext: {
          providerIds: [
            'MMT-1',
            'MMT-2'
          ]
        }
      })

      const select = screen.getByRole('combobox', { name: 'Select a provider' })

      expect(select).toHaveValue('MMT-2')

      await user.selectOptions(select, 'MMT-1')

      expect(context.setProviderId).toHaveBeenCalledTimes(1)
      expect(context.setProviderId).toHaveBeenCalledWith('MMT-1')
    })
  })

  describe('when the close button is clicked', () => {
    test('calls the toggleModal callback with false', async () => {
      const toggleModalMock = vi.fn()

      const { user } = setup({
        overrideProps: {
          show: true,
          toggleModal: toggleModalMock
        }
      })

      const button = screen.getByRole('button', { name: /Close/i })

      await user.click(button)

      expect(toggleModalMock).toHaveBeenCalledTimes(1)
      expect(toggleModalMock).toHaveBeenCalledWith(false)
    })
  })

  describe('when the cancel button is clicked', () => {
    test('calls the toggleModal callback with false', async () => {
      const toggleModalMock = vi.fn()

      const { user } = setup({
        overrideProps: {
          show: true,
          toggleModal: toggleModalMock
        }
      })

      const button = screen.getByRole('button', { name: 'Cancel' })

      await user.click(button)

      expect(toggleModalMock).toHaveBeenCalledTimes(1)
      expect(toggleModalMock).toHaveBeenCalledWith(false)
    })
  })

  describe('when the cancel button is clicked', () => {
    test('calls the toggleModal callback with false', async () => {
      const toggleModalMock = vi.fn()
      const onSubmitMock = vi.fn()

      const { user } = setup({
        overrideProps: {
          show: true,
          toggleModal: toggleModalMock,
          onSubmit: onSubmitMock
        }
      })

      const button = screen.getByRole('button', { name: saveTypesToHumanizedStringMap[saveTypes.save] })

      await user.click(button)

      expect(onSubmitMock).toHaveBeenCalledTimes(1)
      expect(onSubmitMock).toHaveBeenCalledWith()
      expect(toggleModalMock).toHaveBeenCalledTimes(1)
      expect(toggleModalMock).toHaveBeenCalledWith(false)
    })
  })
})
