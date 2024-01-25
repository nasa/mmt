import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import BootstrapTable from 'react-bootstrap/Table'
import Pagination from 'react-bootstrap/Pagination'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Placeholder from 'react-bootstrap/Placeholder'
import config from '../../../../../static.config.json'

import For from '../For/For'

const { application } = config
const { defaultPageSize } = application
/**
 * Table
 * @typedef {Object} Table
 * @property {Boolean} loading A value provided by whichever useQuery is being used in parent component
 * @property {Object[]} headers A list of header titles for a table
 * @property {Array} data An array of formatted rows with data already populated
 * @property {String} error A string with a specific error for table
 */

const Table = ({
  headers, classNames, loading, data, error, count
}) => {
  const [rowCount, setRowCount] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [currentCount, setCurrentCount] = useState(defaultPageSize)

  // Start and end index of the current page of rows
  const startIndex = (pageNum - 1) * defaultPageSize
  const endIndex = Math.min(startIndex + defaultPageSize, rowCount)

  // Current page of rows
  const pagedRows = data ? data.slice(startIndex, endIndex) : []

  const lastPageNum = parseInt(Math.ceil(rowCount / defaultPageSize), 10)

  // // Does this provider have enough Rows to page? We hide the pagination buttons if not
  const hasPages = rowCount > defaultPageSize

  const defaultPaginationStyles = {
    minWidth: '2.5rem',
    textAlign: 'center'
  }

  useEffect(() => {
    if (!loading) {
      setRowCount(data.length)
    }
  }, [loading, data])

  const renderHeaders = headers.map((header) => (
    <th key={header}>{header}</th>
  ))

  const handleItemClick = (currentPage) => {
    setPageNum(currentPage)
    setCurrentCount(currentPage * defaultPageSize)
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
    const newPageNum = pageNum + direction
    const newCurrentCount = currentCount + direction * defaultPageSize

    setPageNum(newPageNum)
    setCurrentCount(newCurrentCount)
  }

  const pagination = (
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
  )

  const content = []

  if (loading) {
    content.push(
      <For key="for-each-loading-key" each={[...new Array(headers.length)]}>
        {
          (item, i) => {
            const trKey = headers[i]

            return (
              <tr key={trKey}>
                {
                  headers.map((index) => {
                    const tdKey = `${trKey}_${index}`

                    return (
                      <td key={tdKey} className="col-md-4">
                        <Placeholder animation="glow">
                          <Placeholder xs={6} />
                        </Placeholder>
                      </td>
                    )
                  })
                }
              </tr>
            )
          }
        }
      </For>
    )
  } else if (rowCount > 0) {
    const rowData = pagedRows.map((row) => {
      const { cells, key } = row
      const rowKey = key

      return (
        <tr key={`${rowKey}`}>
          {
            cells.map((cell, index) => {
              const cellKey = `${rowKey}_${headers[index]}`
              const { value } = cell

              return (
                <td key={cellKey} className={classNames[index] || 'col-auto'}>
                  {value}
                </td>
              )
            })
          }
        </tr>
      )
    })

    content.push(rowData)
  } else {
    content.push(<tr key="error-banner" className="text-center"><td colSpan={4}>{error}</td></tr>)
  }

  return (
    <Container>
      <Row>
        <Col>
          <span className="d-block mb-3">
            Showing
            {' '}
            {count > 0 && (currentCount - defaultPageSize)}
            -
            {currentCount}
            {' '}
            of
            {' '}
            {count}
            {' '}
            Results
          </span>
        </Col>
      </Row>
      <Row>
        <Col>
          <BootstrapTable striped>
            <thead>
              <tr>
                {renderHeaders}
              </tr>
            </thead>
            <tbody>
              {content}
            </tbody>
          </BootstrapTable>
        </Col>
      </Row>
      <Row className="mt-2 justify-content-md-center">
        <Col xs="auto">
          <div className="mx-auto">
            {hasPages && pagination}
          </div>
        </Col>
      </Row>
    </Container>
  )
}

Table.defaultProps = {
  classNames: [],
  loading: null,
  error: 'No Data to Display',
  count: null
}

Table.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  classNames: PropTypes.arrayOf(PropTypes.string),
  loading: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    cells: PropTypes.arrayOf(PropTypes.shape({}))
  })).isRequired,
  error: PropTypes.string,
  count: PropTypes.number
}

export default Table
