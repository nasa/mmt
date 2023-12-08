import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

import GridTitle from '../GridTitle'

const setup = (overrideProps = {}) => {
  const formContext = {
  }

  const props = {
    title: 'The title',
    groupClassName: 'group-class-name',
    groupBoxClassName: 'group-box-class-name',
    required: false,
    registry: {
      formContext,
      fields: {
        TitleField: () => (<div>mock title field</div>)
      }
    },
    id: 'unique-id',
    ...overrideProps
  }

  render(
    <BrowserRouter>
      <GridTitle {...props} />
    </BrowserRouter>
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('GridTitle', () => {
  describe('when there is a TitleField registered', () => {
    test('renders the title', () => {
      setup()
      expect(screen.getByText('mock title field')).toBeInTheDocument()
    })
  })

  describe('when there is no TitleField registered', () => {
    test('renders nothing', () => {
      setup({
        registry: {
          formContext: {},
          fields: {}
        }
      })

      expect(screen.queryByText('mock title field')).not.toBeInTheDocument()
    })
  })
})
