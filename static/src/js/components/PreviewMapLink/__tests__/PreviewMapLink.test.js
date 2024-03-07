import React from 'react'
import { render } from '@testing-library/react'
import PreviewMapLink from '../PreviewMapLink'

describe('PreviewMapLink Test', () => {
  it('link to preview map with a point', async () => {
    const props = {
      formData: {
        Longitude: 10,
        Latitude: 20
      }
    }
    const { container } = render(
      <PreviewMapLink {...props} type="point" />
    )
    expect(document.querySelector('a').getAttribute('href')).toBe('https://search.earthdata.nasa.gov/search/map?sp=10%2C20')
    expect(container).toMatchSnapshot()
  })

  it('link to preview map with a bounding rectangle', async () => {
    const props = {
      formData: {
        WestBoundingCoordinate: -40,
        SouthBoundingCoordinate: 10,
        EastBoundingCoordinate: 50,
        NorthBoundingCoordinate: 70
      }
    }
    const { container } = render(
      <PreviewMapLink {...props} type="bounding_rectangle" />
    )
    expect(document.querySelector('a').getAttribute('href')).toBe('https://search.earthdata.nasa.gov/search/map?sb=-40%2C10%2C50%2C70')
    expect(container).toMatchSnapshot()
  })

  it('link to preview map with a polygon', async () => {
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
            },
          ]
        }
      }
    }
    const { container } = render(
      <PreviewMapLink {...props} type="polygon" />
    )
    expect(document.querySelector('a').getAttribute('href')).toBe('https://search.earthdata.nasa.gov/search/map?polygon=-30%2C50%2C10%2C40%2C35%2C50%2C-30%2C50')
    expect(container).toMatchSnapshot()
  })

  it('link to preview map without parameters', async () => {
    const props = {
      formData: {
      }
    }
    const { container } = render(
      <PreviewMapLink {...props} type="bounding_rechtangle" />
    )
    expect(document.querySelector('a').getAttribute('href')).toBe('https://search.earthdata.nasa.gov/search/map')
    expect(container).toMatchSnapshot()
  })
})
