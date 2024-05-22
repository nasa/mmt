import React from 'react'
import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'

const CustomCheckboxWidget = ({
  label,
  onChange,
  value
}) => {


  return (
    <CustomWidgetWrapper>
      <input className="m-2" type="checkbox" checked={value} />
      {label}
    </CustomWidgetWrapper>

  )
}

export default CustomCheckboxWidget
