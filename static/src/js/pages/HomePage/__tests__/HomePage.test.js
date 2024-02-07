import React from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import HomePage from '../HomePage'
import AppContext from '../../../context/AppContext'

const setup = ({
  overrideContext = {}
} = {}) => {
  const context = {
    user: {
      name: 'User Name',
      token: 'ABC-1',
      providerId: 'MMT-2'
    },
    login: jest.fn(),
    logout: jest.fn(),
    ...overrideContext
  }
  render(
    <AppContext.Provider value={context}>
      <HomePage />
    </AppContext.Provider>
  )

  return {
    context
  }
}

describe('HomePage component', () => {
  describe('when the about MMT section is displayed', () => {
    beforeEach(() => {
      setup()
    })

    test('displays the title', () => {
      const title = screen.getByText('About the Metadata Management Tool (MMT)')
      expect(title).toBeInTheDocument()
    })

    test('displays the correct content', () => {
      const parent = screen.getByText('About the Metadata Management Tool (MMT)').parentElement.parentElement

      const text = within(parent).getByText('The MMT is a web-based user interface to the NASA EOSDIS Common Metadata Repository (CMR). The MMT allows metadata authors to create and update CMR metadata records by using a data entry form based on the metadata fields in the CMR Unified Metadata Model (UMM). Metadata authors may also publish, view, delete, and manage revisions of CMR metadata records using the MMT.')
      expect(text).toBeInTheDocument()
    })
  })

  describe('when the about CMR section is displayed', () => {
    beforeEach(() => {
      setup()
    })

    test('displays the title', () => {
      const title = screen.getByText('About the Common Metadata Repository (CMR)')
      expect(title).toBeInTheDocument()
    })

    test('displays the correct content', () => {
      const parent = screen.getByText('About the Common Metadata Repository (CMR)').parentElement.parentElement

      const text = within(parent).getByText('The CMR is a high-performance, high-quality metadata repository for earth science metadata records. The CMR manages the evolution of NASA Earth Science metadata in a unified and consistent way by providing a central storage and access capability that streamlines current workflows while increasing overall metadata quality and anticipating future capabilities.')
      expect(text).toBeInTheDocument()
    })
  })
})
