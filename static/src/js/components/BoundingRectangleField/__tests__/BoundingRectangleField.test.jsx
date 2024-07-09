import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import BoundingRectangleField from '../BoundingRectangleField'

const setup = (overrideProps = {}) => {
  const onChange = vi.fn()
  const props = {
    onChange,
    formData: {
      NorthBoundingCoordinate: 89,
      SouthBoundingCoordinate: -89,
      WestBoundingCoordinate: -179,
      EastBoundingCoordinate: 179
    },
    schema: {
      properties: {
        EastBoundingCoordinate: {
          description: 'The longitude value of a spatially referenced point, in degrees. Longitude values range from -180 to 180.'
        },
        NorthBoundingCoordinate: {
          description: 'The latitude value of a spatially referenced point, in degrees. Latitude values range from -90 to 90.'
        }
      }
    },
    ...overrideProps
  }

  render(
    <BoundingRectangleField {...props} />
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

      const north = screen.getByRole('spinbutton', { name: 'North' })
      expect(north).toHaveValue(89)

      const west = screen.getByRole('spinbutton', { name: 'West' })
      expect(west).toHaveValue(-179)

      const east = screen.getByRole('spinbutton', { name: 'East' })
      expect(east).toHaveValue(179)

      const south = screen.getByRole('spinbutton', { name: 'South' })
      expect(south).toHaveValue(-89)
    })
  })

  describe('when no coordinates are given', () => {
    test('renders the fields', () => {
      setup({
        formData: {}
      })

      const north = screen.getByRole('spinbutton', { name: 'North' })
      expect(north).toHaveValue(null)

      const west = screen.getByRole('spinbutton', { name: 'West' })
      expect(west).toHaveValue(null)

      const east = screen.getByRole('spinbutton', { name: 'East' })
      expect(east).toHaveValue(null)

      const south = screen.getByRole('spinbutton', { name: 'South' })
      expect(south).toHaveValue(null)
    })
  })

  describe('when apply global coordinates', () => {
    test('renders the fields', async () => {
      const { user } = setup({
        formData: {}
      })

      await user.click(screen.getByRole('button', { name: 'Apply Global Spatial Coverage' }))

      const north = screen.getByRole('spinbutton', { name: 'North' })
      expect(north).toHaveValue(90)

      const west = screen.getByRole('spinbutton', { name: 'West' })
      expect(west).toHaveValue(-180)

      const east = screen.getByRole('spinbutton', { name: 'East' })
      expect(east).toHaveValue(180)

      const south = screen.getByRole('spinbutton', { name: 'South' })
      expect(south).toHaveValue(-90)
    })
  })

  describe('when west coordinate field is changed', () => {
    test('updates the field and calls onChange', async () => {
      const {
        props,
        user
      } = setup({
        formData: {}
      })

      const west = screen.getByRole('spinbutton', { name: 'West' })
      await user.type(west, '-45')

      expect(west).toHaveValue(-45)

      expect(props.onChange).toHaveBeenCalledTimes(2)
      expect(props.onChange).toHaveBeenCalledWith({ WestBoundingCoordinate: -45 })
    })
  })

  describe('when south coordinate field is changed', () => {
    test('updates the field and calls onChange', async () => {
      const {
        props,
        user
      } = setup({
        formData: {}
      })

      const south = screen.getByRole('spinbutton', { name: 'South' })
      await user.type(south, '-50')

      expect(south).toHaveValue(-50)

      expect(props.onChange).toHaveBeenCalledTimes(2)
      expect(props.onChange).toHaveBeenCalledWith({ SouthBoundingCoordinate: -50 })
    })
  })

  describe('when east coordinate field is changed', () => {
    test('updates the field and calls onChange', async () => {
      const {
        props,
        user
      } = setup({
        formData: {}
      })

      const east = screen.getByRole('spinbutton', { name: 'East' })
      await user.type(east, '45')

      expect(east).toHaveValue(45)

      expect(props.onChange).toHaveBeenCalledTimes(2)
      expect(props.onChange).toHaveBeenCalledWith({ EastBoundingCoordinate: 45 })
    })
  })

  describe('when north coordinate field is changed', () => {
    test('updates the field and calls onChange', async () => {
      const {
        props,
        user
      } = setup({
        formData: {}
      })

      const north = screen.getByRole('spinbutton', { name: 'North' })
      await user.type(north, '60')

      expect(north).toHaveValue(60)

      expect(props.onChange).toHaveBeenCalledTimes(2)
      expect(props.onChange).toHaveBeenCalledWith({ NorthBoundingCoordinate: 60 })
    })
  })
})
