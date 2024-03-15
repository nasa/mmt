import React from 'react'
import {
  Navigate,
  Route,
  Routes,
  useParams
} from 'react-router'

import DraftPreview from '../../components/DraftPreview/DraftPreview'
import DraftList from '../../components/DraftList/DraftList'
import MetadataForm from '../../components/MetadataForm/MetadataForm'
import ManageCollectionAssociation from '../../components/ManageCollectionAssociation/ManageCollectionAssociation'
import urlValueTypeToConceptTypeMap from '../../constants/urlValueToConceptTypeMap'
import CollectionAssociation from '../../components/CollectionAssociation/CollectionAssociation'

/**
 * Renders a `DraftsPage` component
 *
 * @component
 * @example <caption>Renders a `DraftsPage` component</caption>
 * return (
 *   <DraftsPage />
 * )
 */
const DraftsPage = () => {
  const { draftType } = useParams()

  const currentDraftType = urlValueTypeToConceptTypeMap[draftType]

  if (draftType && !currentDraftType) {
    return (
      <Navigate to="/404" replace />
    )
  }

  return (
    <Routes>
      <Route
        index
        element={<DraftList draftType={currentDraftType} />}
      />
      <Route
        element={<MetadataForm />}
        path="new"
      />
      <Route
        element={<DraftPreview />}
        path=":conceptId"
      />
      <Route
        element={<MetadataForm />}
        path=":conceptId/:sectionName"
      />
      <Route
        element={<MetadataForm />}
        path=":conceptId/:sectionName/:fieldName"
      />
      <Route
        element={<CollectionAssociation draftType={currentDraftType} />}
        path=":conceptId/collection-association"
      />
    </Routes>
  )
}

export default DraftsPage
