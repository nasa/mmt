import { getUmmVersionsConfig } from './getConfig'

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
    default:
      return null
  }
}

export default getUmmVersion
