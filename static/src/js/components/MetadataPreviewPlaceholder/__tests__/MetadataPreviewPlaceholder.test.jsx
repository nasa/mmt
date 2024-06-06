import React from 'react'
import { render } from '@testing-library/react'
import Placeholder from 'react-bootstrap/Placeholder'

import MetadataPreviewPlaceholder from '../MetadataPreviewPlaceholder'

vi.mock('react-bootstrap/Placeholder', () => ({
  // eslint-disable-next-line react/jsx-props-no-spreading
  default: vi.fn((props) => <div {...props} />)
}))

const setup = () => {
  render(
    <MetadataPreviewPlaceholder />
  )
}

describe('MetadataPreviewPlaceholder', () => {
  test('renders the placeholders', () => {
    setup()

    expect(Placeholder).toHaveBeenCalledTimes(16)
  })
})
