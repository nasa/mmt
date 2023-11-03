import React from 'react'
import { render, screen } from '@testing-library/react'

import For from '../For'

describe('For component', () => {
  test('renders the example text', async () => {
    render(
      <For
        each={['Item 1', 'Item 2', 'Item 3']}
      >
        {
          (item) => (
            <div key={item}>
              {item}
            </div>
          )
        }
      </For>
    )

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Item 3')).toBeInTheDocument()
  })

  test('passes the iteration as the second argument', async () => {
    render(
      <For
        each={['Item', 'Item', 'Item']}
      >
        {
          (item, i) => (
            <div key={`${item} ${i + 1}`}>
              {`${item} ${i + 1}`}
            </div>
          )
        }
      </For>
    )

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Item 3')).toBeInTheDocument()
  })
})
