import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import { cloneDeep } from 'lodash'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import removeEmpty from '../../utils/removeEmpty'

import './KeywordPicker.scss'
import getPickerKeywords from '../../utils/getPickerKeywords'

const KeywordPicker = ({
  formData,
  schema,
  uiSchema = {},
  onChange,
  required
}) => {
  const headerClassName = uiSchema['ui:header-classname'] ? uiSchema['ui:header-classname'] : 'h3'

  const { description } = schema
  const title = uiSchema['ui:title']
  const schemeValues = uiSchema['ui:scheme_values']

  const [keywordList, setKeywordList] = useState([])
  const [currentList, setCurrentList] = useState([])
  const [selectedKeywords, setSelectedKeywords] = useState([])
  const [fullPath, setFullPath] = useState([])
  const [finalSelectedValue, setFinalSelectedValue] = useState(null)
  const [finalSelectedList, setFinalSelectedList] = useState([])
  const [disableButton, setDisableButton] = useState(true)
  const [value, setValue] = useState([])
  const [marginTop, setMarginTop] = useState(0)
  const [marginLeft, setMarginLeft] = useState(0)

  const filterKeywords = (path) => {
    const filteredPath = []
    const joinedPath = selectedKeywords.join('>')
    if (path.startsWith(joinedPath)) {
      const replace = path.replace(`${joinedPath}>`, '')
      filteredPath.push(replace)
    }

    return filteredPath
  }

  // Gets the parsed list of keywords from CMR.
  useEffect(() => {
    const cmrKeyword = async () => {
      setKeywordList(await getPickerKeywords(uiSchema))
    }

    cmrKeyword()
  }, [])

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

  const handleSelectChildren = (item) => {
    const finalList = []
    selectedKeywords.forEach((keyword) => {
      finalList.push(keyword)
    })

    finalList.push(item)
    setFinalSelectedValue(item)
    setDisableButton(false)
    setFinalSelectedList(finalList)
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

  // When a parent element is selected, this function updates the current list by showing then next level of children.
  const handleSelectParent = (item) => {
    const fullSelectedPath = getFullSelectedPath(item)
    let updatedList = []

    updatedList = getChildren(fullSelectedPath)
    selectedKeywords.push(item)
    setCurrentList(updatedList)
    setMarginTop(-49 * (selectedKeywords.length - 1))
    setMarginLeft(49 * (selectedKeywords.length - 1))
  }

  const handleSubmit = () => {
    const keywords = addKeywords(finalSelectedList.splice(1))
    if (keywords) {
      value.push(keywords)
    }

    setValue(value)
    setFinalSelectedList([])
    setFinalSelectedValue('')
    setDisableButton(true)
    onChange(value)
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
    setDisableButton(true)
  }

  // Removes a selected keywords from formData.
  const handleRemove = (index) => {
    setValue(value.splice(index, 1))
    onChange(value)
  }

  // When a item from the search Typeahead is selected, this will capture that selection and add it
  // formData.
  const handleSearch = (text) => {
    const split = text.toString().split('>')
    const filter = fullPath.filter((path) => path.indexOf(split[split.length - 1]) !== -1)
    const filterArr = filter[0].toString().split('>').slice(1)
    const keywords = addKeywords(filterArr)

    if (keywords) {
      value.push(keywords)
    }

    onChange(value)
  }

  const displayItems = (item) => {
    const fullSelectedPath = getFullSelectedPath(item)
    const isLeafNode = isLeaf(fullSelectedPath)

    if (isLeafNode) {
      if (item === finalSelectedValue) {
        return (
        // Renders a child element that is selected
          <span
            className="final-option-selected"
            key={item}
            type="button"
          >
            {' '}
            {item}
          </span>
        )
      }

      return (
      // Renders a child element that is not selected
        <span
          className="final-option"
          key={item}
          onClick={() => handleSelectChildren(item)}
          onKeyDown={() => handleSelectChildren(item)}
          role="button"
          tabIndex="0"
        >
          {item}
        </span>
      )
    }

    return (
      // Renders a parent element
      <span
        className="item.parent"
        key={item}
        role="button"
        tabIndex="0"
        onClick={() => handleSelectParent(item)}
        onKeyDown={() => handleSelectParent(item)}
      >
        {item}
      </span>
    )
  }

  return (
    <div className="keyword-picker">
      <div className="mb-3">
        <span className={headerClassName}>
          {title}
          {required ? <i className="eui-icon eui-required-o required-icon" /> : ''}
        </span>
      </div>
      <div className="mb-2">
        <span className="description-box">
          {description}
        </span>
      </div>

      {/* Renders the list of added keywords with a remove button */}
      <div className="p-3 mb-5 keyword-picker__added-keywords">
        {
          Object.values(removeEmpty(formData)).map((item, index) => (
            <li key={JSON.stringify(Object.values(item))}>
              {Object.values(item).join(' > ')}
              <Button
                variant="link"
                onClick={() => handleRemove(index)}
              >
                <i className="fa fa-times-circle remove-button" />
              </Button>
            </li>
          ))
        }
      </div>

      <div className="eui-nested-item-picker" style={{ marginLeft }}>
        <ul className="eui-item-path">
          {
            selectedKeywords.map((item) => (
              <li key={item}>
                <span
                  onClick={() => { handlePrevious(item) }}
                  onKeyDown={() => { handlePrevious(item) }}
                  role="button"
                  tabIndex="0"
                >
                  {item}
                </span>
              </li>
            ))
          }
        </ul>
        {/* Renders the search field */}
        <div className="eui-item-list-pane" style={{ marginTop }}>
          <div className="keyword-picker__search-keywords">
            <Typeahead
              id="keyword-picker-search"
              placeholder="Search for Keywords..."
              options={searchResult}
              clearButton
              onChange={(e) => { handleSearch(e) }}
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
        disabled={disableButton}
        onClick={() => handleSubmit()}
      >
        <i className="fa-solid fa-circle-plus fa-sm" />
        {' '}
        Add Keyword
      </Button>
    </div>
  )
}

KeywordPicker.propTypes = {
  formData: PropTypes.shape([]).isRequired,
  uiSchema: PropTypes.shape({}).isRequired,
  schema: PropTypes.shape({
    description: PropTypes.string.isRequired
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool.isRequired
}

export default KeywordPicker
