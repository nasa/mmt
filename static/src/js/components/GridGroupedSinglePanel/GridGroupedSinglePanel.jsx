import React, { useState, useEffect } from 'react'
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa'
import PropTypes from 'prop-types'
import './GridGroupedSinglePanel.scss'
import Button from '../Button/Button'

// eslint-disable-next-line import/no-cycle
import GridLayout from '../GridLayout/GridLayout'

const GridGroupedSinglePanel = ({
  uiSchema,
  formData = {},
  onChange,
  registry,
  schema,
  layoutGridSchema,
  idSchema,
  errorSchema
}) => {
  // Use state hook for showSinglePanel flag
  const [showSinglePanel, setShowSinglePanel] = useState()

  // When Remove group button clicked
  const removeGroup = () => {
    setShowSinglePanel(false)
    Object.getOwnPropertyNames(formData).map((field) => (
      // eslint-disable-next-line no-param-reassign
      delete formData[field]
    ))

    // eslint-disable-next-line no-param-reassign
    formData = {}
    onChange(formData)
  }

  useEffect(() => {
    console.log(Object.values(formData))
  }, [formData])

  // Create Remove button
  const createGroupRemoveHeader = () => {
    const title = uiSchema['ui:title']

    return (
      <Button
        className="grid-grouped-single-panel__remove-button"
        Icon={FaMinusCircle}
        naked
        onClick={removeGroup}
      >
        {`Remove ${title}`}
      </Button>
    )
  }

  // When Add group button clicked
  const addGroup = () => {
    setShowSinglePanel(true)
  }

  // Create Add button
  const createGroupAddHeader = () => {
    const title = uiSchema['ui:title']

    return (
      <Button
        className="grid-grouped-single-panel__add-button"
        Icon={FaPlusCircle}
        naked
        onClick={addGroup}
      >
        {`Add ${title}`}
      </Button>
    )
  }

  // Render fields
  const renderChildren = (rows) => {
    const { schemaUtils } = registry
    const retrievedSchema = schemaUtils.retrieveSchema(schema)

    return rows.map((layoutSchema) => (
      <GridLayout
        key={`gridGroupedSinglePanel--${JSON.stringify(layoutSchema)}`}
        schema={retrievedSchema}
        registry={registry}
        layout={layoutSchema}
        idSchema={idSchema}
        uiSchema={uiSchema}
        errorSchema={errorSchema}
        formData={formData || {}}
        onChange={(props) => { onChange(props) }}
      />
    ))
  }

  const rows = layoutGridSchema['ui:row']

  return (
    <div>
      {
        !showSinglePanel
        && Object.values(formData).some((field) => (
          field.includes(undefined)))
          ? (
            createGroupAddHeader()
          )
          // If the user has clicked showSinglePanelField, this is will show the remove button.
          : (
            <div>
              {createGroupRemoveHeader()}
              {renderChildren(rows)}
            </div>
          )
      }
    </div>
  )
}

GridGroupedSinglePanel.propTypes = {
  layoutGridSchema: PropTypes.shape({
    'ui:row': PropTypes.arrayOf(PropTypes.shape({}))
  }).isRequired,
  uiSchema: PropTypes.shape({
    'ui:title': PropTypes.string
  }).isRequired,
  formData: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  registry: PropTypes.shape({
    schemaUtils: PropTypes.shape({
      retrieveSchema: PropTypes.func
    })
  }).isRequired,
  schema: PropTypes.shape({}).isRequired,
  idSchema: PropTypes.shape({}).isRequired,
  errorSchema: PropTypes.shape({}).isRequired
}

export default GridGroupedSinglePanel
