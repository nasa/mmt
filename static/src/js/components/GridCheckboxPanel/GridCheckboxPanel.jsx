import React, { useState } from 'react'
import { kebabCase } from 'lodash-es'
import { cloneDeep } from '@apollo/client/utilities'
import PropTypes from 'prop-types'
import removeEmpty from '../../utils/removeEmpty'

// eslint-disable-next-line import/no-cycle
import GridLayout from '../GridLayout/GridLayout'

const GridCheckboxPanel = ({
  layout,
  formData,
  onBlur,
  onChange,
  registry,
  schema,
  idSchema,
  errorSchema,
  uiSchema
}) => {
  const [showCheckboxPanel, setShowCheckboxPanel] = useState(false)
  const isDataForCheckboxPanel = () => {
    const rows = layout['ui:row']

    return rows.some((row) => {
      const col = row['ui:col']
      const { children } = col

      return children.some((field) => (
        formData[field] ? Object.keys(
          removeEmpty(cloneDeep(formData[field]))
        ).length > 0 : false))
    })
  }

  const rows = layout['ui:row']
  const groupCheckbox = layout['ui:group-checkbox']
  const showCheckmark = isDataForCheckboxPanel() || showCheckboxPanel
  const id = `gridCheckBoxPanel__${kebabCase(groupCheckbox)}-checkbox`

  const handleCheckbox = (event) => {
    const { checked } = event.target
    if (!checked) {
      const uiRow = layout['ui:row']
      uiRow.forEach((row) => {
        const col = row['ui:col']
        const { children } = col
        children.forEach((field) => {
          // eslint-disable-next-line no-param-reassign
          delete formData[field]
        })
      })

      onChange(formData)
    }

    setShowCheckboxPanel(event.target.checked)
  }

  const renderChildren = () => {
    const { schemaUtils } = registry
    const retrievedSchema = schemaUtils.retrieveSchema(schema)

    return rows.map((layoutSchema) => (
      <GridLayout
        key={`gridCheckboxPanel--${JSON.stringify(layoutSchema)}`}
        schema={retrievedSchema}
        registry={registry}
        layout={layoutSchema}
        idSchema={idSchema}
        uiSchema={uiSchema}
        errorSchema={errorSchema}
        formData={formData}
        onBlur={onBlur}
        onChange={onChange}
      />
    ))
  }

  if (showCheckmark) {
    return (
      <div key={`${id}__${showCheckmark}`}>
        <div>
          <input className="m-2" type="checkbox" checked={showCheckmark} onChange={handleCheckbox} />
          {groupCheckbox}
        </div>
        <div className="m-3 mt-1 mb-1">
          {renderChildren(rows)}
        </div>
      </div>
    )
  }

  return (
    <div style={
      {
        display: 'flex',
        alignItems: 'center'
      }
    }
    >
      <input className="m-2" type="checkbox" onChange={handleCheckbox} />
      {groupCheckbox}
    </div>
  )
}

export default GridCheckboxPanel

GridCheckboxPanel.propTypes = {
  layout: PropTypes.shape({
    'ui:row': PropTypes.arrayOf(PropTypes.shape({})),
    'ui:group-checkbox': PropTypes.string
  }).isRequired,
  formData: PropTypes.shape({}).isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  registry: PropTypes.shape({
    schemaUtils: PropTypes.shape({
      retrieveSchema: PropTypes.func
    })
  }).isRequired,
  schema: PropTypes.shape({}).isRequired,
  idSchema: PropTypes.shape({}).isRequired,
  errorSchema: PropTypes.shape({}).isRequired,
  uiSchema: PropTypes.shape({}).isRequired
}
