import React from 'react'
import PropTypes from 'prop-types'
import { FaEllipsisV } from 'react-icons/fa'
import Button from '../Button/Button'

/**
 * @typedef {Object} CustomToggleProps
 * @property {Function} onClick A callback function to be called when the button is clicked
 */

/*
 * Renders a `CustomToggle` component.
 *
 * This component renders an button for a custom toggle. This currently only supports the
 * "more actions" style button with an ellipsis and the test "More Actions".
 *
 * @param {CustomToggleProps} props
 *
 * @component
 * @example <caption>Render a button with an icon</caption>
 * return (
 *   <CustomToggle />
 * )
 */
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
      size="lg"
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
