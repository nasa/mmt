import React from 'react'
import { screen, render } from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import { ErrorBanner } from '../ErrorBanner'

describe('Error Banner Component', () => {
  describe('Provided a message', () => {
    test('it renders an error banner with the message', () => {
      render(
        <ErrorBanner message="Cras mattis consectetur purus sit amet fermentum." />
      )

      // Ensure the content is displayed correctly
      expect(screen.getByTestId('error-banner__message')).toHaveTextContent('Cras mattis consectetur purus sit amet fermentum.')
    })
  })

  describe('Provided a test id', () => {
    test('it renders an error banner with the message', () => {
      render(
        <ErrorBanner message="Cras mattis consectetur purus sit amet fermentum." dataTestId="test-error" />
      )

      // Ensure the content is displayed correctly
      expect(screen.getByTestId('test-error')).toHaveTextContent('Cras mattis consectetur purus sit amet fermentum.')
    })
  })

  describe('Provided a previousURL', () => {
    test('it renders an error banner with prompt to refresh the page', async () => {
      render(
        <ErrorBanner message="Cras mattis consectetur purus sit amet fermentum." dataTestId="test-error" previousURL="/collections/C100000-TEST_PROV" />
      )

      // Ensure the content is displayed correctly
      expect(screen.getByRole('alert', { name: '' })).toHaveTextContent('Some operations may take time to populate in the Common Metadata Repository. If you are not seeing what you expect below, please')

      const refreshButton = screen.getByRole('button', { name: 'refresh the page' })
      await userEvent.click(refreshButton)
    })
  })

  describe('CurrentURL indicates the record does not exist', () => {
    test('it renders an error banner with message', async () => {
      const mockCurrentURL = new URL('http://localhost:5173/collections/C1000-TEST_PROV')
      window.location = mockCurrentURL

      render(
        <ErrorBanner />
      )

      // Ensure the content is displayed correctly
      expect(screen.getByRole('alert', { name: '' })).toHaveTextContent('Sorry! This record does not exist')
    })
  })
})
