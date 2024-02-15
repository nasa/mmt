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
          aria-label={activePage === 1 ? 'Current Page, Page 1' : 'Goto Page 1'}
          aria-current={activePage === 1}
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
          aria-label={page === activePage ? `Current Page, Page ${page}` : `Goto Page ${page}`}
          aria-current={page === activePage}
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
          aria-label={activePage === lastPageNum ? `Current Page, Page ${lastPageNum}` : `Goto Page ${lastPageNum}`}
          aria-current={lastPageNum === activePage}
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
    <nav role="navigation" aria-label="Pagination Navigation">
      <BootstrapPagination className="mb-0">
        <BootstrapPagination.Prev
          aria-label="Goto Previous Page"
          disabled={activePage === 1}
          aria-disabled={activePage === 1}
          onClick={() => handlePageChange(-1)}
        />
        {generatePaginationItems()}
        <BootstrapPagination.Next
          aria-label="Goto Next Page"
          onClick={() => handlePageChange(1)}
          disabled={activePage >= lastPageNum}
          aria-disabled={activePage >= lastPageNum}
        />
      </BootstrapPagination>
    </nav>
  )
}

Pagination.propTypes = {
  setPage: PropTypes.func.isRequired,
  activePage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired
}

export default Pagination
