import React from 'react'
import { Badge, ListGroup } from 'react-bootstrap'
import PropTypes from 'prop-types'
import './KeywordRecommendationsKeyword.scss'
import {
  FaCheckSquare,
  FaPlusCircle,
  FaTimesCircle
} from 'react-icons/fa'
import Button from '../Button/Button'

const KeywordRecommendationsKeyword = ({ keyword, addKeyword, removeKeyword }) => {
  const { keyword: delimitedKeyword, recommended } = keyword
  const { accepted } = keyword

  return (
    <ListGroup.Item role="listitem">
      <span className="small keyword-recommendations-keyword__keyword">{delimitedKeyword}</span>
      {' '}
      {recommended && (<Badge pill bg="success">Recommended</Badge>)}
      {' '}
      {
        !accepted ? (
          <Button
            Icon={FaPlusCircle}
            className="keyword-recommendations-keyword__add-icon"
            inline
            naked
            onClick={
              () => {
                addKeyword(delimitedKeyword)
              }
            }
            iconTitle="Add"
          />
        ) : null
      }
      {' '}
      {
        accepted ? (
          <Button
            Icon={FaCheckSquare}
            className="keyword-recommendations-keyword__accept-icon"
            inline
            naked
            iconTitle="Accepted"
          />
        ) : null
      }
      {' '}
      {
        accepted ? (
          <Button
            Icon={FaTimesCircle}
            className="keyword-recommendations-keyword__remove-icon"
            inline
            naked
            onClick={
              () => {
                removeKeyword(delimitedKeyword)
              }
            }
            iconTitle="Remove"
          />

        ) : null
      }
    </ListGroup.Item>

  )
}

KeywordRecommendationsKeyword.defaultProps = {
}

KeywordRecommendationsKeyword.propTypes = {
  keyword: PropTypes.shape({
    keyword: PropTypes.string.isRequired,
    accepted: PropTypes.bool.isRequired,
    recommended: PropTypes.bool.isRequired
  }).isRequired,
  addKeyword: PropTypes.func.isRequired,
  removeKeyword: PropTypes.func.isRequired
}

export default KeywordRecommendationsKeyword
