/**
 * Function to determine whether to hide 'GetService'
 * @param {Object} props An form object from uiSchema
 */
const shouldHideGetService = (props) => {
  const { URLContentType, Type } = props

  if (URLContentType === 'DistributionURL' && Type === 'USE SERVICE API') {
    return false // Do not hide 'USE SERVICE API'
  }

  return true // Hide 'USE SERVICE API'
}

export default shouldHideGetService
