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
              {/* TODO From font awesome, do you want to use this or something else */}
              <i className="fa-solid fa-circle-plus fa-lg p-1" />

              {
                items.length === 0 ? (
                  <span>Add</span>
                ) : <span>Add another</span>
              }

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
  uiSchema: PropTypes.shape({}).isRequired,
  required: PropTypes.bool.isRequired,
  schema: PropTypes.shape({
    description: PropTypes.string.isRequired
  }).isRequired,
  onAddClick: PropTypes.func.isRequired
}

export default CustomArrayFieldTemplate
