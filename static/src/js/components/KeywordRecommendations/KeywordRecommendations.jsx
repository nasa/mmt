import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import { Badge, ListGroup } from 'react-bootstrap'
import { cloneDeep, uniqBy } from 'lodash-es'
import PropTypes from 'prop-types'
import {
  FaCheckSquare,
  FaPlusCircle,
  FaTimesCircle
} from 'react-icons/fa'
import getKeywordRecommendations from '../../utils/getKeywordRecommendations'
import sendKeywordRecommendationsFeedback from '../../utils/sendKeywordRecommendationsFeedback'
import removeEmpty from '../../utils/removeEmpty'
import KeywordRecommendationsKeyword from '../KeywordRecommendationsKeyword/KeywordRecommendationsKeyword'
import errorLogger from '../../utils/errorLogger'
import useAppContext from '../../hooks/useAppContext'
import Button from '../Button/Button'
import LoadingBanner from '../LoadingBanner/LoadingBanner'
import For from '../For/For'

/**
 * Renders the KeywordRecommendations component
 *
 * @component
 * @example <caption>Renders a `KeywordRecommendations` component</caption>
 * return (
 *   <KeywordRecommendations formData={formData} onChange={onChange} />
 * )
 */
const KeywordRecommendations = ({ formData, onChange }) => {
  const [recommendations, setRecommendations] = useState([])
  const [draftKeywords, setDraftKeywords] = useState([])
  const [requestId, setRequestId] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const { draft = {} } = useAppContext()
  const { ummMetadata = {} } = draft
  const { ScienceKeywords: scienceKeywords = [] } = ummMetadata
  const { Abstract: abstract } = ummMetadata
  const stateRef = useRef({})

  const instructions = (
    <div className="bg-light p-3">
      <strong>
        <i className="fa fa-question-circle" />
        {' '}
        Recommended Keywords
      </strong>
      <div className="keyword-recommendations__instructions">
        Based on your Abstract, the MMT automatically suggests recommended keywords
        {' '}
        <Badge pill bg="success">Recommended</Badge>
        {' '}
        for your collection. To associate a recommended keyword to your collection, click the
        {' '}
        <Button className="keyword-recommendations-keyword__add-icon" iconTitle="Add" inline naked Icon={FaPlusCircle} />
        {' '}
        icon next to the keyword. Once associated to the collection, the keyword will display a
        green check
        {' '}
        <Button className="keyword-recommendations-keyword__accept-icon" iconTitle="Accept" inline naked Icon={FaCheckSquare} />
        . To remove a keyword once it’s been associated, click the
        {' '}
        <Button className="keyword-recommendations-keyword__remove-icon" iconTitle="Remove" inline naked Icon={FaTimesCircle} />
        {' '}
        icon next to the keyword.
      </div>
    </div>
  )

  /**
 * Creates a delimited keyword from the keyword's metadata
 * @param {Object} keywordObject
 * @returns the keyword delimited with '>'
 */
  const createDelimitedKeyword = (keyword) => Object.values(keyword).join(' > ')

  /**
   * Create an array from a delimited keyword
   * @param (String) keyword the delimited keyword
   * @returns the keyword as an array
   */
  const createArraySeparatedKeyword = (keyword) => keyword.split('>').map((value) => (value.trim()))

  /**
   * Adds a keyword to the formdata
   * @param {String} keyword the > delimited keyword
   */
  const addKeyword = (keyword) => {
    const fields = [
      'Category',
      'Topic',
      'Term',
      'VariableLevel1',
      'VariableLevel2',
      'VariableLevel3']

    const map = {}
    fields.forEach((field) => {
      map[field] = null
    })

    const arrayKeyword = createArraySeparatedKeyword(keyword)
    arrayKeyword.forEach((item, index) => {
      map[fields[index]] = item
    })

    formData.push(map)
    onChange(formData)
  }

  /**
   * Removes a keyword from form data
   * @param {String} keyword the > delimited keyword
   */
  const removeKeyword = (keyword) => {
    const existingKeywords = removeEmpty(cloneDeep(formData))
    const updatedKeywords = existingKeywords.filter((draftKeyword) => {
      const keyword1 = Object.values(draftKeyword).join(' > ')

      return keyword !== keyword1
    })

    onChange(updatedKeywords)
  }

  /**
   * Retrieves out of form data a list of Keyword objects
   * of the form { keyword: string, recommended: bool, accepted: bool }
   * @returns list of keyword objects
   */
  const getDraftKeywords = () => {
    const keywordList = removeEmpty(cloneDeep(scienceKeywords))
    const keywords = keywordList.map((keyword) => {
      const delimitedKeyword = createDelimitedKeyword(keyword)

      const draftKeyword = {
        keyword: delimitedKeyword,
        recommended: false,
        accepted: true
      }

      return draftKeyword
    })

    return keywords
  }

  /**
   * Returns true if the delimited Keyword is in the recommended keyword list.
   * @param {Array} keywordRecommendations the array of recommendations
   * @param {String} delimitedKeyword the delimited keyword
   * @returns true if the delimited Keyword is in the recommended keyword list, false if not.
   */
  const isInRecommendedKeywordList = (
    keywordRecommendations,
    delimitedKeyword
  ) => keywordRecommendations.some(
    (recommendedKeyword) => {
      const { keyword: recommendedDelimitedKeyword } = recommendedKeyword

      return delimitedKeyword === recommendedDelimitedKeyword
    }
  )

  /**
   * Returns true if the delimited Keyword is in the draft form data.
   * @param {String} keyword the delimited keyword
   * @returns true if the delimited Keyword is in the draft form data, false if not.
   */
  const isInDraftKeywordList = (keyword) => {
    const keywords = getDraftKeywords()

    return keywords.some((draftKeyword) => {
      const { keyword: delimitedKeyword } = draftKeyword

      return delimitedKeyword === keyword
    })
  }

  /**
   * Augments each keyword coming back from GKR to include accepted and recommended properties.
   * @param {Array} keywordRecommendations the list of recommended keywords from GKR
   * @returns the augmented list
   */
  // eslint-disable-next-line arrow-body-style
  const createRecommendedKeywords = (keywordRecommendations) => {
    return keywordRecommendations.map((recommendedKeyword) => {
      const { keyword: delimitedKeyword } = recommendedKeyword
      let accepted = false

      if (isInDraftKeywordList(delimitedKeyword)) {
        accepted = true
      }

      return {
        ...recommendedKeyword,
        recommended: true,
        accepted
      }
    })
  }

  /**
   * Store state for component dismount
   */
  useEffect(() => {
    stateRef.current = {
      draftKeywords,
      recommendations,
      requestId
    }
  }, [draftKeywords, recommendations, requestId])

  /**
   * Report GKR feedback.   Sends a list of new, accepted, and rejected keywords.
   */
  const reportFeedback = () => {
    // eslint-disable-next-line no-shadow
    const { requestId, draftKeywords, recommendations } = stateRef.current
    if (requestId) {
      const recommendationObj = {}
      recommendations.forEach((recommendation) => {
        const { uuid, accepted } = recommendation
        recommendationObj[uuid] = accepted
      })

      const newKeywords = draftKeywords.filter((keyword) => {
        const { keyword: delimitedKeyword } = keyword

        return !isInRecommendedKeywordList(recommendations, delimitedKeyword)
      })

      sendKeywordRecommendationsFeedback(
        requestId,
        recommendationObj,
        newKeywords.map((draftKeyword) => (draftKeyword.keyword))
      )
    }
  }

  /**
   * Retrieves the initial recommended keywords on component mount.
   */
  useEffect(() => {
    const fetchKeywords = async () => {
      const result = await getKeywordRecommendations(abstract)
      const { uuid, recommendations: keywordRecommendations } = result
      const uniqKeywordRecommendations = uniqBy(keywordRecommendations, 'keyword')
      const keywords = createRecommendedKeywords(uniqKeywordRecommendations)
      setRecommendations(keywords)
      setRequestId(uuid)
      setLoading(false)
    }

    if (abstract && getDraftKeywords().length === 0) {
      setLoading(true)
      fetchKeywords()
        .catch((error) => {
          errorLogger('error fetching keywords from GKR', error.message)
          setLoading(false)
        })
    }

    return () => {
      reportFeedback()
    }
  }, [])

  /**
   * If the science keyword form data changes, update the draft and recommended keywords list.
   */
  useEffect(() => {
    const draftKeywordsList = getDraftKeywords()
    setDraftKeywords(draftKeywordsList)

    const recommendedKeywordsList = createRecommendedKeywords(recommendations)
    setRecommendations(recommendedKeywordsList)
  }, [draft])

  const keywords = (recommendations.concat(draftKeywords)).map((keyword) => {
    const { keyword: delimitedKeyword, accepted } = keyword

    return {
      key: `${delimitedKeyword}-${accepted}`,
      keyword
    }
  })

  // Render the recommended keyword component.
  return (
    <div className="pb-3">
      <div>
        {requestId && (instructions)}
      </div>
      <div>
        <ListGroup variant="flush">
          {
            isLoading && (
              <div className="w-100">
                <span className="d-block">
                  <LoadingBanner />
                </span>
              </div>
            )
          }
          {
            !isLoading && (
              <For
                each={keywords}
              >
                {
                  ({ key, keyword }) => (
                    <KeywordRecommendationsKeyword
                      key={key}
                      keyword={keyword}
                      addKeyword={addKeyword}
                      removeKeyword={removeKeyword}
                    />
                  )
                }
              </For>
            )
          }
        </ListGroup>
      </div>
    </div>
  )
}

KeywordRecommendations.defaultProps = {
  formData: []
}

KeywordRecommendations.propTypes = {
  formData: PropTypes.arrayOf(PropTypes.shape({})),
  onChange: PropTypes.func.isRequired
}

export default KeywordRecommendations
