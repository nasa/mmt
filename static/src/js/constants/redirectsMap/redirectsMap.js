/**
 * Stores URLs and the URL they should be redirected to
*/
const REDIRECTS = {
  '/': 'manage-collections',
  manage_collections: 'manage-collections',
  manage_variables: 'manage-variables',
  manage_services: 'manage-services',
  manage_tools: 'manage-tools',
  manage_cmr: 'manage-cmr',
  tool_drafts: 'drafts/tools',
  service_drafts: 'drafts/services',
  collection_drafts: 'drafts/collections',
  variable_drafts: 'drafts/variables'
}

export default REDIRECTS
