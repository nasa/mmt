import React from 'react'
import PropTypes from 'prop-types'

class PreviewMapLink extends React.Component {
  getMapQuery(data, type) {
    let query = ''
    if (type === 'point') {
      if (data.Longitude && data.Latitude) {
        query = `${data.Longitude},${data.Latitude}`
      }

      if (query.length) {
        query = `sp=${encodeURIComponent(query)}`
      }

      return query
    }

    if (type === 'bounding_rectangle') {
      if (
        data.WestBoundingCoordinate
        && data.SouthBoundingCoordinate
        && data.EastBoundingCoordinate
        && data.NorthBoundingCoordinate
      ) {
        query = `${data.WestBoundingCoordinate},${data.SouthBoundingCoordinate},${data.EastBoundingCoordinate},${data.NorthBoundingCoordinate}`
      }

      if (query.length) {
        query = `sb=${encodeURIComponent(query)}`
      }

      return query
    }

    if (type === 'polygon') {
      const points = data.Boundary.Points
      points.forEach((point) => {
        if (point.Longitude && point.Latitude) {
          if (query.length) {
            query = `${query},`
          }

          query = `${query}${point.Longitude},${point.Latitude}`
        }
      })

      if (query.length) {
        query = `polygon=${encodeURIComponent(query)}`
      }

      return query
    }

    return ''
  }

  render() {
    const { type, formData } = this.props
    let url = process.env.REACT_APP_PREVIEW_MAP_URL ? process.env.REACT_APP_PREVIEW_MAP_URL : 'https://search.earthdata.nasa.gov/search/map'
    const mapQuery = this.getMapQuery(formData, type)
    if (mapQuery.length) {
      url = `${url}?${mapQuery}`
    }

    return (
      <div>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <i className="eui-icon eui-fa-globe" />
          {' '}
          Preview on Map
        </a>
      </div>
    )
  }
}

PreviewMapLink.propTypes = {
  type: PropTypes.string.isRequired,
  formData: PropTypes.shape({
    Longitude: PropTypes.number,
    Latitude: PropTypes.number,
    WestBoundingCoordinate: PropTypes.number,
    SouthBoundingCoordinate: PropTypes.number,
    EastBoundingCoordinate: PropTypes.number,
    NorthBoundingCoordinate: PropTypes.number,
    Boundary: PropTypes.shape({
      Points: PropTypes.arrayOf(
        PropTypes.shape({
          Longitude: PropTypes.number.isRequired,
          Latitude: PropTypes.number.isRequired
        })
      )
    })
  }).isRequired
}

export default PreviewMapLink
