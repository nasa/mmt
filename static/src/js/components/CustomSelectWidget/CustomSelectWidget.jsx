import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'

import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'

const CustomSelectWidget = ({
  disabled,
  label = '',
  id,
  placeholder,
  onBlur,
  onChange,
  registry,
  required,
  schema,
  uiSchema = {},
  value
}) => {
  const [showDescription, setShowDescription] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const selectScrollRef = useRef(null)
  const focusRef = useRef(null)

  const selectOptions = []
  const { enum: schemaEnums = [], description } = schema
  const { formContext } = registry

  // Const [cmrKeywords, setCmrKeywords] = useState([])
  // useEffect(() => {
  //   fetch('http://localhost:4000/search/keywords/related-urls')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data)
  //       setCmrKeywords(data)
  //     })
  //     .catch((err) => {
  //       console.log(err.message)
  //     })
  // }, [])

  // console.log('cmr', cmrKeywords)

  const {
    focusField,
    setFocusField
  } = formContext

  let title = startCase(label.split(/-/)[0])
  if (uiSchema['ui:title']) {
    title = uiSchema['ui:title']
  }

  let shouldFocus = false
  if (focusField === id) {
    shouldFocus = true
  } else if (focusField && id.match(/^\w+_\d+$/)) {
    if (id !== '' && id.startsWith(focusField)) {
      shouldFocus = true
    }
  }

  useEffect(() => {
    // This useEffect for shouldFocus lets the refs be in place before trying to use them
    if (shouldFocus) {
      selectScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
      focusRef.current?.focus()

      setShowMenu(true)
    }
  }, [shouldFocus])

  // If a value already has data, this will store it as an object for react-select
  const existingValue = value != null ? {
    value,
    label: value
  } : {}

  // Gets the enum values from the schema and adds to selectOption array.
  schemaEnums.forEach((schemaEnum) => {
    selectOptions.push({
      value: schemaEnum,
      label: schemaEnum
    })
  })

  const handleChange = (event) => {
    onChange(event)
    setShowMenu(false)
    focusRef.current?.blur()
  }

  const handleFocus = () => {
    setShowDescription(true)
    setShowMenu(true)
  }

  const handleBlur = () => {
    onBlur(id)
    setFocusField(null)
    setShowMenu(false)
    setShowDescription(false)
  }

  return (
    <CustomWidgetWrapper
      label={label}
      description={showDescription ? description : null}
      scrollRef={selectScrollRef}
      required={required}
      title={title}
    >
      <Select
        id={id}
        ref={focusRef}
        placeholder={placeholder || `Select ${title}`}
        defaultValue={existingValue ?? ''}
        options={selectOptions}
        isClearable
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        menuIsOpen={showMenu}
        isDisabled={disabled}
      />
    </CustomWidgetWrapper>
  )
}

CustomSelectWidget.defaultProps = {
  disabled: false,
  value: null,
  placeholder: ''
}

CustomSelectWidget.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  registry: PropTypes.shape({
    formContext: PropTypes.shape({
      focusField: PropTypes.string,
      setFocusField: PropTypes.func
    }).isRequired
  }).isRequired,
  required: PropTypes.bool.isRequired,
  schema: PropTypes.shape({
    description: PropTypes.string,
    maxLength: PropTypes.number,
    enum: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  uiSchema: PropTypes.shape({
  }).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
}

export default CustomSelectWidget

// FROM OG MMT-React that needs to be implemented
// Extracting ui:options from uiSchema
// const uiOptions = uiSchema['ui:options'] || {}
// const { enumOptions } = uiOptions
// Let existingValue = null
// if (typeof value === 'number') { // Used by oneOf, value is a number
//   existingValue = value ? options.enumOptions[value] : {}
// } else { // Used by everything else, it is value is a string
//   existingValue = value != null ? {
//     value,
//     label: value
//   } : {}
// }
// Be able to override schema enums from ui:schema
// if (enumOptions) {
//   (enumOptions as string[]).forEach((enumValue) => {
//     selectOptions.push({
//       value: enumValue,
//       label: enumValue
//     })
//   })
// } else if (options.enumOptions) {
//   // If the field is oneOf field
//   (options.enumOptions).forEach((option) => {
//     selectOptions.push(option)
//   })
// } else {
//   // Otherwise, just use the enums in the schema
//   const { enum: enums = retrievedSchema?.enum ?? [] } = schema
//   enums.forEach((currentEnum: string) => {
//     if (currentEnum) {
//       selectOptions.push({
//         value: currentEnum,
//         label: currentEnum
//       })
//     }
//   })
// }

// TODO waiting on cmrFetch for this part
// const { schema, uiSchema = {} } = this.props
// const service = uiSchema['ui:service']
// const controlled = uiSchema['ui:controlled'] || {}
// const { name, controlName } = controlled

// if (name && controlName) {
//   this.setState({ loading: true }, () => {
//     service.fetchCmrKeywords(name).then((keywords) => {
//       const paths = parseCmrResponse(keywords, controlName)
//       const enums = paths.map((path: string[]) => (path[0]))
//       schema.enum = enums
//       this.setState({ loading: false })
//     })
//       .catch(() => {
//         const { registry } = this.props
//         const { formContext } = registry
//         const { editor } = formContext
//         this.setState({ loading: false })
//         editor.status = new Status('warning', `Error retrieving ${name} keywords`)
//       })
//   })
// }
