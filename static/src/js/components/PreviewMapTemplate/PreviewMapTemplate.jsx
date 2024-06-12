import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'

/**
 * PreviewMapTemplate
 * @property {String} type Name of the field, e.x. Point.
 * @property {Object} formData Current Draft that has the value
 */

/**
 * Renders Preview Map Template Field
 * @param {PreviewMapTemplate} props
 */
const PreviewMapTemplate = ({ type, formData }) => {
  const { edscHost } = getApplicationConfig()

  const [searchQuery, setSearchQuery] = useState()

  const getMapQuery = () => {
    let query = ''
    if (type === 'point') {
      const { Longitude, Latitude } = formData

      return `sp=${encodeURIComponent(`${Longitude},${Latitude}`)}`
    }

    if (type === 'bounding_rectangle') {
      const {
        WestBoundingCoordinate, SouthBoundingCoordinate,
        EastBoundingCoordinate, NorthBoundingCoordinate
      } = formData

      return `sb=${encodeURIComponent(`${WestBoundingCoordinate},${SouthBoundingCoordinate},${EastBoundingCoordinate},${NorthBoundingCoordinate}`)}`
    }

    if (type === 'polygon') {
      const { Boundary } = formData
      const points = Boundary.Points
      points.forEach((point) => {
        if (query.length) {
          query = `${query},`
        }

        query = `${query}${point.Longitude},${point.Latitude}`
      })

      return `polygon=${encodeURIComponent(query)}`
    }

    return null
  }

  useEffect(() => {
    const query = getMapQuery()
    if (query) {
      setSearchQuery(`${edscHost}/search/map?${query}`)
    }
  }, [formData])

  if (!searchQuery) return null

  return (
    <div>
      <a href={searchQuery} target="_blank" rel="noopener noreferrer">
        <i className="eui-icon eui-fa-globe" />
        {' '}
        Preview on Map
      </a>
    </div>
  )
}

PreviewMapTemplate.propTypes = {
  type: PropTypes.string.isRequired,
  formData: PropTypes.shape({
    Longitude: PropTypes.number,
    Latitude: PropTypes.number,
    NorthBoundingCoordinate: PropTypes.number,
    SouthBoundingCoordinate: PropTypes.number,
    EastBoundingCoordinate: PropTypes.number,
    WestBoundingCoordinate: PropTypes.number,
    Boundary: PropTypes.shape({
      Points: PropTypes.arrayOf(
        PropTypes.shape({})
      )
    })
  }).isRequired
}

export default PreviewMapTemplate
