import React from 'react'
import { Route, Routes } from 'react-router'

import DraftPreview from '../../components/DraftPreview/DraftPreview'
import DraftList from '../../components/DraftList/DraftList'

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
  </Routes>
)

export default ToolDraftsPage
