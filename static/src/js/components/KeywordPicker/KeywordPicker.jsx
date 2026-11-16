import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { cloneDeep, isEmpty } from 'lodash-es'
import { Typeahead } from 'react-bootstrap-typeahead'
import Button from 'react-bootstrap/Button'
import buildKeywordPaths from '../../utils/buildKeywordPaths'
import useControlledKeywords from '../../hooks/useControlledKeywords'
import useAccessibleEvent from '../../hooks/useAccessibleEvent'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import KeywordRecommendations from '../KeywordRecommendations/KeywordRecommendations'
import removeEmpty from '../../utils/removeEmpty'

import './KeywordPicker.scss'

import LoadingBanner from '../LoadingBanner/LoadingBanner'
/**
 * KeywordPicker
 * @typedef {Object} KeywordPicker
 * @property {Object} formData An Object with the saved metadata
 * @property {Function} onChange A callback function triggered when the user adds a keyword.
 * @property {Object} schema A UMM Schema for the widget being previewed.
 * @property {Object} uiSchema A uiSchema for the field being shown. `ui:add_button_label`
 * overrides the submit button's text (default 'Add Keyword'). `ui:selectable_parents`
 * (default false) makes a non-leaf item selectable the same way a leaf is (a checkbox,
 * toggling the pick), instead of only navigable into its children.
 * @property {Boolean} required Is the field required.
 */

/**
 * Renders KeywordPicker
 * @param {KeywordPicker} props
 */
const KeywordPicker = ({
  formData,
  onChange,
  required,
  schema,
  uiSchema
}) => {
  const { description } = schema
  const title = uiSchema['ui:title']
  const includeRecommendedKeywords = uiSchema['ui:includeRecommendedKeywords'] || false
  const schemeValues = uiSchema['ui:scheme_values']
  const addButtonLabel = uiSchema['ui:add_button_label'] || 'Add Keyword'
  const selectableParents = uiSchema['ui:selectable_parents'] || false
  const [keywordList, setKeywordList] = useState([])
  const [currentList, setCurrentList] = useState([])
  const [selectedKeywords, setSelectedKeywords] = useState([])
  const [fullPath, setFullPath] = useState([])
  const [loading, setLoading] = useState(true)
  const [finalSelectedValue, setFinalSelectedValue] = useState(null)
  const [currentSelected, setCurrentSelected] = useState([])

  const [marginTop, setMarginTop] = useState(0)
  const [marginLeft, setMarginLeft] = useState(0)
  const typeaheadRef = useRef(null)

  const filterKeywords = (path) => {
    const filteredPath = []
    const joinedPath = selectedKeywords.join('>')
    if (path.startsWith(joinedPath)) {
      const replace = path.replace(`${joinedPath}>`, '')
      filteredPath.push(replace)
    }

    return filteredPath
  }

  const keywordScheme = uiSchema['ui:keyword_scheme']

  const {
    keywords
  } = useControlledKeywords(keywordScheme)

  // The same instance is reused when the caller switches scheme (e.g. bulk actions' Target
  // Field going Science -> Location Keywords) -- React won't remount it just because
  // `uiSchema` changed, so without this the previous scheme's breadcrumb/list stays stale
  // until the new scheme's keywords finish loading.
  useEffect(() => {
    setKeywordList([])
    setCurrentList([])
    setSelectedKeywords([])
    setFullPath([])
    setFinalSelectedValue(null)
    setCurrentSelected([])
    setMarginTop(0)
    setMarginLeft(0)
  }, [keywordScheme])

  // If keywords are available this is create the keyword object and set it to keywordList.
  useEffect(() => {
    if (!isEmpty(keywords)) {
      setLoading(true)
      setKeywordList(buildKeywordPaths(keywords, uiSchema))
      setLoading(false)
    }
  }, [keywords])

  useEffect(() => {
    if (Object.keys(keywordList).length > 0) {
      const createCurrentList = []
      const createSelectedKeyword = []
      const createFullPath = []

      createSelectedKeyword.push(keywordList[0][0])

      keywordList.forEach((path) => {
        if (!createCurrentList.includes(path[1])) {
          createCurrentList.push(path[1])
        }
      })

      // Creates a fullPath array with a '>' separator
      keywordList.forEach((keyword) => {
        const join = keyword.join('>')
        createFullPath.push(join)
      })

      setSelectedKeywords(createSelectedKeyword)
      setCurrentList(createCurrentList)
      setFullPath(createFullPath)
    }
  }, [keywordList])

  const searchResult = []
  fullPath.forEach((keyword) => {
    const path = filterKeywords(keyword)
    if (path.length > 0) {
      searchResult.push(path.at(0))
    }
  })

  // This is a helper function that will get the children for the current path
  // Example:
  //    parent: Tool Keyword > Earth Science Services > DATA ANALYSIS AND VISUALIZATION > CALIBRATION/VALIDATION
  //    previousSelected: Tool Keyword > Earth Science Services
  //    In this case the function will return [DATA ANALYSIS AND VISUALIZATION  CALIBRATION/VALIDATION]
  const getChildren = (fullSelectedPath) => {
    const updatedList = []

    fullPath.forEach((path) => {
      if (path.startsWith(fullSelectedPath)) {
        let editPath = path.replace(`${fullSelectedPath}`, '')
        if (editPath.startsWith('>')) {
          editPath = editPath.substring(1)
        }

        const toArray = editPath.split('>')
        const keyword = toArray.at(0)
        if (keyword.length > 0 && !updatedList.includes(keyword)) {
          updatedList.push(toArray.at(0))
        }
      }
    })

    return updatedList
  }

  const getFullSelectedPath = (item) => {
    const copy = cloneDeep(selectedKeywords)
    copy.push(item)

    return copy.join('>')
  }

  const isLeaf = (fullSelectedPath) => getChildren(fullSelectedPath).length === 0

  // Toggles `item` as the current pick -- when `selectableParents` is on, checking its
  // checkbox again (it's already the pick) clears it, instead of only ever being
  // replaceable by picking something else.
  const handleSelectChildren = (item) => {
    if (selectableParents && item === finalSelectedValue) {
      setFinalSelectedValue(null)
      setCurrentSelected([])

      return
    }

    const finalList = []
    selectedKeywords.forEach((keyword) => {
      finalList.push(keyword)
    })

    finalList.push(item)
    setFinalSelectedValue(item)
    setCurrentSelected(finalList.splice(1))
  }

  // Iterates over formData and checks if the keywords has already been added.
  const isKeywordAdded = (keyword) => {
    let found = false
    formData.forEach((item) => {
      if (Object.values(item).join('>').includes(keyword.join('>'))) {
        found = true
      }
    })

    return found
  }

  // This is a helper function that will add the selected keywords in the desired format
  // Example: "ToolCategory": "EARTH SCIENCE SERVICES",
  //          "ToolTopic": "DATA ANALYSIS AND VISUALIZATION",
  //          "ToolTerm": "CALIBRATION/VALIDATION"
  const addKeywords = (keyword) => {
    const found = isKeywordAdded(keyword)
    const map = {}
    if (found) {
      return null
    }

    schemeValues.forEach((item) => {
      map[item] = null
    })

    Object.keys(map).forEach((item, index) => {
      map[item] = keyword[index]
    })

    return map
  }

  // Navigates into a parent element's children. When `selectableParents` is on, this is
  // purely navigation -- picking a parent as the current value (leaf or not) goes through
  // handleSelectChildren instead, the same as a leaf (see displayItems), so navigating here
  // only clears any previous pick. Otherwise (existing behavior), navigating itself updates
  // `currentSelected` to the path just navigated into, since that's the only way a non-leaf
  // level could ever be added.
  const handleSelectParent = (item) => {
    const fullSelectedPath = getFullSelectedPath(item)
    const updatedList = getChildren(fullSelectedPath)

    if (selectableParents) {
      setFinalSelectedValue(null)
    } else {
      const currentSelectedList = []
      selectedKeywords.forEach((keyword) => {
        currentSelectedList.push(keyword)
      })

      currentSelectedList.push(item)
      setCurrentSelected(currentSelectedList.splice(1))
    }

    selectedKeywords.push(item)

    setCurrentList(updatedList)
    setMarginTop(-49 * (selectedKeywords.length - 1))
    setMarginLeft(49 * (selectedKeywords.length - 1))
  }

  const handleSubmit = () => {
    const addedKeywords = addKeywords(currentSelected)
    if (!addedKeywords) return

    formData.push(addedKeywords)

    setCurrentSelected([])
    setFinalSelectedValue('')

    onChange(formData)
  }

  // When a previous element is selected, this function updates the current list.
  const handlePrevious = (item) => {
    let index = selectedKeywords.indexOf(item)
    if (index === 0) {
      index = 1
    }

    const tempItem = selectedKeywords[index - 1]
    selectedKeywords.splice(index - 1)
    handleSelectParent(tempItem)
    setSelectedKeywords(selectedKeywords)
    setFinalSelectedValue(false)
  }

  // Removes a selected keywords from formData.
  const handleRemove = (index) => {
    formData.splice(index, 1)
    onChange(formData)
  }

  // When a item from the search Typeahead is selected, this will capture that selection and add it
  // formData.
  const handleSearch = (text) => {
    const split = text.toString().split('>')
    const filter = fullPath.filter((path) => path.indexOf(split[split.length - 1]) !== -1)
    const filterArr = filter[0].toString().split('>').slice(1)
    const addedKeywords = addKeywords(filterArr)

    if (addedKeywords) {
      formData.push(addedKeywords)
    }

    onChange(formData)
    typeaheadRef.current.clear()
  }

  const displayItems = (item) => {
    const fullSelectedPath = getFullSelectedPath(item)
    const isLeafNode = isLeaf(fullSelectedPath)
    const isSelected = item === finalSelectedValue

    const parentAccessibleEventProps = useAccessibleEvent(() => {
      handleSelectParent(item)
    })

    const childrenAccessibleEventProps = useAccessibleEvent(() => {
      handleSelectChildren(item)
    })

    if (!selectableParents) {
      if (isLeafNode) {
        if (isSelected) {
          return (
            // Renders a child element that is selected
            <span
              aria-label={item}
              className="final-option-selected"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...childrenAccessibleEventProps}
            >
              {' '}
              {item}
            </span>
          )
        }

        return (
          // Renders a child element that is not selected
          <span
            aria-label={item}
            className="final-option"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...childrenAccessibleEventProps}
          >
            {item}
          </span>
        )
      }

      return (
        // Renders a parent element
        <span
          className="item.parent"
          aria-label={item}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...parentAccessibleEventProps}
        >
          {item}
        </span>
      )
    }

    // Checkbox for picking this item -- identical for a leaf and a parent, so a parent is
    // just as directly selectable instead of only reachable by navigating. Checking it again
    // clears the pick (see handleSelectChildren).
    const selectOption = (
      <label className={isSelected ? 'final-option-selected' : 'final-option'}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => handleSelectChildren(item)}
        />
        {item}
      </label>
    )

    if (isLeafNode) {
      return selectOption
    }

    return (
      // A parent gets the same select option a leaf does, plus a separate control for
      // navigating into its children -- its arrow comes from the :after styling a plain span
      // already gets in eui/_nested-item-picker.scss, no new icon needed.
      <span className="keyword-picker__item">
        {selectOption}
        <span
          aria-label={`View ${item}`}
          className="keyword-picker__navigate"
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...parentAccessibleEventProps}
        />
      </span>
    )
  }

  const displayPrevious = (item) => {
    const previousAccessibleEventProps = useAccessibleEvent(() => {
      handlePrevious(item)
    })

    return (
      <li key={item}>
        <span
          aria-label={item}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...previousAccessibleEventProps}
        >
          {item}
        </span>
      </li>
    )
  }

  return (
    <div className="keyword-picker">
      {
        title && (
          <div className="mb-3 h4">
            <span>
              {title}
              {
                required ? (
                  <i
                    aria-label="Required"
                    className="eui-icon eui-required-o text-success ps-2"
                    role="img"
                  />
                ) : ''
              }
            </span>
          </div>
        )
      }

      {
        description && (
          <div className="mb-4">
            <span className="description-box">
              {description}
            </span>
          </div>
        )
      }

      {
        loading && currentList && (
          <div className="w-100">
            <span className="d-block">
              <LoadingBanner />
            </span>
          </div>
        )
      }
      {
        !loading && (
          <>
            {
              includeRecommendedKeywords && (
                <KeywordRecommendations formData={formData} onChange={onChange} />
              )
            }

            {/* Renders the list of added keywords with a remove button */}
            {
              !includeRecommendedKeywords && (
                <div className="p-3 mb-2 keyword-picker__added-keywords">
                  {
                    Object.values(removeEmpty(formData)).map((item, index) => (
                      <li key={JSON.stringify(Object.values(item))}>
                        {Object.values(item).join(' > ')}

                        <Button
                          onClick={() => handleRemove(index)}
                          variant="link"
                        >
                          <i
                            aria-label="Remove"
                            className="fa fa-times-circle remove-button text-red ps-1"
                            role="img"
                          />
                        </Button>
                      </li>
                    ))
                  }
                </div>
              )
            }

            <div className="eui-nested-item-picker" style={{ marginLeft }}>
              <ul className="eui-item-path">
                {
                  selectedKeywords.map((item) => (
                    displayPrevious(item)
                  ))
                }
              </ul>

              {/* Renders the search field */}
              <div className="eui-item-list-pane" style={{ marginTop }}>
                <div className="keyword-picker__search-keywords">
                  <Typeahead
                    ref={typeaheadRef}
                    clearButton
                    id="keyword-picker-search"
                    isLoading={loading}
                    onChange={handleSearch}
                    options={searchResult}
                    placeholder="Search for Keywords..."
                  />
                </div>

                {/* Renders the items */}
                <ul>
                  {
                    currentList.map((item) => (
                      <li key={item}>{displayItems(item)}</li>
                    ))
                  }
                </ul>
              </div>
            </div>

            <Button
              className="mt-2"
              onClick={handleSubmit}
              aria-label="add"
            >
              <i className="fa-solid fa-circle-plus fa-sm" />
              {' '}
              {addButtonLabel}
            </Button>
          </>
        )
      }
    </div>
  )
}

KeywordPicker.defaultProps = {
  formData: []
}

KeywordPicker.propTypes = {
  formData: PropTypes.arrayOf(
    PropTypes.shape({})
  ),
  uiSchema: PropTypes.shape({
    'ui:title': PropTypes.string,
    'ui:keyword_scheme': PropTypes.string,
    'ui:picker_title': PropTypes.string,
    'ui:filter': PropTypes.string,
    'ui:scheme_values': PropTypes.arrayOf(PropTypes.string),
    'ui:keyword_scheme_column_names': PropTypes.arrayOf(PropTypes.string),
    'ui:includeRecommendedKeywords': PropTypes.bool,
    'ui:add_button_label': PropTypes.string,
    'ui:selectable_parents': PropTypes.bool
  }).isRequired,
  schema: PropTypes.shape({
    description: PropTypes.string.isRequired
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool.isRequired
}

export default KeywordPicker
