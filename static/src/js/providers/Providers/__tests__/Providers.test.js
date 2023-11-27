import React from 'react'
import { render } from '@testing-library/react'

import Providers from '../Providers'

import AppContextProvider from '../../AppContextProvider/AppContextProvider'

jest.mock('../../AppContextProvider/AppContextProvider', () => jest.fn(({ children }) => (
  <mock-Component data-testid="AppContextProvider">
    {children}
  </mock-Component>
)))

describe('Providers', () => {
  test('renders all providers', () => {
    render(<Providers>Test</Providers>)

    expect(AppContextProvider).toHaveBeenCalledTimes(1)
  })
})
