import React from 'react'
import PropTypes from 'prop-types'
import BootstrapTable from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Placeholder from 'react-bootstrap/Placeholder'
import PaginationComponent from '../Pagination/Pagination'

import For from '../For/For'
/**
 * Table
 * @typedef {Object} Table
 * @property {Boolean} loading A value provided by whichever useQuery is being used in parent component
 * @property {Object[]} headers A list of header titles for a table
 * @property {Array} data An array of formatted rows with data already populated
 * @property {String} error A string with a specific error for table
 */

const Table = ({
  headers, classNames, loading, data, error, count, setOffset, limit, offset
}) => {
  // Current page of rows
  const pagedRows = data

  // Does this provider have enough Rows to page? We hide the pagination buttons if not
  const hasPages = count > limit

  const renderHeaders = headers.map((header) => (
    <th key={header}>{header}</th>
  ))

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
  } else if (count > 0) {
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
            {count > 0 && offset}
            -
            {data.length === limit ? offset + limit : offset + data.length}
            {' '}
            of
            {' '}
            {count}
            {' '}
            Results
          </span>
        </Col>
        <Col xs="auto">
          <div className="mx-auto">
            {
              hasPages && (
                <PaginationComponent
                  setoffset={setOffset}
                  limit={limit}
                  count={count}
                />
              )
            }
          </div>
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
  count: PropTypes.number,
  offset: PropTypes.number.isRequired,
  setOffset: PropTypes.func.isRequired,
  limit: PropTypes.number.isRequired
}

export default Table
