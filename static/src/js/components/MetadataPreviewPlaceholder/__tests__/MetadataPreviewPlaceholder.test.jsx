import React from 'react'
import { render } from '@testing-library/react'

import MetadataPreviewPlaceholder from '../MetadataPreviewPlaceholder'

vi.mock('react-icons/fa')

const setup = () => {
  const { container } = render(
    <MetadataPreviewPlaceholder />
  )

  return {
    container
  }
}

describe('MetadataPreviewPlaceholder', () => {
  test('renders the placeholders', () => {
    const { container } = setup()

    expect(container.getElementsByClassName('placeholder')).toHaveLength(15)
  })
})
