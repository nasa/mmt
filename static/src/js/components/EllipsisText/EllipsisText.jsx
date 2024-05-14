import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import PropTypes from 'prop-types'

/**
 * @typedef {Object} EllipsisTextProps
 * @property {Object} children The data for the cell.
 */

/**
 * Renders a EllipsisText
 * @param {EllipsisTextProps} props
 *
 * @component
 * @example <caption>Renders a `EllipsisText` component</caption>
 * return (
 *   <EllipsisText children={"This is an entry title"} />
 * )
 */
const EllipsisText = ({ children }) => {
  if (!children) return null

  const ref = useRef(null)

  const [textTruncated, setTextTruncated] = useState(false)

  useEffect(() => {
    const { current } = ref
    if (current.scrollWidth > current.offsetWidth) {
      setTextTruncated(true)
    }
  }, [ref])

  const spanContent = <span ref={ref} className="d-block col-12 text-truncate" style={{ maxWidth: '15rem' }}>{children}</span>

  if (!textTruncated) return spanContent

  return (
    <OverlayTrigger
      placement="top"
      overlay={
        // Disabling this next line since this is how bootstrap recommends implementing the tooltip
        // eslint-disable-next-line react/no-unstable-nested-components
        (props) => (
          <Tooltip id="title-tooltip" {...props}>
            {children}
          </Tooltip>
        )
      }
    >
      {spanContent}
    </OverlayTrigger>
  )
}

EllipsisText.defaultProps = {
  children: null
}

EllipsisText.propTypes = {
  children: PropTypes.string
}

export default EllipsisText
