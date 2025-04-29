import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  describe,
  test,
  expect
} from 'vitest'
import { KeywordTreePlaceHolder } from '../KeywordTreePlaceHolder'

describe('KeywordTreePlaceholder component', () => {
  test('renders with the provided message', () => {
    const testMessage = 'Test placeholder message'
    render(<KeywordTreePlaceHolder message={testMessage} />)

    const placeholderElement = screen.getByText(testMessage)
    expect(placeholderElement).toBeTruthy()
    expect(placeholderElement).toHaveClass('keyword-tree-placeholder')
  })

  test('applies correct CSS classes', () => {
    render(<KeywordTreePlaceHolder message="Test message" />)

    const placeholderElement = screen.getByText('Test message')
    expect(placeholderElement).toHaveClass('keyword-tree-placeholder')
  })
})
