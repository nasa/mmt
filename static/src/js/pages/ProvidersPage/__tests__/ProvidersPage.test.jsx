import React from 'react'
import { render, screen } from '@testing-library/react'

import Providers from '@/js/components/Providers/Providers'

import ProvidersPage from '../ProvidersPage'

vi.mock('@/js/components/Providers/Providers').mockImplementation(() => {})

const setup = () => {
  render(
    <ProvidersPage />
  )
}

describe('ProvidersPage', () => {
  test('renders the page', async () => {
    setup()

    expect(await screen.findByRole('heading', { value: 'Mock group' })).toBeVisible()

    expect(Providers).toHaveBeenCalledTimes(1)
  })
})
