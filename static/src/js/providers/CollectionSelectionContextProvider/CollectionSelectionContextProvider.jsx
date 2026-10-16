import React, {
  useCallback,
  useMemo,
  useState
} from 'react'
import PropTypes from 'prop-types'

import CollectionSelectionContext from '../../context/CollectionSelectionContext'

/**
 * @typedef {Object} CollectionSelectionContextProviderProps
 * @property {ReactNode} children The children to be rendered.

/**
 * Renders any children wrapped with access to CollectionSelectionContext.
 *
 * Bulk actions can only be performed on collections belonging to a single provider, so once
 * a collection is selected the selection is locked to that collection's provider until the
 * selection is cleared.
 * @param {CollectionSelectionContextProviderProps} props
 *
 * @example <caption>Renders children wrapped with access to CollectionSelectionContext.</caption>
 *
 * return (
 *   <CollectionSelectionContextProvider>
 *     {children}
 *   </CollectionSelectionContextProvider>
 * )
 */
const CollectionSelectionContextProvider = ({ children }) => {
  const [selectedCollections, setSelectedCollections] = useState([])

  const selectedProvider = selectedCollections[0]?.provider ?? null

  const toggleCollectionSelection = useCallback((conceptId, provider) => {
    setSelectedCollections((currentSelections) => {
      const isSelected = currentSelections.some((selection) => selection.conceptId === conceptId)

      if (isSelected) {
        return currentSelections.filter((selection) => selection.conceptId !== conceptId)
      }

      const currentProvider = currentSelections[0]?.provider

      // Bulk actions only operate on collections from a single provider, so ignore
      // attempts to select a collection from a different provider than the current selection
      if (currentProvider && currentProvider !== provider) {
        return currentSelections
      }

      return [
        ...currentSelections,
        {
          conceptId,
          provider
        }
      ]
    })
  }, [])

  // Adds every candidate not already selected, locking to the first candidate's provider
  // when nothing is selected yet and skipping any candidate from a different provider
  const selectCollections = useCallback((candidates) => {
    setSelectedCollections((currentSelections) => {
      const selectedConceptIds = new Set(currentSelections.map(({ conceptId }) => conceptId))
      let { provider: lockedProvider } = currentSelections[0] ?? {}

      const additions = candidates.filter((candidate) => {
        const { conceptId, provider } = candidate

        if (selectedConceptIds.has(conceptId)) return false

        if (!lockedProvider) {
          lockedProvider = provider
        }

        return provider === lockedProvider
      })

      if (additions.length === 0) return currentSelections

      return [...currentSelections, ...additions]
    })
  }, [])

  const deselectCollections = useCallback((conceptIds) => {
    const conceptIdsToRemove = new Set(conceptIds)

    setSelectedCollections((currentSelections) => (
      currentSelections.filter((selection) => !conceptIdsToRemove.has(selection.conceptId))
    ))
  }, [])

  const clearCollectionSelections = useCallback(() => {
    setSelectedCollections([])
  }, [])

  const providerValue = useMemo(() => ({
    clearCollectionSelections,
    deselectCollections,
    selectCollections,
    selectedCollections: selectedCollections.map(({ conceptId }) => conceptId),
    selectedProvider,
    toggleCollectionSelection
  }), [selectedCollections, selectedProvider])

  return (
    <CollectionSelectionContext.Provider value={providerValue}>
      {children}
    </CollectionSelectionContext.Provider>
  )
}

CollectionSelectionContextProvider.defaultProps = {
  children: null
}

CollectionSelectionContextProvider.propTypes = {
  children: PropTypes.node
}

export default CollectionSelectionContextProvider
