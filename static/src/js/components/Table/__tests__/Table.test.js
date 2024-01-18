import React from 'react'
import { render, screen } from '@testing-library/react'
import { FaStar } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

import Table from '../Table'

const setup = (overrideProps = {}) => {
  const props = {
    headers: [
      'column 1',
      'column 2'
    ],
    loading: false,
    renderRows: [
      {
        key: 'tools/TD1200000093-MMT_2',
        children: [
          <td key="column1">
            <Link to="url.com">
              Sample Text
            </Link>
          </td>,
          <td key="column2">
            More Sample Text
          </td>
        ]
      },
      {
        key: 'tools/TD1200000094-MMT_2',
        children: [
          <td key="column1">
            <Link to="url.com">
              Sample Text
            </Link>
          </td>,
          <td key="column2">
            More Sample Text
          </td>
        ]
      }
    ],
    ...overrideProps
  }

  render(
    <Table {...props} />
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('Table', () => {
  describe('when the table component is passed markup and data', () => {
    test('renders filled table', () => {
      setup()

      expect(screen.getByText('column 1')).toBeInTheDocument()
    })
  })

  // Describe('when the button with an icon', () => {
  //   beforeEach(() => {
  //     FaStar.mockImplementation(
  //       jest.requireActual('react-icons/fa').FaStar
  //     )
  //   })

  //   test('renders the button', () => {
  //     setup({
  //       Icon: FaStar
  //     })

  //     expect(FaStar).toHaveBeenCalledTimes(1)
  //   })
  // })

  // describe('when the button is clicked', () => {
  //   test('executes onClick callback', async () => {
  //     const { props, user } = setup()

  //     await user.click(screen.getByRole('button'))

  //     expect(props.onClick).toHaveBeenCalledTimes(1)
  //   })
  // })

  // describe('when set the specified size and variant to the button', () => {
  //   test('applies to the button', () => {
  //     setup({
  //       size: 'lg',
  //       variant: 'danger'
  //     })

  //     const button = screen.getByRole('button')

  //     expect(button).toHaveClass('btn-lg')
  //     expect(button).toHaveClass('btn-danger')
  //   })
  // })

  // describe('when set naked prop is true to the button', () => {
  //   test('applies naked style to the button', () => {
  //     setup({
  //       naked: true
  //     })

  //     const button = screen.getByRole('button')

  //     expect(button).toHaveClass('button--naked')
  //   })
  // })
})
