import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

/**
 * @typedef {Object} EllipsisLinkProps
 * @property {Object} cellData The data for the cell.
 * @property {Object} rowData The data for the row.
 */

/**
 * Renders a EllipsisLink
 * @param {EllipsisLink} props
 *
 * @component
 * @example <caption>Renders a `EllipsisLink` component</caption>
 * return (
 *   <EllipsisLink  cellData="shortname" rowData={{ conceptId: "concept id" }}/>
 * )
 */
const EllipsisLink = ({ children, to }) => {
  if (!children) return null

  const ref = useRef(null)

  const [textTruncated, setTextTruncated] = useState(false)

  useEffect(() => {
    const { current } = ref
    if (current.scrollWidth > current.offsetWidth) {
      setTextTruncated(true)
    }
  }, [ref])

  const linkContent = (
    <Link
      ref={ref}
      className="d-block col-12 text-truncate text-decoration-none"
      to={to}
    >
      {children}
    </Link>
  )

  if (!textTruncated) return linkContent

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
      {linkContent}
    </OverlayTrigger>
  )
}

EllipsisLink.defaultProps = {
  children: ''
}

EllipsisLink.propTypes = {
  children: PropTypes.string,
  to: PropTypes.string.isRequired
}

export default EllipsisLink
