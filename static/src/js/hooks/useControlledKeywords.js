import { useEffect, useState } from 'react'

import useAppContext from './useAppContext'
import fetchCmrKeywords from '../utils/fetchCmrKeywords'
import createResponseFromKeywords from '../utils/createResponseFromKeywords'

const useControlledKeywords = (keywordType, schemaKeywords, controlledKeywordsMap) => {
  const {
    addKeywordsData,
    keywords
  } = useAppContext()
  const [retrievedKeywords, setRetrievedKeywords] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (schemaKeywords) {
      setRetrievedKeywords(
        createResponseFromKeywords(schemaKeywords, Object.values(controlledKeywordsMap))
      )

      return
    }

    const { [keywordType]: keywordsObject = {} } = keywords
    const { data } = keywordsObject

    if (loading) return

    if (data) {
      setRetrievedKeywords(data)

      return
    }

    if (keywordType) {
      setLoading(true)
      const cmrEnum = async () => {
        const cmrKeywords = await fetchCmrKeywords(keywordType)

        addKeywordsData({
          data: cmrKeywords,
          type: keywordType
        })

        setLoading(false)
      }

      cmrEnum()
    }
  }, [keywords])

  return {
    keywords: retrievedKeywords,
    isLoading: loading
  }
}

export default useControlledKeywords
