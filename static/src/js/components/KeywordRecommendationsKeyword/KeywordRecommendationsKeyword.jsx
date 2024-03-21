/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { Badge, ListGroup } from 'react-bootstrap'
import PropTypes from 'prop-types'
import useAccessibleEvent from '../../hooks/useAccessibleEvent'

const KeywordRecommendationsKeyword = ({ keyword, addKeyword, removeKeyword }) => {
  const { keyword: delimitedKeyword, recommended } = keyword
  const { accepted } = keyword

  return (
    <ListGroup.Item role="listitem">
      <div className="small">
        {delimitedKeyword}
        {' '}
        {recommended && (<Badge pill bg="success">Recommended</Badge>)}
        {' '}
        {
          !accepted ? (
            <i
              className="keyword-recommendations__add-icon fa fa-plus-circle"
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
              className="keyword-recommendations__accept-icon fa fa-check-square"
            />
          ) : null
        }
        {' '}
        {
          accepted ? (
            <i
              className="keyword-recommendations__remove-icon fa fa-times-circle"
              {...useAccessibleEvent(() => {
                removeKeyword(delimitedKeyword)
              })}
            />

          ) : null
        }
      </div>
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
