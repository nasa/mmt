import PropTypes from 'prop-types'
import { isEmpty } from 'lodash-es'

/**
 * @typedef {Object} ForProps
 * @property {Function} children A function that returns a React node. The value of each item will be passed to the function as the first argument
 * @property {(Object|String|Number)} each An array. The value of each item in the array will be passed to the `children` function as the first argument.
 */

/*
 * Renders a `For` component.
 *
 * The component is used to create a list of components from an array
 *
 * @param {ForProps} props
 *
 * @component
 * @example <caption>Render a list custom of items</caption>
 * return (
 *   <For
 *      each={['Thing', 'Thing', 'Thing']}
 *    >
 *      {
 *        (item, i) => (
 *          <div key={item}>
 *            {`${item} ${i}`}
 *          </div>
 *        )
 *      }
 *    </For>
 * )
 */
export const For = ({
  children,
  each,
  empty
}) => {
  // console.log("🚀 ~ empty:", empty)
  // console.log("🚀 ~ each:", each)
  // console.log("🚀 ~ children:", children)
  const items = each.map((item, index) => children(item, index))

  if (isEmpty(items) && empty) return empty

  return items
}

For.propTypes = {
  children: PropTypes.func.isRequired,
  // Disabling the following rule to allow undefined to be passed as a value in the array
  // eslint-disable-next-line react/forbid-prop-types
  each: PropTypes.array.isRequired
}

export default For
