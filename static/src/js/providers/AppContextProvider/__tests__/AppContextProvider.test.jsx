import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useAppContext from '../../../hooks/useAppContext'
import AppContextProvider from '../AppContextProvider'

vi.mock('../../../../../../sharedUtils/getConfig', async () => ({
  ...await vi.importActual('../../../../../../sharedUtils/getConfig'),
  getApplicationConfig: vi.fn(() => ({
    apiHost: 'http://test.com/dev'
  }))
}))

const MockComponent = () => {
  const {
    providerId,
    setProviderId
  } = useAppContext()

  return (
    <div>
      <button
        type="button"
        onClick={() => setProviderId('MMT_TEST')}
      >
        Set provider id
      </button>
      <div>
        Provider Id:
        {' '}
        {providerId}
      </div>
    </div>
  )
}

const setup = () => {
  const user = userEvent.setup()

  render(
    <AppContextProvider>
      <MockComponent />
    </AppContextProvider>
  )

  return { user }
}

describe('AppContextProvider component', () => {
  describe('when app starts up', () => {
    describe('setProviderId is triggered', () => {
      test('sets the provider id', async () => {
        const { user } = setup()

        const setProviderButton = await screen.findByRole('button', { name: 'Set provider id' })

        await user.click(setProviderButton)

        const providerId = screen.getByText('Provider Id: MMT_TEST', { exact: true })

        expect(providerId).toBeInTheDocument()
      })
    })
  })
})
