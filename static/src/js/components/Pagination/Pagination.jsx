import React from 'react'
import PropTypes from 'prop-types'
import BootstrapPagination from 'react-bootstrap/Pagination'

/**
 * Table
 * @typedef {Object} Pagination
 * @property {Number} activePage The active page number
 * @property {Function} setPage A callback to set a new page by number
 * @property {Number} totalPages The total number of pages
 */

const Pagination = ({
  activePage,
  setPage,
  totalPages
}) => {
  const lastPageNum = totalPages

  const defaultPaginationStyles = {
    minWidth: '2.5rem',
    textAlign: 'center'
  }

  const handleItemClick = (page) => {
    setPage(page)
  }

  const generatePaginationItems = () => {
    // Only show 3 pages, the current page and one before or after (within the valid range of pages)
    const pages = [activePage - 1, activePage, activePage + 1]
      .filter((page) => page >= 1 && page <= lastPageNum)

    const returnItems = []

    // If the first page is not 1, add the pagination item for page 1
    if (pages[0] !== 1) {
      returnItems.push(
        <BootstrapPagination.Item
          key="page-1"
          onClick={() => handleItemClick(1)}
          active={activePage === 1}
          style={defaultPaginationStyles}
        >
          1
        </BootstrapPagination.Item>
      )

      // And if the first page is not 2, add an ellipsis
      if (pages[0] !== 2) {
        returnItems.push(
          <BootstrapPagination.Ellipsis
            key="page-ellipsis-1"
            disabled
          />
        )
      }
    }

    pages.forEach((page) => {
      returnItems.push(
        <BootstrapPagination.Item
          key={`page-${page}`}
          onClick={() => handleItemClick(page)}
          active={page === activePage}
          style={defaultPaginationStyles}
        >
          {page}
        </BootstrapPagination.Item>
      )
    })

    // If the last page is not lastPageNum, add the pagination item for the lastPageNum
    if (pages[pages.length - 1] !== lastPageNum) {
      // And if the last page is not lastPageNum - 1, add an ellipsis
      if (pages[pages.length - 1] !== lastPageNum - 1) {
        returnItems.push(
          <BootstrapPagination.Ellipsis
            key="page-ellipsis-2"
            disabled
          />
        )
      }

      returnItems.push(
        <BootstrapPagination.Item
          key={`page-${lastPageNum}`}
          data-last-page={`page-${lastPageNum}`}
          onClick={() => handleItemClick(lastPageNum)}
          active={activePage === lastPageNum}
          style={defaultPaginationStyles}
        >
          {lastPageNum}
        </BootstrapPagination.Item>
      )
    }

    return returnItems
  }

  const handlePageChange = (direction) => {
    const newCurrentPage = activePage + direction
    setPage(newCurrentPage)
  }

  return (
    <BootstrapPagination className="mb-0">
      <BootstrapPagination.Prev
        disabled={activePage === 1}
        onClick={() => handlePageChange(-1)}
      />
      {generatePaginationItems()}
      <BootstrapPagination.Next
        onClick={() => handlePageChange(1)}
        disabled={activePage >= lastPageNum}
      />
    </BootstrapPagination>
  )
}

Pagination.propTypes = {
  setPage: PropTypes.func.isRequired,
  activePage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired
}

export default Pagination
