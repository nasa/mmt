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
 * @property {Array} headers A list of custom headers
 * @property {Array} classNames A list of classNames for each header
 * @property {Boolean} loading A value provided by whichever useQuery is being used in parent component
 * @property {Array} data An array of formatted rows with data already populated
 * @property {String} error A string that comes from { loading, data, error } = useQuery
 * @property {String} noDataError An option string for custom error if data.length === 0
 * @property {Number} count A number of the total amount of data without limit
 * @property {Function} setOffset A useState function that loads the appropriate data set based on user input
 * @property {limit} limit A number that limits the data set that comes in. **Note this number should always be 20
 * @property {limit} offset A number that dictates where the dataset should start from
 */

const Table = ({
  headers,
  classNames,
  loading,
  data,
  error,
  noDataError,
  count,
  setOffset,
  limit,
  offset
}) => {
  // Does this provider have enough Rows to page? We hide the pagination buttons if not
  const hasPages = count > limit

  const renderHeaders = headers.map((header) => (
    <th key={header}>{header}</th>
  ))

  const dataLengthExists = (data && data.length) && data.length

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
  } else if (dataLengthExists > 0) {
    const rowData = data.map((row) => {
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
  } else if (dataLengthExists === 0) {
    content.push(<tr key="error-banner" className="text-center"><td colSpan={headers.length}>{noDataError}</td></tr>)
  } else {
    content.push(<tr key="error-banner" className="text-center"><td colSpan={4}>{error}</td></tr>)
  }

  return (
    <Container>
      <Row>
        <Col>
          <span className="d-block mb-3">
            {`Showing ${count > 0 ? offset : 0}-${dataLengthExists === limit ? offset + limit : offset + dataLengthExists} of ${count} Results`}
          </span>
        </Col>
        <Col xs="auto">
          <div className="mx-auto">
            {
              hasPages && (
                <PaginationComponent
                  setOffset={setOffset}
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
  data: null,
  error: 'Error',
  noDataError: 'No Data to Display',
  count: null
}

Table.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  classNames: PropTypes.arrayOf(PropTypes.string),
  loading: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    cells: PropTypes.arrayOf(PropTypes.shape({}))
  })),
  error: PropTypes.string,
  noDataError: PropTypes.string,
  count: PropTypes.number,
  offset: PropTypes.number.isRequired,
  setOffset: PropTypes.func.isRequired,
  limit: PropTypes.number.isRequired
}

export default Table
