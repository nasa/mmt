import servicesConfiguration from './serviceConfiguration'
import toolsConfiguration from './toolsConfiguration'
import collectionsConfiguration from './collectionsConfiguration'
import variableConfiguration from './variableConfiguration'
import keywordConfiguration from './keywordConfiguration'

const formConfigurations = {
  Tool: toolsConfiguration,
  Service: servicesConfiguration,
  Collection: collectionsConfiguration,
  Variable: variableConfiguration,
  Keywords: keywordConfiguration
}

export default formConfigurations
