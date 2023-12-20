import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import CustomWidgetWrapper from '../CustomWidgetWrapper'

const setup = (overrideProps = {}) => {
  const props = {
    charactersUsed: null,
    children: (<div>Children</div>),
    description: null,
    id: 'mock-id',
    maxLength: null,
    required: false,
    scrollRef: React.createRef(),
    title: 'Mock Field',
    ...overrideProps
  }

  render(
    <CustomWidgetWrapper {...props} />
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('CustomWidgetWrapper', () => {
  test('renders a header', () => {
    setup()

    expect(screen.getByText('Mock Field')).toBeInTheDocument()
    expect(screen.getByText('Children')).toBeInTheDocument()
  })

  test('renders a header with required indicator', () => {
    setup({
      required: true
    })

    expect(screen.getByText('Mock Field')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Required' })).toBeInTheDocument()
  })

  test('renders a description', async () => {
    const { user } = setup({
      description: 'Mock Field Description'
    })

    expect(screen.getByText('Mock Field')).toBeInTheDocument()

    const helpTrigger = screen.getByRole('button', { name: 'Help' })

    await user.hover(helpTrigger)

    expect(screen.getByText('Mock Field Description')).toBeInTheDocument()

    await user.unhover(helpTrigger)

    expect(screen.queryByText('Mock Field Description')).not.toBeInTheDocument()
  })

  test('renders a length indicator', () => {
    setup({
      charactersUsed: 5,
      maxLength: 42
    })

    expect(screen.getByText('Mock Field')).toBeInTheDocument()
    expect(screen.getByText('5/42 characters')).toBeInTheDocument()
  })
})
