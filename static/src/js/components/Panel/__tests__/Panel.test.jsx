import React from 'react'
import { render, screen } from '@testing-library/react'

import Panel from '../Panel'

const setup = () => (
  render(
    <Panel title="This is the test title">
      This is the test panel content
    </Panel>
  )
)

describe('Panel component', () => {
  test('displays the title', () => {
    setup()

    expect(screen.getByText('This is the test title')).toBeInTheDocument()
  })

  test('displays the correct content', () => {
    setup()

    expect(screen.getByText('This is the test title')).toBeInTheDocument()
    expect(screen.getByText('This is the test panel content')).toBeInTheDocument()
  })
})
