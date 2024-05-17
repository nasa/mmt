import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Providers from '@/js/components/Providers/Providers'

import ProvidersPage from '../ProvidersPage'

vi.mock('@/js/components/Providers/Providers').mockImplementation(() => {})

const setup = () => {
  render(
    <ProvidersPage />
  )

  return {
    user: userEvent.setup()
  }
}

describe('ProvidersPage', () => {
  test('renders the page', async () => {
    setup()

    expect(screen.getByRole('heading', { value: 'Mock group' })).toBeInTheDocument()

    expect(Providers).toHaveBeenCalledTimes(1)
  })
})
