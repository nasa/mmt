import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PreviewMapTemplate from '../PreviewMapTemplate'

const setup = ({ props }) => {
  const user = userEvent.setup()

  const { container } = render(
    <PreviewMapTemplate {...props} />
  )

  return {
    container,
    user
  }
}

describe('PreviewMapTemplate', () => {
  describe('when the type is point', () => {
    test('renders a link with the point url', () => {
      const props = {
        formData: {
          Longitude: 10,
          Latitude: 20
        },
        type: 'point'
      }

      setup({ props })

      expect(screen.getByRole('link')).toHaveAttribute('href', 'https://search.sit.earthdata.nasa.gov/search/map?sp=10%2C20')
    })
  })

  describe('when the type is bounding rectangle', () => {
    test('renders a link with the bounding rectangle', () => {
      const props = {
        formData: {
          WestBoundingCoordinate: -40,
          SouthBoundingCoordinate: 10,
          EastBoundingCoordinate: 50,
          NorthBoundingCoordinate: 70
        },
        type: 'bounding_rectangle'
      }

      setup({ props })

      expect(screen.getByRole('link')).toHaveAttribute('href', 'https://search.sit.earthdata.nasa.gov/search/map?sb=-40%2C10%2C50%2C70')
    })
  })

  describe('when the type is bounding rectangle', () => {
    test('renders a link with the bounding rectangle', () => {
      const props = {
        formData: {
          Boundary: {
            Points: [
              {
                Longitude: -30,
                Latitude: 50
              },
              {
                Longitude: 10,
                Latitude: 40
              },
              {
                Longitude: 35,
                Latitude: 50
              },
              {
                Longitude: -30,
                Latitude: 50
              }
            ]
          }
        },
        type: 'polygon'
      }

      setup({ props })

      expect(screen.getByRole('link')).toHaveAttribute('href', 'https://search.sit.earthdata.nasa.gov/search/map?polygon=-30%2C50%2C10%2C40%2C35%2C50%2C-30%2C50')
    })
  })

  describe('when the type is bounding rectangle', () => {
    test('renders a link with the bounding rectangle', () => {
      const props = {
        formData: {},
        type: ''
      }

      const { container } = setup({ props })

      expect(container).toBeEmptyDOMElement()
    })
  })
})
