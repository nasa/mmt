import classNames from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'

const CustomMenu = React.forwardRef(
  ({
    children,
    style,
    className,
    'aria-labelledby': labelledBy
  }, ref) => (
    <div
      ref={ref}
      style={style}
      className={
        classNames([
          'shadow',
          {
            [className]: className
          }
        ])
      }
      aria-labelledby={labelledBy}
    >
      <div className="mb-0">
        {children}
      </div>
    </div>
  )
)

CustomMenu.displayName = 'CustomMenu'

CustomMenu.propTypes = {
  children: PropTypes.shape().isRequired,
  className: PropTypes.string,
  style: PropTypes.shape().isRequired,
  'aria-labelledby': PropTypes.string.isRequired
}

CustomMenu.defaultProps = {
  className: null
}

export default CustomMenu
