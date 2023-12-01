import React from 'react'
import { render, screen } from '@testing-library/react'

import ManageSection from '../ManageSection'

describe('Manage Section', () => {
  test('renders a title', () => {
    render(
      <ManageSection
        title="Section Title"
        sections={[]}
      />
    )

    expect(screen.getByRole('heading', { title: 'Section Title' }))
  })

  test('renders the sections', () => {
    render(
      <ManageSection
        title="Section Title"
        sections={
          [
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
        }
      />
    )

    expect(screen.getByText('Section 1')).toBeInTheDocument()
    expect(screen.getByText('Section 2')).toBeInTheDocument()
  })

  describe('when a section should be separated', () => {
    test('renders the sections', () => {
      render(
        <ManageSection
          title="Section Title"
          sections={
            [
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
          }
        />
      )

      expect(screen.getByText('Section 2').parentElement).toHaveClass('py-3')
      expect(screen.getByText('Section 2').parentElement.parentElement).toHaveClass('border-bottom')
      expect(screen.getByText('Section 2').parentElement.parentElement).toHaveClass('border-secondary')
    })
  })

  describe('when a classname is defined', () => {
    test('adds the class', () => {
      const { container } = render(
        <ManageSection
          className="test-classname"
          title="Section Title"
          sections={[]}
        />
      )

      expect(container.classList.contains('test-classname'))
    })
  })
})
