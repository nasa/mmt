import React from 'react'
import {
  render, screen
} from '@testing-library/react'
import CustomDescriptionFieldTemmplate from '../CustomDescriptionFieldTemplate'

describe('CustomDescriptionFieldTemplateTest', () => {
  it('renders a title', async () => {
    render(<CustomDescriptionFieldTemmplate
      id="123"
      description="My Description"
    />)

    expect(screen.getByTestId('custom-description-field-template--description')).toHaveTextContent('My Description')
  })
})
