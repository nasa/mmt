/* eslint-disable react/prop-types */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react'
import { Badge, ListGroup } from 'react-bootstrap'
import './KeywordRecommendations.scss'
import { cloneDeep } from 'lodash-es'
import useAppContext from '../../hooks/useAppContext'
import getKeywordRecommendations from '../../utils/getKeywordRecommendations'
import useAccessibleEvent from '../../hooks/useAccessibleEvent'
import removeEmpty from '../../utils/removeEmpty'

/**
 * Renders a `Footer` component
 *
 * @component
 * @example <caption>Renders a `Footer` component</caption>
 * return (
 *   <Footer />
 * )
 */
const KeywordRecommendations = ({ formData, onChange }) => {
  const { draft } = useAppContext()
  const [recommendations, setRecommendations] = useState([])
  const [draftKeywords, setDraftKeywords] = useState([])
  const { ummMetadata } = draft || {}
  const { ScienceKeywords: scienceKeywords = [] } = ummMetadata

  const Instructions = () => (
    <div className="bg-light p-3">
      <strong>
        <i className="fa fa-question-circle" />
        {' '}
        Recommended Keywords
      </strong>
      <div>
        Based on your Abstract, the MMT automatically suggests recommended keywords
        {' '}
        <Badge pill bg="success">Recommended</Badge>
        {' '}
        for your collection. To associate a recommended keyword to your collection, click the
        {' '}
        <AddIcon />
        {' '}
        icon next to the keyword. Once associated to the collection, the keyword will display a
        green check
        {' '}
        <AcceptedIcon />
        . To remove a keyword once it’s been associated, click the
        {' '}
        <RemoveIcon />
        {' '}
        icon next to the keyword.
      </div>
    </div>
  )

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

    console.log('adding ', keyword)
    keyword.forEach((item, index) => {
      map[fields[index]] = item
    })

    formData.push(map)
    onChange(formData)
  }

  const removeKeyword = (keyword) => {
    const existingKeywords = removeEmpty(cloneDeep(formData))
    const updatedKeywords = existingKeywords.filter((draftKeyword) => {
      const keyword1 = Object.values(draftKeyword).join(' > ')
      const keyword2 = keyword.join(' > ')

      return keyword1 !== keyword2
    })

    onChange(updatedKeywords)
  }

  const RemoveIcon = ({ recommendation }) => (
    <i
      className="fa fa-times-circle"
      style={
        {
          color: 'red',
          fontSize: 18
        }
      }
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...useAccessibleEvent(() => {
        removeKeyword(recommendation.keyword.split('>').map((keyword) => (keyword.trim())))
      })}
    />
  )

  const AddIcon = ({ recommendation }) => (
    <i
      className="fa fa-plus-circle"
      style={
        {
          color: 'blue',
          fontSize: 18
        }
      }
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...useAccessibleEvent(() => {
        addKeyword(recommendation.keyword.split('>').map((keyword) => (keyword.trim())))
      })}
    />
  )

  const AcceptedIcon = () => (
    <i
      className="fa fa-check-square"
      style={
        {
          color: 'green',
          fontSize: 18
        }
      }
    />
  )

  const Keyword = ({ keyword }) => {
    const { keyword: delimitedKeyword, recommended } = keyword
    const { accepted } = keyword

    return (
      <ListGroup.Item>
        <div className="small">
          {delimitedKeyword}
          {' '}
          {recommended && (<Badge pill bg="success">Recommended</Badge>)}
          {' '}
          {!accepted ? (<AddIcon recommendation={keyword} />) : null}
          {' '}
          {accepted ? (<AcceptedIcon />) : null}
          {' '}
          {accepted ? (<RemoveIcon recommendation={keyword} />) : null}
        </div>
      </ListGroup.Item>

    )
  }

  const getDraftKeywords = () => {
    const keywordList = removeEmpty(cloneDeep(scienceKeywords))
    const keywords = keywordList.map((keyword) => {
      const delimitedKeyword = Object.values(keyword).join(' > ')

      const draftKeyword = {
        keyword: delimitedKeyword,
        recommended: false,
        accepted: true
      }

      return draftKeyword
    })

    return keywords
  }

  const isInRecommendedKeywordList = (keyword) => recommendations.some((recommendedKeyword) => {
    const { keyword: delimitedKeyword } = recommendedKeyword

    return delimitedKeyword === keyword
  })

  const isInDraftKeywordList = (keyword) => {
    const keywords = getDraftKeywords()

    return keywords.some((draftKeyword) => {
      const { keyword: delimitedKeyword } = draftKeyword

      return delimitedKeyword === keyword
    })
  }

  // eslint-disable-next-line arrow-body-style
  const createRecommendedKeywords = (keywordRecommendations) => {
    return keywordRecommendations.map((recommendedKeyword) => {
      const { keyword: delimitedKeyword } = recommendedKeyword
      let accepted = false

      if (isInDraftKeywordList(delimitedKeyword)) {
        accepted = true
      }

      const newKeyword = {
        ...recommendedKeyword,
        recommended: true,
        accepted
      }

      return newKeyword
    })
  }

  useEffect(() => {
    const { Abstract: abstract } = ummMetadata || {}

    const fetchKeywords = async () => {
      const result = await getKeywordRecommendations(abstract)
      const { recommendations: keywordRecommendations } = result
      const keywords = createRecommendedKeywords(keywordRecommendations)
      setRecommendations(keywords)
    }

    if (abstract) {
      fetchKeywords()
    }

    return () => {
      console.log('dismounting component')
    }
  }, [])

  useEffect(() => {
    const keywords = getDraftKeywords()
    setDraftKeywords(keywords)
  }, [scienceKeywords])

  useEffect(() => {
    const keywords = createRecommendedKeywords(recommendations)
    setRecommendations(keywords)
  }, [scienceKeywords])

  const keywords = []

  recommendations.forEach((keyword) => {
    const { keyword: delimitedKeyword, accepted } = keyword
    keywords.push(
      <Keyword key={`${delimitedKeyword}-${accepted}`} keyword={keyword} />
    )
  })

  draftKeywords.forEach((keyword) => {
    const { keyword: delimitedKeyword, accepted } = keyword

    if (!isInRecommendedKeywordList(delimitedKeyword)) {
      keywords.push(
        <Keyword key={`${delimitedKeyword}-${accepted}`} keyword={keyword} />
      )
    }
  })

  return (
    <div className="pb-3">
      <div>
        <Instructions />
      </div>
      <div>
        <ListGroup variant="flush">
          {keywords}
        </ListGroup>
      </div>
    </div>
  )
}

export default KeywordRecommendations
