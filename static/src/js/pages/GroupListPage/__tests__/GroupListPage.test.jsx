import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import AppContext from '../../../context/AppContext'

import GroupList from '../../../components/GroupList/GroupList'
import GroupListPage from '../GroupListPage'

vi.mock('../../../components/GroupList/GroupList')

const setup = () => {
  render(
    <AppContext.Provider value={
      {
        user: {
          providerId: 'MMT_2'
        }
      }
    }
    >
      <BrowserRouter>
        <GroupListPage />
      </BrowserRouter>
    </AppContext.Provider>
  )
}

describe('GroupListPage', () => {
  describe('show group page', () => {
    test('render the page and calls GroupList', async () => {
      setup()

      expect(screen.getByText('MMT_2 Groups')).toBeInTheDocument()
      expect(GroupList).toHaveBeenCalled(1)
    })
  })
})
