import React from 'react'
import PropTypes from 'prop-types'
import BootstrapTable from 'react-bootstrap/Table'
import Placeholder from 'react-bootstrap/Placeholder'
import PlaceholderButton from 'react-bootstrap/PlaceholderButton'

import For from '../For/For'

/**
 * CustomArrayFieldTemplate
 * @typedef {Object} Table
 * @property {Boolean} loading A value provided by whichever useQuery is being used in parent component
 * @property {Object[]} headers A list of header titles for a table
 * @property {Array} renderRows An array of formatted rows with data already populated
 */

const Table = ({
  headers, loading, renderRows
}) => {
  const renderHeaders = headers.map((header) => (
    <th key={header}>{header}</th>
  ))

  return (
    <BootstrapTable striped>
      <thead>
        <tr>
          {renderHeaders}
        </tr>
      </thead>
      <tbody>
        {
          (loading) ? (
            <For each={[...new Array(5)]}>
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
          ) : (renderRows)
        }
      </tbody>
    </BootstrapTable>
  )
}

Table.defaultProps = {
  loading: null
}

Table.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  loading: PropTypes.bool,
  renderRows: PropTypes.arrayOf(PropTypes.element).isRequired
}

export default Table
