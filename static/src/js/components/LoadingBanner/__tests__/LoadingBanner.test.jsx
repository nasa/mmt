import React from 'react'

import { render } from '@testing-library/react'

import { LoadingBanner } from '../LoadingBanner'

describe('Error Banner Component', () => {
  describe('Provided a message', () => {
    test('it renders a loading banner', () => {
      const { container } = render(
        <LoadingBanner />
      )

      // Match the snapshot
      expect(container).toMatchSnapshot()
    })
  })

  describe('Provided a test id', () => {
    test('it renders a loading banner', () => {
      const { container } = render(
        <LoadingBanner dataTestId="test-spinner" />
      )

      // Match the snapshot
      expect(container).toMatchSnapshot()
    })
  })
})
