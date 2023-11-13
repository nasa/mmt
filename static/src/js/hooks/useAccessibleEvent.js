/**
 * Adds the onClick and onKeyDown props to a component, calling the provided
 * callback on click of enter/spacebar is pressed
 * @param {Function} callback Callback function for when the element is clicked or enter/spacebar is pressed
 */
const useAccessibleEvent = (callback) => ({
  role: 'link',
  tabIndex: 0,
  onClick: (event) => {
    callback(event)
  },
  onKeyDown: (event) => {
    // If the enter key or the Spacebar key is pressed
    if (event.key === 'Enter' || event.key === ' ') {
      callback(event)
    }
  }
})

export default useAccessibleEvent
