import React from 'react'
import { Badge, ListGroup } from 'react-bootstrap'
import PropTypes from 'prop-types'
import useAccessibleEvent from '../../hooks/useAccessibleEvent'
import './KeywordRecommendationsKeyword.scss'

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
          <i
            className="keyword-recommendations-keyword__add-icon fa fa-plus-circle"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...useAccessibleEvent(() => {
              addKeyword(delimitedKeyword)
            })}
          />
        ) : null
      }
      {' '}
      {
        accepted ? (
          <i
            role="img"
            className="keyword-recommendations-keyword__accept-icon fa fa-check-square"
          />
        ) : null
      }
      {' '}
      {
        accepted ? (
          <i
            className="keyword-recommendations-keyword__remove-icon fa fa-times-circle"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...useAccessibleEvent(() => {
              removeKeyword(delimitedKeyword)
            })}
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
