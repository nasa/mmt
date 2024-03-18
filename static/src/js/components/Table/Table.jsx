import React from 'react'
import PropTypes from 'prop-types'
import BoostrapTable from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Placeholder from 'react-bootstrap/Placeholder'
import {
  get,
  random,
  uniqueId
} from 'lodash-es'
import { FaSortDown, FaSortUp } from 'react-icons/fa'
import classNames from 'classnames'

import For from '../For/For'
import Button from '../Button/Button'

import './Table.scss'

/**
 * @typedef ColumnDefs
 * @property {String} dataKey A string to be used to traverse the search results and identify the source of the data to be displayed in a cell
 * @property {String} title The title of the column
 * @property {String} [sortKey] A string representing the CMR sort method for the column
 * @property {String} [className] An optional string to be used as the class name for the header columns and data columns
 * @property {Function} [dataAccessorFn] An optional function that take the item data and returns custom JSX for the cell
 * @property {Function} [sortFn] An optional function that takes the next order to be used to set the state when a sort is changed
 */

/**
 * Table
 * @typedef {Object} Table
 * @property {Number} count The count of total items in the table.
 * @property {ColumnDefs[]} columns A list column definitions.
 * @property {Object[]} data An array of objects containing the data for each row in the table
 * @property {Function} generateCellKey A function used to generate unique React ids for the columns
 * @property {Function} generateRowKey A function used to generate unique React ids for the rows
 * @property {String} id A unique id to be used as the React id for the component
 * @property {Boolean} [loading] A boolean that designates when the data for the table is being loaded
 * @property {String} noDataMessage A string that is displayed when the table has no data to display
 * @property {String} [sortKey] A string representing the current CMR sort
 */

const Table = ({
  columns,
  data,
  generateCellKey,
  generateRowKey,
  id,
  loading,
  limit,
  noDataMessage,
  sortKey
}) => (
  <Row>
    <Col>
      <BoostrapTable bordered striped responsive="xl">
        <thead>
          <tr className="border-top-0">
            {
              columns.map(({
                align,
                className,
                dataKey,
                sortKey: sortKeyOverride = '',
                sortFn = null,
                title
              }) => {
                const activeKey = sortKey?.replace('-', '')
                const hasActiveSort = !!sortKey
                const isAscendingSortActive = sortKey?.includes('-')

                // If a sort key override exists, check against that to determine if an item
                // is active. Otherwise, use the dataKey for that item.
                const isActiveSort = sortKeyOverride
                  ? activeKey === sortKeyOverride
                  : activeKey === dataKey

                const sortAscendingButtonClasses = classNames(
                  [
                    'table__sort-button text-secondary d-flex justify-content-center',
                    {
                      'table__sort-button--inactive': !isActiveSort || (isActiveSort && !isAscendingSortActive),
                      'table__sort-button--active': hasActiveSort && isActiveSort && !isAscendingSortActive
                    }
                  ]
                )

                const sortDescendingButtonClasses = classNames(
                  [
                    'table__sort-button text-secondary d-flex justify-content-center',
                    {
                      'table__sort-button--inactive': !isActiveSort || (isActiveSort && isAscendingSortActive),
                      'table__sort-button--active': hasActiveSort && isActiveSort && isAscendingSortActive
                    }
                  ]
                )

                return (
                  <th
                    key={`${id}_${dataKey}_column-heading`}
                    className={
                      classNames([
                        'border-start-0',
                        'border-end-0',
                        'align-middle',
                        {
                          [className]: className,
                          [`text-${align}`]: align
                        }
                      ])
                    }
                  >
                    <div className={
                      classNames([
                        'd-flex flex-row align-items-center',
                        {
                          'w-100': align === 'center',
                          [`justify-content-${align}`]: align
                        }
                      ])
                    }
                    >
                      {title}
                      {
                        sortFn && (
                          <div className="d-flex flex-column align-content-center">
                            <Button
                              className={sortAscendingButtonClasses}
                              naked
                              Icon={FaSortUp}
                              iconOnly
                              iconTitle="Arrow pointing up"
                              onClick={
                                () => {
                                  if (isActiveSort && isAscendingSortActive) {
                                    sortFn(sortKeyOverride || dataKey)

                                    return
                                  }

                                  sortFn(sortKeyOverride || dataKey, 'ascending')
                                }
                              }
                            >
                              {`Sort ${title} in ascending order`}
                            </Button>
                            <Button
                              className={sortDescendingButtonClasses}
                              naked
                              Icon={FaSortDown}
                              iconOnly
                              iconTitle="Arrow pointing down"
                              onClick={
                                () => {
                                  if (isActiveSort && !isAscendingSortActive) {
                                    sortFn(sortKeyOverride || dataKey)

                                    return
                                  }

                                  sortFn(sortKeyOverride || dataKey, 'descending')
                                }
                              }
                            >
                              {`Sort ${title} in descending order`}
                            </Button>
                          </div>
                        )
                      }
                    </div>
                  </th>
                )
              })
            }
          </tr>
        </thead>
        <tbody>
          {
            loading && (
              <For key="for-each-loading-key" each={Array.from(Array(limit))}>
                {
                  (column, i) => (
                    <tr key={`${id}_loading_row_${i}`}>
                      {
                        columns.map(() => {
                          // Generate a random number between 4 and 12 to be used as the column size
                          const randomColumnSize = random(4, 12)

                          return (
                            // Because rerenders of this componentIt should be safe to generate
                            // eslint-disable-next-line react/no-array-index-key
                            <td
                              key={uniqueId(`${id}_loading_row_`)}
                              className="col-md-4"
                              aria-busy={loading}
                            >
                              <Placeholder animation="glow" aria-hidden="true">
                                <Placeholder xs={randomColumnSize} />
                              </Placeholder>
                            </td>
                          )
                        })
                      }
                    </tr>
                  )
                }
              </For>
            )
          }
          {
            !loading && data.length === 0 && (
              <tr>
                <td colSpan={columns.length}>{noDataMessage}</td>
              </tr>
            )
          }
          {
            !loading && data.length > 0 && data.map((rowData) => (
              <tr key={`${id}_${generateRowKey(rowData)}`}>
                {
                  columns.map((column) => {
                    const {
                      dataKey,
                      className,
                      align,
                      dataAccessorFn = null
                    } = column

                    const cellData = get(rowData, dataKey)

                    let cellContent

                    if (dataAccessorFn) {
                      cellContent = dataAccessorFn(cellData, rowData)
                    } else {
                      cellContent = cellData
                    }

                    return (
                      <td
                        key={`${id}_${generateCellKey(rowData, dataKey)}`}
                        aria-busy="false"
                        className={
                          classNames([
                            {
                              [className]: className,
                              [`text-${align}`]: align
                            }
                          ])
                        }
                      >
                        {cellContent}
                      </td>
                    )
                  })
                }
              </tr>
            ))
          }
        </tbody>
      </BoostrapTable>
    </Col>
  </Row>
)

Table.defaultProps = {
  loading: null,
  noDataMessage: 'No data to display',
  sortKey: null
}

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  loading: PropTypes.bool,
  limit: PropTypes.number.isRequired,
  noDataMessage: PropTypes.string,
  sortKey: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  generateCellKey: PropTypes.func.isRequired,
  generateRowKey: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
}

export default Table
