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
    // If schemaKeywords were provided, save the retrievedKeywords based on that value and return
    // out of the useEffect
    if (schemaKeywords) {
      setRetrievedKeywords(
        createResponseFromKeywords(schemaKeywords, Object.values(controlledKeywordsMap))
      )

      return
    }

    // If we are loading keywords from CMR return out of the useEffect
    if (loading) return

    const { [keywordType]: keywordsObject = {} } = keywords
    const { data } = keywordsObject

    // If we have data matching the keywordType from the AppContext, save that data to retrievedKeywords
    // and return out of the useEffect
    if (data) {
      setRetrievedKeywords(data)

      return
    }

    // Fetch keywords from CMR based on the keywordType provided
    if (keywordType) {
      // Set loading to true to block out any other requests
      setLoading(true)

      const cmrEnum = async () => {
        const cmrKeywords = await fetchCmrKeywords(keywordType)

        // Add the fetched keywords to the AppContext
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
