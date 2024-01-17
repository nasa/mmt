import { useLazyQuery } from '@apollo/client'
import { ToolPreview } from '@edsc/metadata-preview'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { TOOL } from '../../operations/queries/getTool'
import getConceptTypeByConceptId from '../../utils/getConceptTypeByConcept'
import LoadingBanner from '../LoadingBanner/LoadingBanner'
import Page from '../Page/Page'

const PublishPreview = () => {
  const {
    conceptId,
    revisionId
  } = useParams()

  const [previewMetadata, setPreviewMetadata] = useState()
  const [loading, setLoading] = useState(true)

  const derivedConceptType = getConceptTypeByConceptId(conceptId)
  console.log("🚀 ~ PublishPreview ~ derivedConceptType:", derivedConceptType)
  const [getMetadata] = useLazyQuery(TOOL, {
    variables: {
      params: {
        conceptId
      }
    },
    onCompleted: (getData) => {
      console.log('data from graphql', getData)
      const { tool } = getData
      const { revisionId } = tool
      console.log("🚀 ~ PublishPreview ~ revisionId:", revisionId)
      setPreviewMetadata(tool)
      setLoading(false)
    }
  })

  useEffect(() => {
    setLoading(true)
    getMetadata()
  }, [])

  if (loading) {
    return (
      <Page>
        <LoadingBanner />
      </Page>
    )
  }

  return (
    <ToolPreview
      conceptId={conceptId}
      conceptType="tool"
      tool={previewMetadata}
    />
  )
}

export default PublishPreview
