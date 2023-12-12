import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import JsonPreview from '../JsonPreview'

// Mocking useAppContext hook
jest.mock('../../../hooks/useAppContext', () => ({
  __esModule: true,
  default: jest.fn(() => ({}))
}))

// Mocking lodash's cloneDeep function
jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  cloneDeep: jest.fn((obj) => ({ ...obj }))
}))

// Mocking removeEmpty function
jest.mock('../../../utils/removeEmpty', () => jest.fn((obj) => obj))

describe('JsonPreview Component', () => {
  describe('when draft is not present in the context', () => {
    it('renders without crashing', () => {
      render(
        <BrowserRouter>
          <JsonPreview />
        </BrowserRouter>
      )

      expect(screen.queryByText(/UMM-T/)).not.toBeInTheDocument()
      expect(screen.queryByText(/Web User Interface/)).not.toBeInTheDocument()
      expect(screen.queryByText(/Hello from the other side/)).not.toBeInTheDocument()
      expect(screen.queryByText(/https:\/\/cdn\.earthdata\.nasa\.gov\/umm\/tool\/v1\.1/)).not.toBeInTheDocument()
      expect(screen.queryByText(/v1\.1/)).not.toBeInTheDocument()

      // Check if the JSON content is an empty object
      expect(screen.getByText(/{}/)).toBeInTheDocument()
    })
  })

  describe('when ummMetadata is not present in draft', () => {
    it('renders without crashing', () => {
      // Override the context to simulate the absence of 'ummMetadata' in 'draft'
      jest.mock('../../../hooks/useAppContext', () => ({
        __esModule: true,
        default: jest.fn(() => ({ draft: {} }))
      }))

      render(
        <BrowserRouter>
          <JsonPreview />
        </BrowserRouter>
      )

      expect(screen.queryByText(/UMM-T/)).not.toBeInTheDocument()
      expect(screen.queryByText(/Web User Interface/)).not.toBeInTheDocument()
      expect(screen.queryByText(/Hello from the other side/)).not.toBeInTheDocument()
      expect(screen.queryByText(/https:\/\/cdn\.earthdata\.nasa\.gov\/umm\/tool\/v1\.1/)).not.toBeInTheDocument()
      expect(screen.queryByText(/v1\.1/)).not.toBeInTheDocument()
    })
  })
})
