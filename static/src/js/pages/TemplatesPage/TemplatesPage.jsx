import React from 'react'
import {
  Navigate,
  Route,
  Routes,
  useParams
} from 'react-router'
import urlValueTypeToConceptTypeMap from '../../constants/urlValueToConceptTypeMap'
import MetadataForm from '../../components/MetadataForm/MetadataForm'
import TemplateList from '../../components/TemplateList/TemplateList'
import DraftPreview from '../../components/DraftPreview/DraftPreview'

const TemplatesPage = () => {
  const { templateType } = useParams()

  const currentTemplateType = urlValueTypeToConceptTypeMap[templateType]

  if (templateType && !currentTemplateType) {
    return (
      <Navigate to="/404" replace />
    )
  }

  return (
    <Routes>
      <Route
        index
        element={<TemplateList templateType={currentTemplateType} />}
      />
      <Route
        element={<MetadataForm />}
        path="new"
      />
      <Route
        element={<DraftPreview />}
        path=":id"
      />
      <Route
        element={<MetadataForm />}
        path=":id/:sectionName"
      />
      <Route
        element={<MetadataForm />}
        path=":id/:sectionName/:fieldName"
      />
    </Routes>
  )
}

export default TemplatesPage
