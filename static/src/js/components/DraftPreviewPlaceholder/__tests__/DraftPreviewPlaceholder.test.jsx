import React from 'react'
import { render, screen } from '@testing-library/react'

import DraftPreviewPlaceholder from '../DraftPreviewPlaceholder'

vi.mock('react-icons/fa')
vi.mock('react-bootstrap/Placeholder', async () => ({
  default: vi.fn(() => (
    <div data-testid="placeholder" />
  ))
}))

const setup = () => {
  const { container } = render(
    <DraftPreviewPlaceholder />
  )

  return {
    container
  }
}

describe('DraftPreviewPlaceholder', () => {
  test('renders the placeholders', async () => {
    setup()

    const placeholders = await screen.findAllByTestId('placeholder')
    expect(placeholders.length).toBe(14)
  })
})
