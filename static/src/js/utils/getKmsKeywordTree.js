import { getApplicationConfig } from 'sharedUtils/getConfig'

/**
 * Recursively adds unique IDs to each node in the tree.
 * @param {Object} node - The node to process.
 * @returns {Object} A new node with added ID.
 */
const addIdsToNodes = (node) => {
  const newNode = {
    ...node,
    id: node.key || node.title
  }
  if (node.children) {
    newNode.children = node.children.map(addIdsToNodes)
  }

  return newNode
}

/**
 * Fetches the keyword tree from the KMS server and processes it.
 * @param {Object} version - The version object containing version information.
 * @param {Object} scheme - The scheme object containing the scheme name.
 * @returns {Promise<Object>} A promise that resolves to the processed keyword tree.
 * @throws {Error} If there's an error fetching or processing the tree.
 *
 * @example
 * // Usage example
 * const version = { version: '1.0', version_type: 'draft' };
 * const scheme = { name: 'MyScheme' };
 *
 * try {
 *   const keywordTree = await getKmsKeywordTree(version, scheme);
 *   console.log(keywordTree);
 * } catch (error) {
 *   console.error('Failed to get keyword tree:', error);
 * }
 */
const getKmsKeywordTree = async (version, scheme) => {
  const { kmsHost } = getApplicationConfig()
  try {
    // In case of published version, use 'published' instead of the version label
    let versionParam = version.version
    if (version.version_type === 'published') {
      versionParam = 'published'
    }

    const schemeParam = encodeURIComponent(scheme.name)

    // Fetch data from KMS server
    const response = await fetch(`${kmsHost}/tree/concept_scheme/${schemeParam}?version=${versionParam}`, {
      method: 'GET'
    })

    if (!response.ok) {
      throw new Error(`getKmsKeywordTree HTTP error! status: ${response.status}`)
    }

    const json = await response.json()

    // Add ids to all nodes in the tree
    const treeWithIds = addIdsToNodes(json.tree.treeData[0].children[0])

    return treeWithIds
  } catch (error) {
    console.error('Error fetching KMS keyword tree:', error)
    throw error
  }
}

export default getKmsKeywordTree
