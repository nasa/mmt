import servicesConfiguration from './serviceConfiguration'
import toolsConfiguration from './toolsConfiguration'
import collectionsConfiguration from './collectionsConfiguration'
import variableConfiguration from './variableConfiguration'
import visualizationConfiguration from './visualizationConfiguration'
import citationConfiguration from './citationConfiguration'

const formConfigurations = {
  Tool: toolsConfiguration,
  Service: servicesConfiguration,
  Collection: collectionsConfiguration,
  Variable: variableConfiguration,
  Visualization: visualizationConfiguration,
  Citation: citationConfiguration
}

export default formConfigurations
