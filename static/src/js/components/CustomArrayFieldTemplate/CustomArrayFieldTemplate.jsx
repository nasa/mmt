import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { startCase } from 'lodash'

import './CustomArrayFieldTemplate.scss'

/**
 * CustomArrayFieldTemplate
 * @typedef {Object} CustomArrayFieldTemplate
 * @property {Object[]} items The items for the fields being shown.
 * @property {Boolean} canAdd A canAdd array field flag that can be set to False in uiSchema.
 * @property {String} title The title of the Array field.
 * @property {Object} uiSchema A uiSchema for the field being shown.
 * @property {Boolean} required Is the Array field required.
 * @property {Object} schema A UMM Schema for the draft being previewed.
 * @property {Function} onAddClick A function to add another array item.
 */

/**
 * Renders Custom Array Field Template
 * @param {CustomArrayFieldTemplate} props
 */
const CustomArrayFieldTemplate = ({
  items,
  canAdd,
  title,
  uiSchema,
  required,
  schema,
  onAddClick
}) => {
  const requiredUI = uiSchema['ui:required']
  const hideHeader = uiSchema['ui:hide-header']
  const headerClassName = uiSchema['ui:header-classname'] ? uiSchema['ui:header-classname'] : 'h2-title'
  const scrollRef = useRef(false)
  const [scrollIndex, setScrollRef] = useState(null)

  // This useEffect for scrollIndex lets the refs be in place before trying to use them
  useEffect(() => {
    if (scrollIndex) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [scrollIndex])

  // Checks if canADD is defined in uiSchema
  // This is being used for the VariableInformation Lat/Lon field
  let addElement = canAdd
  if (uiSchema['ui:canAdd'] === false) {
    addElement = false
  }

  // Parses the title for add button
  const fieldTitle = () => {
    const uiTitle = uiSchema['ui:title']
    // If a title is provided in uiSchema, this takes precedence
    if (uiTitle) {
      return uiTitle
    }

    return startCase(title)
  }

  // This handleAdd adds a new array,
  // sets the scrollRef so the autoScroll executes
  // sets the scrollRef to false after 400ms. (this is needed or else the page will keep scrolling back and forth)
  const handleAdd = (event) => {
    onAddClick(event)
    setScrollRef(true)
    setTimeout(() => {
      setScrollRef(false)
    }, 400)
  }

  return (
    <div className="custom-array-field-template">
      {
        hideHeader && (
          <span className={headerClassName}>
            <h1 className="custom-array-field-template__title">
              {fieldTitle()}

              {
                (required || requiredUI) && (
                  <i className="eui-icon eui-required-o required-icon" />
                )
              }
            </h1>
          </span>
        )
      }

      <p className="custom-array-field-template__description">
        {schema.description}
      </p>

      {
        items && items.map((element, index) => (
          <div
            key={element.key}
            className={`${element.className} element`}
            ref={scrollRef}
          >
            {/* Renders the field title. e.x: Related URL (1 of 1) */}
            <div>
              {
                addElement && (
                  <div className="h5 custom-array-field-template__field-title">
                    <span>
                      {fieldTitle()}
                      {items.length > 0 && ` (${index + 1} of ${items.length})`}
                    </span>

                    <Button
                      className="custom-array-field-template__remove-button"
                      variant="link"
                      onClick={element.onDropIndexClick(element.index)}
                    >
                      <i className="fa-solid fa-circle-minus fa-lg p-1" />
                      Remove
                    </Button>
                  </div>
                )
              }
            </div>

            <div>
              <Row className="mb-2  d-flex align-items-center">
                <Col xs="12" lg="12" key={element.key}>
                  {element.children}
                </Col>
              </Row>
            </div>
          </div>
        ))
      }

      {/* Renders the add another field button */}
      {
        addElement ? (
          <Button
            variant="link"
            onClick={handleAdd}
          >
            <span>
              <i className="fa-solid fa-circle-plus fa-lg p-1" />

              {
                items.length === 0 ? (
                  <span>Add</span>
                ) : <span>Add Another</span>
              }
              {' '}
              {fieldTitle()}
            </span>
          </Button>
        ) : null
      }

    </div>
  )
}

CustomArrayFieldTemplate.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  canAdd: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  uiSchema: PropTypes.shape({
    'ui:required': PropTypes.bool,
    'ui:hide-header': PropTypes.bool,
    'ui:canAdd': PropTypes.bool,
    'ui:title': PropTypes.string,
    'ui:header-classname': PropTypes.string
  }).isRequired,
  required: PropTypes.bool.isRequired,
  schema: PropTypes.shape({
    description: PropTypes.string.isRequired
  }).isRequired,
  onAddClick: PropTypes.func.isRequired
}

export default CustomArrayFieldTemplate
