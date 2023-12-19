/**
 * Function to determine whether to hide 'GetData'
 * @param {Object} props An form object from uiSchema
 */
const shouldHideGetData = (props) => {
  const { URLContentType, Type } = props

  if (URLContentType === 'DistributionURL' && (Type === 'GET DATA' || Type === 'GET CAPABILITIES')) {
    return false // Do not hide 'GetData'
  }

  return true // Hide 'GetData'
}

export default shouldHideGetData
