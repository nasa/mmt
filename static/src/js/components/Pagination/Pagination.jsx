import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Pagination from 'react-bootstrap/Pagination'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

/**
 * Table
 * @typedef {Object} PaginationComponent
 * @property {Number} limit A number that is set in parent element of table
 * @property {Number} count A number that indicates how many results are in the total query
 * @property {function} setOffset A function that resets the offset of results to come back
 */

const PaginationComponent = ({
  limit,
  count,
  setOffset
}) => {
  const [pageNum, setPageNum] = useState(1)

  const lastPageNum = parseInt(Math.ceil(count / limit), 10)

  const defaultPaginationStyles = {
    minWidth: '2.5rem',
    textAlign: 'center'
  }

  const handleItemClick = (currentPage) => {
    setPageNum(currentPage)
    setOffset((currentPage - 1) * limit)
  }

  const generatePaginationItems = () => {
    // Only show 3 pages, the current page and one before or after (within the valid range of pages)
    const pages = [pageNum - 1, pageNum, pageNum + 1]
      .filter((page) => page >= 1 && page <= lastPageNum)

    const returnItems = []

    // If the first page is not 1, add the pagination item for page 1
    if (pages[0] !== 1) {
      returnItems.push(
        <Pagination.Item
          key="page-1"
          onClick={() => handleItemClick(1)}
          active={pageNum === 1}
          style={defaultPaginationStyles}
        >
          {1}
        </Pagination.Item>
      )

      // And if the first page is not 2, add an ellipsis
      if (pages[0] !== 2) {
        returnItems.push(
          <Pagination.Ellipsis
            key="page-ellipsis-1"
            disabled
          />
        )
      }
    }

    pages.forEach((page) => {
      returnItems.push(
        <Pagination.Item
          key={`page-${page}`}
          onClick={() => handleItemClick(page)}
          active={page === pageNum}
          style={defaultPaginationStyles}
        >
          {page}
        </Pagination.Item>
      )
    })

    // If the last page is not lastPageNum, add the pagination item for the lastPageNum
    if (pages[pages.length - 1] !== lastPageNum) {
      // And if the last page is not lastPageNum - 1, add an ellipsis
      if (pages[pages.length - 1] !== lastPageNum - 1) {
        returnItems.push(
          <Pagination.Ellipsis
            key="page-ellipsis-2"
            disabled
          />
        )
      }

      returnItems.push(
        <Pagination.Item
          key={`page-${lastPageNum}`}
          onClick={() => handleItemClick(lastPageNum)}
          active={pageNum === lastPageNum}
          style={defaultPaginationStyles}
        >
          {lastPageNum}
        </Pagination.Item>
      )
    }

    return returnItems
  }

  const handlePageChange = (direction) => {
    const newCurrentPage = pageNum + direction

    setPageNum(newCurrentPage)
    setOffset((newCurrentPage - 1) * limit)
  }

  return (
    <Row>
      <Col xs="auto">
        <div className="mx-auto">
          <Pagination>
            <Pagination.Prev
              disabled={pageNum === 1}
              onClick={() => handlePageChange(-1)}
            />
            {generatePaginationItems()}
            <Pagination.Next
              onClick={() => handlePageChange(1)}
              disabled={pageNum >= lastPageNum}
            />
          </Pagination>
        </div>
      </Col>
    </Row>
  )
}

PaginationComponent.defaultProps = {
  count: null
}

PaginationComponent.propTypes = {
  setOffset: PropTypes.func.isRequired,
  limit: PropTypes.number.isRequired,
  count: PropTypes.number
}

export default PaginationComponent
