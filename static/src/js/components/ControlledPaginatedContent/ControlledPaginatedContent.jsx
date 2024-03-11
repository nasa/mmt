import React from 'react'
import PropTypes from 'prop-types'

import Pagination from '../Pagination/Pagination'

/**
 * @typedef {Object} ControlledPaginatedContentProps
 * @property {Number} activePage The active page
 * @property {Number} count The total number of items paginated
 * @property {Number} offset The current offset
 * @property {Number} limit The current page limit
 * @property {Function} children A function returning the paginated content
 * @property {Function} setPage A function to set the next page
 */

/**
 * Renders a `ControlledPaginatedContent` component
 *
 * This component can be used to wrap pagination functionality around any list of items.
 * @property {ControlledPaginatedContentProps} props The props passed to the component
 *
 * @component
 * @example <caption>Renders a `ControlledPaginatedContent` component</caption>
 * return (
 *   <ControlledPaginatedContent {...props}>
 *     {
 *       ({ pagination }) => {
 *         return(
 *          <>
 *             {pagination}
 *             <PaginatedThing/>
 *             {pagination}
 *          </>
 *         )
 *       }
 *     }
 *   </ControlledPaginatedContent>
 * )
 */
const ControlledPaginatedContent = ({
  activePage,
  count,
  limit,
  children,
  setPage
}) => {
  const totalPages = Math.ceil(count / limit)
  const isLastPage = totalPages === activePage
  const firstResultIndex = (activePage - 1) * limit
  const resultsOnPage = isLastPage ? count - (limit * (activePage - 1)) : limit
  const lastResultIndex = firstResultIndex + resultsOnPage

  const pagination = (
    <Pagination
      setPage={setPage}
      activePage={activePage}
      totalPages={totalPages}
    />
  )

  return (
    <>
      {
        children({
          pagination,
          totalPages,
          firstResultPosition: firstResultIndex + 1,
          lastResultPosition: lastResultIndex
        })
      }
    </>
  )
}

ControlledPaginatedContent.defaultProps = {
  count: 1
}

ControlledPaginatedContent.propTypes = {
  activePage: PropTypes.number.isRequired,
  count: PropTypes.number,
  limit: PropTypes.number.isRequired,
  children: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired
}

export default ControlledPaginatedContent
