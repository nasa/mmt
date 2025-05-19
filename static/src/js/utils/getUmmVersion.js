import { getUmmVersionsConfig } from '../../../../sharedUtils/getConfig'

/**
 * Find the umm version based on the provided concept type
 * @param {String} conceptId concept type to determine the concept type
 */
const getUmmVersion = (conceptType) => {
  const ummVersion = getUmmVersionsConfig()

  switch (conceptType) {
    case 'Collection':
      return ummVersion.ummC
    case 'Service':
      return ummVersion.ummS
    case 'Tool':
      return ummVersion.ummT
    case 'Variable':
      return ummVersion.ummV
    case 'Visualization':
      return ummVersion.ummVis
    default:
      return null
  }
}

export default getUmmVersion
