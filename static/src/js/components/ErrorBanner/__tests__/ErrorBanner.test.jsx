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

  describe('Provided a known CMR Error Message', () => {
    test('it renders an error banner with prompt to refresh the page', async () => {
      render(
        <ErrorBanner message="Cannot destructure property 'granules' of 'concept' as it is null." dataTestId="test-error" />
      )

      // Ensure the content is displayed correctly
      expect(screen.getByRole('alert', { name: '' })).toHaveTextContent('Some operations may take time to populate in the Common Metadata Repository. If you are not seeing what you expect below, consider refreshing the page. If it has been over 24 hours and your record has not been updated, please contact support@earthdata.nasa.gov.')

      const refreshButton = screen.getByRole('button', { name: 'refreshing the page' })
      await userEvent.click(refreshButton)
    })
  })
})
