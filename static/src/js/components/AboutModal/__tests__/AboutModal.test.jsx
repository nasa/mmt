import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as getConfig from '../../../../../../sharedUtils/getConfig'

import AboutModal from '../AboutModal'

vi.spyOn(getConfig, 'getApplicationConfig').mockReturnValue({ version: 'test' })

const setup = ({
  overrideProps = {}
} = {}) => {
  const props = {
    show: false,
    toggleModal: vi.fn(),
    ...overrideProps
  }

  const user = userEvent.setup()

  const { container } = render(
    <AboutModal {...props} />
  )

  return {
    container,
    props,
    user
  }
}

describe('AboutModal component', () => {
  describe('when show is false', () => {
    test('does not render the modal', () => {
      const { container } = setup()

      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('when show is true', () => {
    test('renders the modal correctly', () => {
      setup({
        overrideProps: {
          show: true
        }
      })

      expect(screen.getByText('Metadata Management Tool')).toBeDefined()
      expect(screen.getByText('vtest')).toBeDefined()
    })
  })

  describe('when the close button is clicked', () => {
    test('calls the toggleModal callback with false', async () => {
      const toggleModalMock = vi.fn()

      const { user } = setup({
        overrideProps: {
          show: true,
          toggleModal: toggleModalMock
        }
      })

      const button = screen.getByRole('button', { name: /Close/i })

      await user.click(button)

      expect(toggleModalMock).toHaveBeenCalledTimes(1)
      expect(toggleModalMock).toHaveBeenCalledWith(false)
    })
  })
})
