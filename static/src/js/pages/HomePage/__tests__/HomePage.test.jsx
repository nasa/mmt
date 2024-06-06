import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import * as router from 'react-router'

import AuthContext from '@/js/context/AuthContext'

import HomePage from '../HomePage'

const setup = ({
  overrideContext = {}
} = {}) => {
  vi.setSystemTime('2024-01-01')

  const context = {
    tokenExpires: new Date().getTime() - 1,
    ...overrideContext
  }

  render(
    <AuthContext.Provider value={context}>
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    </AuthContext.Provider>
  )
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
      const text = screen.getByText('The MMT is a web-based user interface to the NASA EOSDIS Common Metadata Repository (CMR). The MMT allows metadata authors to create and update CMR metadata records by using a data entry form based on the metadata fields in the CMR Unified Metadata Model (UMM). Metadata authors may also publish, view, delete, and manage revisions of CMR metadata records using the MMT.')
      expect(text).toBeInTheDocument()
    })

    test('redirects to /collections if user is logged in with a token', () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      let expires = new Date()
      expires.setMinutes(expires.getMinutes() + 15)
      expires = new Date(expires)

      setup({
        overrideContext: {
          tokenExpires: new Date().getTime() + 1
        }
      })

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('/collections', { replace: true })
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
      const text = screen.getByText('The CMR is a high-performance, high-quality metadata repository for earth science metadata records. The CMR manages the evolution of NASA Earth Science metadata in a unified and consistent way by providing a central storage and access capability that streamlines current workflows while increasing overall metadata quality and anticipating future capabilities.')

      expect(text).toBeInTheDocument()
    })
  })
})
