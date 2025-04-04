import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import PropTypes from 'prop-types'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import { startCase } from 'lodash-es'
import { FaTrash, FaPlusCircle } from 'react-icons/fa'

import Button from '../Button/Button'

import './CustomArrayFieldTemplate.scss'

/**
 * CustomArrayFieldTemplate
 * @typedef {Object} CustomArrayFieldTemplate
 * @property {Boolean} canAdd A canAdd array field flag that can be set to False in uiSchema.
 * @property {Object[]} items The items for the fields being shown.
 * @property {Function} onAddClick A function to add another array item.
 * @property {Boolean} required Is the Array field required.
 * @property {Object} schema A UMM Schema for the draft being previewed.
 * @property {String} title The title of the Array field.
 * @property {Object} uiSchema A uiSchema for the field being shown.
 */

/**
 * Renders Custom Array Field Template
 * @param {CustomArrayFieldTemplate} props
 */
const CustomArrayFieldTemplate = ({
  canAdd,
  items,
  onAddClick,
  required,
  schema,
  title,
  uiSchema
}) => {
  const requiredUI = uiSchema['ui:required']
  const hideHeader = uiSchema['ui:hide-header'] || null
  const HeadingElement = uiSchema['ui:heading-level'] ? uiSchema['ui:heading-level'] : 'span'

  const scrollRef = useRef(false)
  const [shouldScroll, setShouldScroll] = useState(false)

  // This useEffect for scrollIndex lets the refs be in place before trying to use them
  useEffect(() => {
    if (shouldScroll) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
      setShouldScroll(false)
    }
  }, [shouldScroll])

  // Checks if canADD is defined in uiSchema
  // This is being used for the VariableInformation Lat/Lon field
  let addElement = canAdd
  if (uiSchema['ui:canAdd'] === false) {
    addElement = false
  }

  const fieldTitle = uiSchema['ui:title'] || startCase(title)

  // This handleAdd adds a new array,
  // sets the scrollRef so the autoScroll executes
  // sets the scrollRef to false after 400ms. (this is needed or else the page will keep scrolling back and forth)
  const handleAdd = (event) => {
    onAddClick(event)
    setShouldScroll(true)
  }

  return (
    <div className="custom-array-field-template">
      {
        !hideHeader && (
          <span>
            <HeadingElement
              className="custom-array-field-template__title"
              role="heading"
            >
              {fieldTitle}
              {
                (required || requiredUI) && (
                  <i
                    aria-label="Required"
                    className="eui-icon eui-required-o text-success ps-2"
                    role="img"
                  />
                )
              }
            </HeadingElement>
          </span>
        )
      }

      <p className="custom-array-field-template__description">
        {schema.description}
      </p>

      {
        items && items.map((element, index) => {
          const {
            children,
            className,
            index: elementIndex,
            key,
            onDropIndexClick
          } = element

          return (
            <div
              className={`custom-array-field-template__element ${className}`}
              key={key}
              ref={scrollRef}
            >
              {/* Renders the field title. e.x: Related URL (1 of 1) */}
              <div>
                {
                  addElement && (
                    <div className="custom-array-field-template__field d-flex align-items-center mb-3">
                      <div className="d-flex align-items-center justify-content-center">
                        <span className="custom-array-field-template__field-title mb-0">{fieldTitle}</span>
                        <Badge size="sm" bg="light-dark" className="text-body ms-2">
                          {items.length > 0 && ` ${index + 1} of ${items.length}`}
                        </Badge>
                      </div>

                      <Button
                        className="custom-array-field-template__remove-button text-danger px-0"
                        Icon={FaTrash}
                        iconTitle="Minus icon in a circle"
                        naked
                        onClick={onDropIndexClick(elementIndex)}
                        size="sm"
                      >
                        Remove
                      </Button>
                    </div>
                  )
                }
              </div>
              <div>
                <Row className="d-flex align-items-center">
                  <Col
                    xs="12"
                    lg="12"
                    key={key}
                  >
                    {children}
                  </Col>
                </Row>
              </div>
            </div>
          )
        })
      }

      {/* Renders the add another field button */}
      {
        addElement && (
          <Button
            className="text-primary px-0 mt-4"
            Icon={FaPlusCircle}
            iconTitle="Plus icon in a circle"
            naked
            onClick={handleAdd}
          >
            {`Add ${items.length > 0 ? 'Another' : ''} ${fieldTitle}`}
          </Button>
        )
      }
    </div>
  )
}

CustomArrayFieldTemplate.propTypes = {
  canAdd: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  onAddClick: PropTypes.func.isRequired,
  required: PropTypes.bool.isRequired,
  schema: PropTypes.shape({
    description: PropTypes.string
  }).isRequired,
  title: PropTypes.string.isRequired,
  uiSchema: PropTypes.shape({
    'ui:canAdd': PropTypes.bool,
    'ui:hide-header': PropTypes.bool,
    'ui:required': PropTypes.bool,
    'ui:title': PropTypes.string,
    'ui:heading-level': PropTypes.string,
    items: PropTypes.shape({
      'ui:title': PropTypes.string
    })
  }).isRequired
}

export default CustomArrayFieldTemplate
