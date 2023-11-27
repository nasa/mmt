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
      NorthBoundingCoordinate,
      SouthBoundingCoordinate,
      WestBoundingCoordinate,
      EastBoundingCoordinate
    } = object

    return {
      NorthBoundingCoordinate: NorthBoundingCoordinate || '',
      SouthBoundingCoordinate: SouthBoundingCoordinate || '',
      EastBoundingCoordinate: EastBoundingCoordinate || '',
      WestBoundingCoordinate: WestBoundingCoordinate || ''
    }
  }

  // Uses state hook for coordinates
  const [coordinates, setCoordinates] = useState(createStateObject(formData))
  // Handles button click 'Apply Global Spatial Coverage'
  const handleApplyGlobal = () => {
    // Declares the global coordinates
    const data = {
      NorthBoundingCoordinate: 90,
      SouthBoundingCoordinate: -90,
      WestBoundingCoordinate: -180,
      EastBoundingCoordinate: 180
    }
    // Stores as state object
    setCoordinates(createStateObject(data))
    // Propagates change
    onChange(data)
  }

  // Coverts coordinate string value to number
  const toNumber = (value) => (!value ? null : Number(value))
  // Handles coordinate in put field value change
  const handleChange = (field, value) => {
    const data = formData
    data[field] = toNumber(value)
    // Stores as state object
    setCoordinates(createStateObject(data))
    // Propagates change
    onChange(data)
  }

  // Reads coordinate values stored in state
  const {
    NorthBoundingCoordinate,
    SouthBoundingCoordinate,
    WestBoundingCoordinate,
    EastBoundingCoordinate
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

      <div className="bounding-rectangle-field__container">
        <div className="bounding-rectangle-field__container--north-row">
          <div className="bounding-rectangle-field__container--coordinate-label">
            North
            <input
              className="form-control bounding-rectangle-field__container--coordinate-input"
              type="number"
              onChange={
                (e) => {
                  handleChange('NorthBoundingCoordinate', e.target.value)
                }
              }
              value={NorthBoundingCoordinate}
            />
          </div>
        </div>

        <div className="bounding-rectangle-field__container--east-west-row">
          <div>
            <div className="bounding-rectangle-field__container--coordinate-label">
              West
            </div>

            <input
              className="form-control bounding-rectangle-field__container--coordinate-input"
              type="number"
              onChange={
                (e) => {
                  handleChange('WestBoundingCoordinate', e.target.value)
                }
              }
              value={WestBoundingCoordinate}
            />
          </div>

          <div>
            <div className="bounding-rectangle-field__container--coordinate-label">
              East
            </div>

            <input
              className="form-control bounding-rectangle-field__container--coordinate-input"
              type="number"
              onChange={
                (e) => {
                  handleChange('EastBoundingCoordinate', e.target.value)
                }
              }
              value={EastBoundingCoordinate}
            />
          </div>
        </div>

        <div className="bounding-rectangle-field__container--south-row">
          <div className="bounding-rectangle-field__container--coordinate-label">
            South
            <input
              className="form-control bounding-rectangle-field__container--coordinate-input"
              type="number"
              width="100px"
              onChange={
                (e) => {
                  handleChange('SouthBoundingCoordinate', e.target.value)
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
