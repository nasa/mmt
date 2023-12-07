import React from 'react'
import {
  render,
  screen,
  fireEvent
} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import BoundingRectangleField from '../BoundingRectangleField'

const setup = (overrideProps = {}) => {
  const onChange = jest.fn()
  const props = {
    onChange,
    formData: {
      NorthBoundingCoordinate: 89,
      SouthBoundingCoordinate: -89,
      WestBoundingCoordinate: -179,
      EastBoundingCoordinate: 179
    },
    ...overrideProps
  }

  render(
    <BrowserRouter>
      <BoundingRectangleField {...props} />
    </BrowserRouter>
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('BoundingRectangleField', () => {
  describe('when coordinates are given', () => {
    test('renders the fields', () => {
      setup()

      const west = screen.getByLabelText('West')
      expect(west).toHaveValue(-179)
      const south = screen.getByLabelText('South')
      expect(south).toHaveValue(-89)
      const east = screen.getByLabelText('East')
      expect(east).toHaveValue(179)
      const north = screen.getByLabelText('North')
      expect(north).toHaveValue(89)
    })
  })

  describe('when no coordinates are given', () => {
    test('renders the fields', () => {
      setup({
        formData: {}
      })

      const west = screen.getByLabelText('West')
      expect(west).toHaveValue(null)
      const south = screen.getByLabelText('South')
      expect(south).toHaveValue(null)
      const east = screen.getByLabelText('East')
      expect(east).toHaveValue(null)
      const north = screen.getByLabelText('North')
      expect(north).toHaveValue(null)
    })
  })

  describe('when apply global coordinates', () => {
    test('renders the fields', () => {
      setup({
        formData: {}
      })

      fireEvent.click(screen.getByRole('button'))
      const west = screen.getByLabelText('West')
      expect(west).toHaveValue(-180)
      const south = screen.getByLabelText('South')
      expect(south).toHaveValue(-90)
      const east = screen.getByLabelText('East')
      expect(east).toHaveValue(180)
      const north = screen.getByLabelText('North')
      expect(north).toHaveValue(90)
    })
  })

  describe('when west coordinate field is changed', () => {
    test('updates the field and calls onChange', async () => {
      const { props, user } = setup({
        formData: {}
      })

      const west = screen.getByLabelText('West')
      await user.type(west, '-45')
      expect(props.onChange).toHaveBeenCalledTimes(2)
      expect(props.onChange).toHaveBeenCalledWith({ WestBoundingCoordinate: -45 })
      expect(west).toHaveValue(-45)
    })
  })

  describe('when south coordinate field is changed', () => {
    test('updates the field and calls onChange', async () => {
      const { props, user } = setup({
        formData: {}
      })

      const south = screen.getByLabelText('South')
      await user.type(south, '-50')
      expect(props.onChange).toHaveBeenCalledTimes(2)
      expect(props.onChange).toHaveBeenCalledWith({ SouthBoundingCoordinate: -50 })
      expect(south).toHaveValue(-50)
    })
  })

  describe('when east coordinate field is changed', () => {
    test('updates the field and calls onChange', async () => {
      const { props, user } = setup({
        formData: {}
      })

      const east = screen.getByLabelText('East')
      await user.type(east, '45')
      expect(props.onChange).toHaveBeenCalledTimes(2)
      expect(props.onChange).toHaveBeenCalledWith({ EastBoundingCoordinate: 45 })
      expect(east).toHaveValue(45)
    })
  })

  describe('when north coordinate field is changed', () => {
    test('updates the field and calls onChange', async () => {
      const { props, user } = setup({
        formData: {}
      })

      const north = screen.getByLabelText('North')
      await user.type(north, '60')
      expect(props.onChange).toHaveBeenCalledTimes(2)
      expect(props.onChange).toHaveBeenCalledWith({ NorthBoundingCoordinate: 60 })
      expect(north).toHaveValue(60)
    })
  })
})
