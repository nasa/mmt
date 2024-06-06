import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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

  const user = userEvent.setup()

  render(
    <CustomFieldTemplate {...props} />
  )

  return {
    props,
    user
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
