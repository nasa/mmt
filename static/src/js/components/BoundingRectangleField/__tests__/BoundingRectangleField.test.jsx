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

      const spinbuttons = screen.getAllByRole('spinbutton')

      const north = spinbuttons[0]
      expect(north).toHaveValue(89)

      const west = spinbuttons[1]
      expect(west).toHaveValue(-179)

      const east = spinbuttons[2]
      expect(east).toHaveValue(179)

      const south = spinbuttons[3]
      expect(south).toHaveValue(-89)
    })
  })

  describe('when no coordinates are given', () => {
    test('renders the fields', () => {
      setup({
        formData: {}
      })

      const spinbuttons = screen.getAllByRole('spinbutton')

      const north = spinbuttons[0]
      expect(north).toHaveValue(null)

      const west = spinbuttons[1]
      expect(west).toHaveValue(null)

      const east = spinbuttons[2]
      expect(east).toHaveValue(null)

      const south = spinbuttons[3]
      expect(south).toHaveValue(null)
    })
  })

  describe('when apply global coordinates', () => {
    test('renders the fields', async () => {
      const { user } = setup({
        formData: {}
      })

      await user.click(screen.getByRole('button', { name: 'Apply Global Spatial Coverage' }))

      const spinbuttons = screen.getAllByRole('spinbutton')

      const north = spinbuttons[0]
      expect(north).toHaveValue(90)

      const west = spinbuttons[1]
      expect(west).toHaveValue(-180)

      const east = spinbuttons[2]
      expect(east).toHaveValue(180)

      const south = spinbuttons[3]
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

      const spinbuttons = screen.getAllByRole('spinbutton')

      const west = spinbuttons[1]
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

      const spinbuttons = screen.getAllByRole('spinbutton')

      const south = spinbuttons[3]
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

      const spinbuttons = screen.getAllByRole('spinbutton')

      const east = spinbuttons[2]
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

      const spinbuttons = screen.getAllByRole('spinbutton')

      const north = spinbuttons[0]
      await user.type(north, '60')

      expect(north).toHaveValue(60)

      expect(props.onChange).toHaveBeenCalledTimes(2)
      expect(props.onChange).toHaveBeenCalledWith({ NorthBoundingCoordinate: 60 })
    })
  })
})
