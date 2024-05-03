import React from 'react'
import { render } from '@testing-library/react'

import DraftPreviewPlaceholder from '../DraftPreviewPlaceholder'

vi.mock('react-icons/fa')

const setup = () => {
  const { container } = render(
    <DraftPreviewPlaceholder />
  )

  return {
    container
  }
}

describe('DraftPreviewPlaceholder', () => {
  test('renders the placeholders', () => {
    const { container } = setup()

    expect(container.getElementsByClassName('placeholder')).toHaveLength(21)
  })
})
