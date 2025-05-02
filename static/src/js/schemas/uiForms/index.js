import servicesConfiguration from './serviceConfiguration'
import toolsConfiguration from './toolsConfiguration'
import collectionsConfiguration from './collectionsConfiguration'
import variableConfiguration from './variableConfiguration'
import visualizationTilesConfiguration from './visualizationTilesConfiguration'
import visualizationMapsConfiguration from './visualizationMapsConfiguration'

const formConfigurations = {
  Tool: toolsConfiguration,
  Service: servicesConfiguration,
  Collection: collectionsConfiguration,
  Variable: variableConfiguration,
  Visualization_Tiles: visualizationTilesConfiguration,
  Visualization_Maps: visualizationMapsConfiguration
}

export default formConfigurations
