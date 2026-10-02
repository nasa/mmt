import {
  useCallback,
  useEffect,
  useState
} from 'react'

import getKmsConceptVersions from '@/js/utils/getKmsConceptVersions'

const versionTypeLabels = {
  draft: 'DRAFT-NEXT RELEASE',
  published: 'PRODUCTION',
  past_published: 'PAST PUBLISHED'
}

const sortOrder = ['draft', 'published', 'past_published']

export const formatKmsConceptVersions = (versions) => versions
  .map((version) => {
    const type = version.type.toLowerCase()

    return {
      value: version.version,
      label: `${version.version} (${versionTypeLabels[type] || version.type})`,
      type
    }
  })
  .sort((a, b) => sortOrder.indexOf(a.type) - sortOrder.indexOf(b.type))

const useKmsConceptVersions = ({ enabled = true } = {}) => {
  const [versions, setVersions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let isActive = true

    const fetchVersions = async () => {
      try {
        const result = await getKmsConceptVersions()
        if (isActive) setVersions(formatKmsConceptVersions(result.versions))
      } catch (error) {
        console.error('Error fetching versions:', error)
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    if (enabled) {
      setIsLoading(true)
      fetchVersions()
    }

    return () => {
      isActive = false
    }
  }, [enabled, reloadKey])

  const refresh = useCallback(() => {
    setVersions([])
    setIsLoading(true)
    setReloadKey((currentKey) => currentKey + 1)
  }, [])

  return {
    isLoading,
    refresh,
    versions
  }
}

export default useKmsConceptVersions
