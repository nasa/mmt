import React from 'react'
import { render } from '@testing-library/react'

import Providers from '../Providers'

import AppContextProvider from '../../AppContextProvider/AppContextProvider'
import NotificationsContextProvider from '../../NotificationsContextProvider/NotificationsContextProvider'

jest.mock('../../AppContextProvider/AppContextProvider', () => jest.fn(({ children }) => (
  <mock-Component data-testid="AppContextProvider">
    {children}
  </mock-Component>
)))

jest.mock('../../NotificationsContextProvider/NotificationsContextProvider', () => jest.fn(({ children }) => (
  <mock-Component data-testid="NotificationsContextProvider">
    {children}
  </mock-Component>
)))

describe('Providers', () => {
  test('renders all providers', () => {
    render(<Providers>Test</Providers>)

    expect(AppContextProvider).toHaveBeenCalledTimes(1)
    expect(NotificationsContextProvider).toHaveBeenCalledTimes(1)
  })
})
