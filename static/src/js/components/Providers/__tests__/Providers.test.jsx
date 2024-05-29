import { render, screen } from '@testing-library/react'
import React from 'react'

import useAvailableProviders from '@/js/hooks/useAvailableProviders'

import Providers from '../Providers'

vi.mock('@/js/hooks/useAvailableProviders')

const setup = () => {
  render(
    <Providers />
  )
}

describe('Providers', () => {
  describe('when the user has providers', () => {
    test('displays the provider list', async () => {
      useAvailableProviders.mockReturnValue({
        providerIds: ['MMT_1', 'MMT_2']
      })

      setup({})

      expect(await screen.findByText('You have permissions to manage metadata records for the following providers.')).toBeVisible()

      expect(screen.getByText('MMT_1')).toBeInTheDocument()
      expect(screen.getByText('MMT_2')).toBeInTheDocument()
    })
  })

  describe('when the user has no available providers', () => {
    test('renders a message', async () => {
      useAvailableProviders.mockReturnValue({
        providerIds: []
      })

      setup()

      expect(await screen.findByText('You do not have access to any providers.')).toBeVisible()
    })
  })
})
