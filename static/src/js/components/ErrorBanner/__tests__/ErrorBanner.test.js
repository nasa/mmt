import React from 'react'
import { screen, render } from '@testing-library/react'

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
})
