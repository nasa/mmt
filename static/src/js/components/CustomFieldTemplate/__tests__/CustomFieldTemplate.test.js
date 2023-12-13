import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import CustomFieldTemplate from '../CustomFieldTemplate'

const setup = (overrideProps = {}) => {
  const props = {
    children: (
      <span>
        Mock Child
      </span>
    ),
    errors: (
      <span>
        Mock Errors
      </span>
    ),
    help: (
      <span>
        Mock Help
      </span>
    ),
    ...overrideProps
  }

  render(
    <BrowserRouter>
      <CustomFieldTemplate {...props} />
    </BrowserRouter>
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('CustomFieldTemplate', () => {
  describe('when showing content of the field', () => {
    test('rendering the field', () => {
      setup()
      expect(screen.getByText('Mock Child')).toBeInTheDocument()
      expect(screen.getByText('Mock Errors')).toBeInTheDocument()
      expect(screen.getByText('Mock Help')).toBeInTheDocument()
    })
  })
})
