import React from 'react'
import { render } from '@testing-library/react'

import Providers from '../Providers'

import AppContextProvider from '../../AppContextProvider/AppContextProvider'
import NotificationsContextProvider from '../../NotificationsContextProvider/NotificationsContextProvider'

import AuthContextProvider from '../../AuthContextProvider/AuthContextProvider'
import GraphQLProvider from '../../GraphQLProvider/GraphQLProvider'

global.fetch = jest.fn()

jest.mock('../../AuthContextProvider/AuthContextProvider', () => jest.fn(({ children }) => (
  <mock-Component data-testid="AuthContextProvider">
    {children}
  </mock-Component>
)))

jest.mock('../../GraphQLProvider/GraphQLProvider', () => jest.fn(({ children }) => (
  <mock-Component data-testid="GraphQLProvider">
    {children}
  </mock-Component>
)))

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
    render(
      <Providers>
        Test
      </Providers>
    )

    expect(AuthContextProvider).toHaveBeenCalledTimes(1)
    expect(AppContextProvider).toHaveBeenCalledTimes(1)
    expect(GraphQLProvider).toHaveBeenCalledTimes(1)
    expect(NotificationsContextProvider).toHaveBeenCalledTimes(1)
  })
})
