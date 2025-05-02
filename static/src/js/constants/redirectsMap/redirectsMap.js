/**
 * Stores URLs and the URL they should be redirected to
*/
const REDIRECTS = {
  '/': 'collections',
  manage_collections: 'collections',
  manage_variables: 'variables',
  manage_services: 'services',
  manage_tools: 'tools',
  manage_visualizations: 'visualizations',
  manage_cmr: 'collections',
  tool_drafts: 'drafts/tools',
  service_drafts: 'drafts/services',
  collection_drafts: 'drafts/collections',
  variable_drafts: 'drafts/variables',
  visualization_drafts: 'drafts/visualizations'
}

export default REDIRECTS
