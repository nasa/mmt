import { useContext } from 'react'

import CollectionSelectionContext from '../context/CollectionSelectionContext'

const useCollectionSelectionContext = () => useContext(CollectionSelectionContext)

export default useCollectionSelectionContext
