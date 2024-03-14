import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'

import './BoundingRectangleField.scss'

/**
 * BoundingRectangleField
 * @property {Object} formData Saved draft.
 * @property {Function} onChange A callback function triggered when the user inputs a text.
 */

/**
 * Renders Bounding Rectangle Field
 * @param {BoundingRectangleField} props
 */
const BoundingRectangleField = ({
  formData,
  onChange
}) => {
  // Creates state object from given coordinates
  const createStateObject = (object) => {
    const {
      EastBoundingCoordinate,
      NorthBoundingCoordinate,
      SouthBoundingCoordinate,
      WestBoundingCoordinate
    } = object

    return {
      EastBoundingCoordinate: EastBoundingCoordinate || '',
      NorthBoundingCoordinate: NorthBoundingCoordinate || '',
      SouthBoundingCoordinate: SouthBoundingCoordinate || '',
      WestBoundingCoordinate: WestBoundingCoordinate || ''
    }
  }

  // Uses state hook for coordinates
  const [coordinates, setCoordinates] = useState(createStateObject(formData))
  // Handles button click 'Apply Global Spatial Coverage'
  const handleApplyGlobal = () => {
    // Declares the global coordinates
    const data = {
      EastBoundingCoordinate: 180,
      NorthBoundingCoordinate: 90,
      SouthBoundingCoordinate: -90,
      WestBoundingCoordinate: -180
    }

    // Stores as state object
    setCoordinates(createStateObject(data))

    // Propagates change
    onChange(data)
  }

  // Coverts coordinate string value to number
  const toNumber = (value) => (!value ? null : Number(value))

  // Handles coordinate in put field value change
  const handleChange = (field, event) => {
    const { value } = event.target

    const data = formData
    data[field] = toNumber(value)

    // Stores as state object
    setCoordinates(createStateObject(data))

    // Propagates change
    onChange(data)
  }

  // Reads coordinate values stored in state
  const {
    EastBoundingCoordinate,
    NorthBoundingCoordinate,
    SouthBoundingCoordinate,
    WestBoundingCoordinate
  } = coordinates

  return (
    <div>
      <div>
        <Button
          variant="primary"
          onClick={handleApplyGlobal}
        >
          Apply Global Spatial Coverage
        </Button>
      </div>

      <div className="bounding-rectangle-container">
        <div className="bounding-rectangle-north-row">
          <div className="bounding-rectangle-coordinate-label">
            <label htmlFor="north-coordinate">North</label>
            <input
              className="form-control bounding-rectangle-coordinate"
              type="number"
              id="north-coordinate"
              onChange={
                (event) => {
                  handleChange('NorthBoundingCoordinate', event)
                }
              }
              value={NorthBoundingCoordinate}
            />
          </div>
        </div>

        <div className="bounding-rectangle-east-west-row">
          <div>
            <div className="bounding-rectangle-coordinate-label">
              <label htmlFor="west-coordinate">West</label>
            </div>

            <input
              className="form-control bounding-rectangle-coordinate"
              type="number"
              id="west-coordinate"
              onChange={
                (event) => {
                  handleChange('WestBoundingCoordinate', event)
                }
              }
              value={WestBoundingCoordinate}
            />
          </div>

          <div>
            <div className="bounding-rectangle-coordinate-label">
              <label htmlFor="east-coordinate">East</label>
            </div>

            <input
              className="form-control bounding-rectangle-coordinate"
              type="number"
              id="east-coordinate"
              onChange={
                (event) => {
                  handleChange('EastBoundingCoordinate', event)
                }
              }
              value={EastBoundingCoordinate}
            />
          </div>
        </div>

        <div className="bounding-rectangle-south-row">
          <div className="bounding-rectangle-coordinate-label">
            <label htmlFor="south-coordinate">South</label>
            <input
              className="form-control bounding-rectangle-coordinate"
              type="number"
              id="south-coordinate"
              width="100px"
              onChange={
                (event) => {
                  handleChange('SouthBoundingCoordinate', event)
                }
              }
              value={SouthBoundingCoordinate}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

BoundingRectangleField.propTypes = {
  formData: PropTypes.shape({
    NorthBoundingCoordinate: PropTypes.number,
    SouthBoundingCoordinate: PropTypes.number,
    EastBoundingCoordinate: PropTypes.number,
    WestBoundingCoordinate: PropTypes.number
  }).isRequired,
  onChange: PropTypes.func.isRequired
}

export default BoundingRectangleField
