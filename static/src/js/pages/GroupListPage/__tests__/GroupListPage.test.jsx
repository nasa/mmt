import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import AppContext from '../../../context/AppContext'

import GroupList from '../../../components/GroupList/GroupList'
import GroupSearchForm from '../../../components/GroupSearchForm/GroupSearchForm'
import GroupListPage from '../GroupListPage'

vi.mock('../../../components/GroupList/GroupList')
vi.mock('../../../components/GroupSearchForm/GroupSearchForm')

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

      expect(screen.getByRole('heading', { value: 'Groups' })).toBeInTheDocument()
      expect(GroupList).toHaveBeenCalled(1)
      expect(GroupSearchForm).toHaveBeenCalled(1)
    })
  })
})
