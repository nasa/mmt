import { getApplicationConfig } from 'sharedUtils/getConfig'

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

const getKmsKeywordTree = async (version, scheme) => {
  const { kmsHost } = getApplicationConfig()
  try {
    // In case of published version, use 'published' instead of the version label
    let versionParam = version.version
    if (version.version_type === 'published') {
      versionParam = 'published'
    }

    const schemeParam = scheme.name

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
