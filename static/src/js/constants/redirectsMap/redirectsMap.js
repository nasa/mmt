/**
 * Stores URLs from legacy code and redirects users to appropriate URLS in react MMT
*/
const REDIRECTS = {
  '/': 'collections',
  collection_drafts: 'drafts/collections',
  manage_cmr: 'collections',
  manage_collections: 'collections',
  manage_services: 'services',
  manage_tools: 'tools',
  manage_variables: 'variables',
  service_drafts: 'drafts/services',
  tool_drafts: 'drafts/tools',
  variable_drafts: 'drafts/variables'
}

export default REDIRECTS
