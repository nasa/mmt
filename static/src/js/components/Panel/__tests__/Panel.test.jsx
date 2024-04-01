import React from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'

import Panel from '../Panel'

const setup = () => (
  render(
    <Panel title="This is the test title">
      This is the test panel content
    </Panel>
  )
)

describe('Panel component', () => {
  beforeEach(() => {
    setup()
  })

  test('displays the title', () => {
    const title = screen.getByText('This is the test title')
    expect(title).toBeInTheDocument()
  })

  test('displays the correct content', () => {
    const parent = screen.getByText('This is the test title').parentElement.parentElement

    const text = within(parent).getByText('This is the test panel content')
    expect(text).toBeInTheDocument()
  })
})
