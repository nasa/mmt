import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'

import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'

import './BoundingRectangleField.scss'

/**
 * BoundingRectangleField
 * @property {Object} formData Saved draft.
 * @property {String} name String BoundingRectangle--0, etc.
 * @property {Function} onChange A callback function triggered when the user inputs a text.
 * @property {Object} schema The UMM Schema for this custom widget.
 */

/**
 * Renders Bounding Rectangle Field
 * @param {BoundingRectangleField} props
 */
const BoundingRectangleField = ({
  formData,
  name,
  onChange,
  schema
}) => {
  const { properties } = schema
  const {
    EastBoundingCoordinate: eBoundingCoordinate,
    NorthBoundingCoordinate: nBoundingCoordinate
  } = properties
  const { description: latitudeDescription } = eBoundingCoordinate
  const { description: longitudeDescription } = nBoundingCoordinate

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
            <CustomWidgetWrapper
              id="north-coordinate"
              title="North"
              description={longitudeDescription}
              centered
            >
              <input
                className="form-control bounding-rectangle-coordinate"
                type="number"
                step="any"
                id="north-coordinate"
                onChange={
                  (event) => {
                    handleChange('NorthBoundingCoordinate', event)
                  }
                }
                value={NorthBoundingCoordinate}
              />
            </CustomWidgetWrapper>
          </div>
        </div>

        <div className="bounding-rectangle-east-west-row">
          <div>
            <div className="bounding-rectangle-coordinate-label">
              <CustomWidgetWrapper
                id="west-coordinate"
                title="West"
                description={latitudeDescription}
                centered
              >
                <input
                  className="form-control bounding-rectangle-coordinate"
                  type="number"
                  step="any"
                  id="west-coordinate"
                  onChange={
                    (event) => {
                      handleChange('WestBoundingCoordinate', event)
                    }
                  }
                  value={WestBoundingCoordinate}
                />
              </CustomWidgetWrapper>
            </div>
          </div>

          <div>
            <div className="bounding-rectangle-coordinate-label">
              <CustomWidgetWrapper
                id="east-coordinate"
                title="East"
                description={latitudeDescription}
                centered
              >
                <input
                  className="form-control bounding-rectangle-coordinate"
                  type="number"
                  step="any"
                  id="east-coordinate"
                  onChange={
                    (event) => {
                      handleChange('EastBoundingCoordinate', event)
                    }
                  }
                  value={EastBoundingCoordinate}
                />
              </CustomWidgetWrapper>
            </div>
          </div>
        </div>

        <div className="bounding-rectangle-south-row">
          <div className="bounding-rectangle-coordinate-label">
            <CustomWidgetWrapper
              id="south-coordinate"
              title="South"
              description={longitudeDescription}
              centered
            >
              <input
                className="form-control bounding-rectangle-coordinate"
                type="number"
                step="any"
                id="south-coordinate"
                width="100px"
                onChange={
                  (event) => {
                    handleChange('SouthBoundingCoordinate', event)
                  }
                }
                value={SouthBoundingCoordinate}
              />
            </CustomWidgetWrapper>
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
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    properties: PropTypes.shape({
      NorthBoundingCoordinate: PropTypes.shape({
        description: PropTypes.string.isRequired
      }),
      EastBoundingCoordinate: PropTypes.shape({
        description: PropTypes.string.isRequired
      })
    })
  }).isRequired
}

export default BoundingRectangleField
