import React from 'react'
import { render, screen } from '@testing-library/react'

import ManageSection from '../ManageSection'

const setup = (overrideProps = {}) => {
  const props = {
    sections: [],
    title: 'Section Title',
    ...overrideProps
  }

  const { container } = render(
    <ManageSection {...props} />
  )

  return {
    container
  }
}

describe('Manage Section', () => {
  test('renders a title', () => {
    setup()

    expect(screen.getByRole('heading', { title: 'Section Title' })).toBeInTheDocument()
  })

  test('renders the sections', () => {
    setup({
      sections: [
        {
          key: 'section-1',
          children: (
            <span>Section 1</span>
          )
        },
        {
          key: 'section-2',
          children: (
            <span>Section 2</span>
          )
        }
      ]
    })

    expect(screen.getByText('Section 1')).toBeInTheDocument()
    expect(screen.getByText('Section 2')).toBeInTheDocument()
  })

  describe('when a section should be separated', () => {
    test('renders the sections', () => {
      setup({
        sections: [
          {
            key: 'section-1',
            children: (
              <span>Section 1</span>
            )
          },
          {
            key: 'section-2',
            separate: true,
            children: (
              <span>Section 2</span>
            )
          }
        ]
      })

      expect(screen.getByText('Section 2').parentElement).toHaveClass('py-3')
      expect(screen.getByText('Section 2').parentElement.parentElement).toHaveClass('border-bottom')
      expect(screen.getByText('Section 2').parentElement.parentElement).toHaveClass('border-secondary')
    })
  })

  describe('when a classname is defined', () => {
    test('adds the class', () => {
      const { container } = setup({
        className: 'test-classname'
      })

      expect(container.classList.contains('test-classname'))
    })
  })
})
