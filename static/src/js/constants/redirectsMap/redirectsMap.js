/**
 * Stores URLs and the URL they should be redirected to
*/
const REDIRECTS = {
  '/': 'collections',
  citation_drafts: 'drafts/citations',
  collection_drafts: 'drafts/collections',
  manage_citations: 'citations',
  manage_cmr: 'collections',
  manage_collections: 'collections',
  manage_services: 'services',
  manage_tools: 'tools',
  manage_variables: 'variables',
  manage_visualizations: 'visualizations',
  service_drafts: 'drafts/services',
  tool_drafts: 'drafts/tools',
  variable_drafts: 'drafts/variables',
  visualization_drafts: 'drafts/visualizations'
}

export default REDIRECTS
