import React from 'react'
import PropTypes from 'prop-types'
import { FaEllipsisV } from 'react-icons/fa'
import Button from '../Button/Button'

const CustomToggle = React.forwardRef(
  ({
    onClick
  }, ref) => (
    <Button
      href=""
      variant="light-dark"
      iconOnly
      Icon={FaEllipsisV}
      iconTitle="A vertical ellipsis icon"
      ref={ref}
      onClick={
        (e) => {
          e.preventDefault()
          onClick(e)
        }
      }
    >
      More Actions
    </Button>
  )
)

CustomToggle.displayName = 'CustomToggle'

CustomToggle.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default CustomToggle
