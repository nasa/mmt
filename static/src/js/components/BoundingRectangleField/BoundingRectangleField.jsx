import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap'
import './BoundingRectangleField.scss'

const BoundingRectangleField = ({
  formData,
  onChange
}) => {
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

  const [coordinates, setCoordinates] = useState(createStateObject(formData))

  const handleApplyGlobal = () => {
    const data = {
      NorthBoundingCoordinate: 90,
      SouthBoundingCoordinate: -90,
      WestBoundingCoordinate: -180,
      EastBoundingCoordinate: 180
    }
    setCoordinates(createStateObject(data))
    onChange(data)
  }

  const toNumber = (value) => (!value ? null : Number(value))

  const handleChange = (field, value) => {
    const data = formData
    data[field] = toNumber(value)
    setCoordinates(createStateObject(data))
    onChange(data)
  }

  const {
    NorthBoundingCoordinate,
    SouthBoundingCoordinate,
    WestBoundingCoordinate,
    EastBoundingCoordinate
  } = coordinates

  return (
    <div>
      <div>
        <Button style={{ fontSize: 12 }} variant="primary" onClick={handleApplyGlobal}>Apply Global Spatial Coverage</Button>
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
