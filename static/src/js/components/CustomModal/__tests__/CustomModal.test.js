import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import CustomModal from '../CustomModal'

const setup = () => {
  const onClick = jest.fn()
  const props = {
    openModal: true,
    message: 'Mock message',
    actions:
      [
        {
          label: 'Yes',
          variant: 'primary',
          onClick: onClick
        }
      ]
  }

  render(<CustomModal {...props} />)

  return{ 
    props
  }
}

describe('CustomModal', () => {
  test('render a Modal', () => {
    setup()
    expect(screen.getByText('Mock message')).toBeInTheDocument()

  })

  describe('when selecting `Yes`', () => {
    test('calls onClick', async () => {
      const { props } = setup()

      const button = screen.getByText('Yes')
      await userEvent.click(button)

      const onClickProp = props.actions.at(0).onClick
      expect(onClickProp).toHaveBeenCalledTimes(1)
    })
  })
})
