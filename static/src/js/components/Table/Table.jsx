import React from 'react'
import PropTypes from 'prop-types'
import BootstrapTable from 'react-bootstrap/Table'
import Placeholder from 'react-bootstrap/Placeholder'
import PlaceholderButton from 'react-bootstrap/PlaceholderButton'

import For from '../For/For'
import stringifyCircularJSON from '../../utils/stringifyCircularJSON'

/**
 * Table
 * @typedef {Object} Table
 * @property {Boolean} loading A value provided by whichever useQuery is being used in parent component
 * @property {Object[]} headers A list of header titles for a table
 * @property {Array} renderRows An array of formatted rows with data already populated
 * @property {String} error A string with a specific error for table
 */

const Table = ({
  headers, classNames, loading, renderRows, error
}) => {
  const renderHeaders = headers.map((header) => (
    <th key={header}>{header}</th>
  ))

  const content = []

  if (loading) {
    content.push(
      <For key="for-each-loading-key" each={[...new Array(5)]}>
        {
          (item, i) => (
            <tr key={`placeholder-row_${i}`}>
              <td className="col-md-4">
                <Placeholder animation="glow">
                  <Placeholder xs={6} />
                </Placeholder>
              </td>
              <td className="col-md-4">
                <Placeholder animation="glow">
                  <Placeholder xs={8} />
                </Placeholder>
              </td>
              <td className="col-md-2">
                <Placeholder animation="glow">
                  <Placeholder xs={8} />
                </Placeholder>
              </td>
              <td className="col-auto">
                <Placeholder animation="glow">
                  <PlaceholderButton className="btn-sm" xs={10} variant="secondary" size="sm" />
                </Placeholder>
              </td>
            </tr>
          )
        }
      </For>
    )
  } else if (renderRows.length > 0) {
    const rowData = renderRows.map((row) => {
      const rowKey = stringifyCircularJSON(row)

      return (
        <tr key={`${rowKey}`}>
          {
            row.map((cell, index) => {
              const cellKey = stringifyCircularJSON(cell)

              return (
                <td key={cellKey} className={classNames[index] || 'col-auto'}>
                  {cell}
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
  )
}

Table.defaultProps = {
  classNames: [],
  loading: null,
  error: 'No Data to Display'
}

Table.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  classNames: PropTypes.arrayOf(PropTypes.string),
  loading: PropTypes.bool,
  renderRows: PropTypes.node.isRequired,
  error: PropTypes.string
}

export default Table
