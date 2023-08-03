import React from 'react'
import {
  render, screen
} from '@testing-library/react'
import CustomFieldTemplate from '../CustomFieldTemplate'

describe('CustomDescriptionFieldTemplateTest', () => {
  it('renders a title', async () => {
    render(<CustomFieldTemplate />)

    expect(screen.getByTestId('custom-field-template')).toBeTruthy()
  })
})
