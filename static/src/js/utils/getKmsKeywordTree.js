import { castArray } from 'lodash-es'

import { getApplicationConfig } from 'sharedUtils/getConfig'

/**
 * Recursively adds unique IDs to each node in the tree.
 * @param {Object} node - The node to process.
 * @returns {Object} A new node with added ID.
 */
const addIdsToNodes = (node) => {
  if (!node || (!node.key && !node.title)) return null
  const newNode = {
    ...node,
    id: node.key || node.title
  }
  if (Array.isArray(node.children)) {
    newNode.children = node.children
      .map(addIdsToNodes)
      .filter(Boolean) // Remove null children
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
const getKmsKeywordTree = async (version, scheme, searchPattern) => {
  const { kmsHost } = getApplicationConfig()
  try {
    // In case of published version, use 'published' instead of the version label
    let versionParam = version.version
    if (version.version_type === 'published') {
      versionParam = 'published'
    }

    const schemeParam = encodeURIComponent(scheme.name)

    let endpoint = `${kmsHost}/tree/concept_scheme/${schemeParam}?version=${versionParam}`
    if (searchPattern && searchPattern.trim() !== '') {
      endpoint += `&filter=${searchPattern}`
    }

    // Fetch data from KMS server
    const response = await fetch(endpoint, {
      method: 'GET'
    })

    if (!response.ok) {
      throw new Error(`getKmsKeywordTree HTTP error! status: ${response.status}`)
    }

    const json = await response.json()

    // Ensure treeData is always an array
    const treeDataArray = castArray(json.tree.treeData)

    // Process each root node in treeData
    // Process each root node in treeData
    const treesWithIds = treeDataArray
      .map((rootNode) => {
        // If rootNode has children, process them; otherwise, process rootNode itself
        const nodeToProcess = rootNode.children ? rootNode : rootNode

        return addIdsToNodes(nodeToProcess)
      })
      .filter(Boolean) // Remove null results

    return treesWithIds.length > 0 ? treesWithIds[0].children || [] : []
  } catch (error) {
    console.error('Error fetching KMS keyword tree:', error)
    throw error
  }
}

export default getKmsKeywordTree
