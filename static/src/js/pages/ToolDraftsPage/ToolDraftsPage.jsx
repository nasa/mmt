import React from 'react'
import { Route, Routes } from 'react-router'

import DraftPreview from '../../components/DraftPreview/DraftPreview'
import DraftList from '../../components/DraftList/DraftList'
import MetadataForm from '../../components/MetadataForm/MetadataForm'

/**
 * Renders a `ToolDraftsPage` component
 *
 * @component
 * @example <caption>Renders a `ToolDraftsPage` component</caption>
 * return (
 *   <ToolDraftsPage />
 * )
 */
const ToolDraftsPage = () => (
  <Routes>
    <Route
      index
      element={<DraftList />}
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
  </Routes>
)

export default ToolDraftsPage
