import React from 'react'
import PropTypes from 'prop-types'

/**
 *
 * @typedef {Object} GridTitle
 * @property {Object} registry An Object that has all the props that are in registry.
 * @property {Object} title A title to display
 * @property {Boolean} required if the title should include if the section is required.
 * @property {String} className the className to style the Title
 * @property {String} groupBoxClassName the className to style the box.
 * @property {String} id the id to assign to the TitleField

 */
// TODO is this being used?
const GridTitle = ({
  title,
  groupClassName,
  groupBoxClassName,
  required,
  registry,
  id
}) => {
  const { fields } = registry
  const { TitleField } = fields

  if (TitleField) {
    return (
      <TitleField
        name={title}
        title={title}
        className={groupClassName}
        groupBoxClassName={groupBoxClassName}
        required={required}
        onBlur={undefined}
        onFocus={undefined}
        options={undefined}
        idSchema={undefined}
        id={id}
        onChange={undefined}
        schema={undefined}
        readonly={false}
        disabled={false}
        registry={registry}
      />
    )
  }

  return null
}

GridTitle.propTypes = {
  title: PropTypes.string.isRequired,
  groupClassName: PropTypes.string.isRequired,
  groupBoxClassName: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  registry: PropTypes.shape({
    fields: PropTypes.shape({
      TitleField: PropTypes.func
    })
  }).isRequired,
  id: PropTypes.string.isRequired
}

export default GridTitle
