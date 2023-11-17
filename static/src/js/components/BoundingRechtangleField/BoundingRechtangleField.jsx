import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap'
import './BoundingRechtangleField.scss'

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
    const data = { ...formData }
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
        <Button data-testid="bounding-rectangle-field--apply-global-spatial-coverage" style={{ fontSize: 12 }} variant="primary" onClick={handleApplyGlobal}>Apply Global Spatial Coverage</Button>
      </div>
      <div className="bounding-rectangle-field__container">
        <div className="bounding-rectangle-field__north--row">
          <div className="bounding-rectangle-field__coordinate--label">
            North
            <input
              data-testid="bounding-rectangle-field--north"
              className="form-control bounding-rectangle-field__coordinate"
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
        <div className="bounding-rectangle-field__east-west--row">
          <div>
            <div className="bounding-rectangle-field__coordinate--label">
              West
            </div>
            <input
              data-testid="bounding-rectangle-field--west"
              className="form-control bounding-rectangle-field__coordinate"
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
            <div className="bounding-rectangle-field__coordinate--label">
              East
            </div>
            <input
              data-testid="bounding-rectangle-field--east"
              className="form-control bounding-rectangle-field__coordinate"
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
        <div className="bounding-rectangle-field__south--row">
          <div className="bounding-rectangle-field__coordinate--label">
            South
            <input
              data-testid="bounding-rectangle-field--south"
              className="form-control bounding-rectangle-field__coordinate"
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

BoundingRectangleField.defaultProps = {
  formData: {},
  onChange: null
}

BoundingRectangleField.propTypes = {
  formData: PropTypes.shape({
    NorthBoundingCoordinate: PropTypes.number,
    SouthBoundingCoordinate: PropTypes.number,
    EastBoundingCoordinate: PropTypes.number,
    WestBoundingCoordinate: PropTypes.number
  }),
  onChange: PropTypes.func
}

export default BoundingRectangleField
