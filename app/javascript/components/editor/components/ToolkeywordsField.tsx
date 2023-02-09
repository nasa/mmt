/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import _, { cloneDeep, isArray, kebabCase } from 'lodash'
import { Button } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import './ToolKeywordsField.css'
import { MetadataService } from '../services/MetadataService'
import { buildMap, parseCmrResponse } from '../utils/cmr_keywords'

type ToolKeywordsFieldProps = {
  formData: any,
  onChange: (value: string,) => void,
  schema: {
    description: string
  },
  uiSchema: any
}

type ToolKeywordsFieldState = {
  lastUpdated: Date,
  value: any,
  selectedKeywords: any,
  currentList: any,
  marginTop: number,
  marginLeft: number,
  disableAddKeywordBtn: boolean,
  finalSelectedKeywords: any,
  finalSelectedValue: string,
  paths: Array<string>,
  showSearchDropdown: boolean,
  fullPath: Array<string>
}

export default class ToolKeywordsField extends React.Component<ToolKeywordsFieldProps, ToolKeywordsFieldState> {
  constructor(props: ToolKeywordsFieldProps) {
    super(props)
    this.state = {
      lastUpdated: new Date(),
      value: props.formData,
      selectedKeywords: [],
      currentList: [],
      marginTop: 10,
      marginLeft: 0,
      disableAddKeywordBtn: true,
      finalSelectedKeywords: [],
      finalSelectedValue: '',
      paths: [],
      fullPath: [],
      showSearchDropdown: false
    }
  }

  componentDidMount() {
    const { uiSchema } = this.props
    const keywords = uiSchema['ui:keywords']
    if (keywords) {
      this.initializeKeywords([keywords])
    } else {
      const service = uiSchema['ui:service'] as MetadataService
      const keywordScheme = uiSchema['ui:keyword_scheme']
      service.fetchCmrKeywords(keywordScheme).then((keywords) => {
        this.initializeKeywords([keywords])
      })
        .catch((error) => {
          console.log('error=', error)
        })
    }
  }

  initializeKeywords(keywords: any) {
    const { formData } = this.props
    const currMap = {}
    const paths: Array<string> = []

    const newKeyword = [{ root: [{ value: 'Tool Keyword', subfields: ['category'], ...keywords[0] }] }]

    this.traverse(newKeyword[0].root[0], currMap)

    const selectedKeywords = [currMap]
    const values = Object.values(currMap)
    const firstvalue = Object.values(values)[0]
    const currList: Array<object> = [Object.values(firstvalue)[0]]

    this.inOrder(Object.values(currMap), paths, [])
    const fullPath: Array<string> = []
    this.inOrder(currMap, fullPath, [])
    this.setState({
      lastUpdated: new Date(),
      value: formData,
      selectedKeywords,
      currentList: currList,
      marginTop: 10,
      marginLeft: 0,
      disableAddKeywordBtn: true,
      finalSelectedKeywords: [],
      finalSelectedValue: '',
      paths,
      fullPath,
      showSearchDropdown: false
    })
  }

  inOrder(node: any, paths: any, path: string[]) {
    const key = Object.keys(node)[0]
    const values = node[key]

    if (typeof node === 'string') {
      const tag = node
      path.push(tag)
      paths.push(path.join(' > '))
    }
    if (isArray(values)) {
      const tag = key
      path.push(tag)
      values.forEach((child: string) => {
        this.inOrder(child, paths, _.cloneDeep(path))
      })
    }
  }

  traverse(node: any, map: any) {
    if (node.subfields) {
      const array: Array<object> = []
      const obj = map
      obj[node.value] = array
      node.subfields.forEach((subfield: any) => {
        const children = node[subfield]
        children.forEach((child: any) => {
          if (child.subfields) {
            const m: any = {}
            m[child.value] = []
            array.push(m)
            this.traverse(child, m)
          } else {
            array.push(child.value)
          }
        })
      })
    }
  }

  selectPrevious(item: object) {
    const { selectedKeywords, finalSelectedKeywords } = this.state
    let index = selectedKeywords.indexOf(item)
    if (index === 0) {
      index = 1
    }
    const tempItem = selectedKeywords[index - 1]
    selectedKeywords.splice(index - 1)
    if (index === 2) {
      this.setState({ marginTop: 10, marginLeft: 0 })
    } else if (index === 3) {
      this.setState({ marginTop: -30, marginLeft: 30 })
    } else {
      this.setState({ marginTop: 50, marginLeft: -40 })
    }
    this.setState({ selectedKeywords, finalSelectedKeywords, showSearchDropdown: false }, () => { this.selectItem(tempItem) })
  }

  selectItem(item: any) {
    const {
      currentList, selectedKeywords, marginTop, marginLeft, paths
    } = this.state
    this.setState({ paths: paths.splice(0, paths.length) })
    this.inOrder(Object.values(item), paths, [])
    // here
    const key = Object.keys(item)[0]
    const values = item[key]
    if (isArray(values)) {
      currentList.splice(0, currentList.length)
      values.forEach((item: object) => {
        currentList.push(item)
      })
      selectedKeywords.push(item)
      this.setState({
        currentList, selectedKeywords, marginTop: marginTop - 40, marginLeft: marginLeft + 35, finalSelectedValue: '', finalSelectedKeywords: [], disableAddKeywordBtn: true, paths
      })
    }
  }

  displayItems(item: object) {
    const { finalSelectedValue } = this.state
    if (typeof item === 'string') {
      if (item === finalSelectedValue) {
        return (
          <a
            className="final-option-selected"
            data-testid={`tool-keyword__final-option-selected--${kebabCase(item)}`}
            href="#"
            onClick={() => this.setState({ finalSelectedValue: '', finalSelectedKeywords: [], disableAddKeywordBtn: true })}
          >
            {' '}
            {item}
          </a>
        )
      }
      return (
        <a
          className="final-option"
          data-testid={`tool-keyword__final-option--${kebabCase(item)}`}
          href="#"
          onClick={() => this.createKeywordList(item)}
        >
          {' '}
          {Object.values(item)}
        </a>
      )
    }
    return (
      <a
        className="item.parent"
        data-testid={`tool-keyword__parent-item--${kebabCase(Object.keys(item).toString())}`}
        href="#"
        onClick={() => this.selectItem(item)}
      >
        {' '}
        {Object.keys(item)}
      </a>
    )
  }

  createKeywordList(item: string) {
    const { finalSelectedKeywords, selectedKeywords } = this.state
    selectedKeywords.map((value: string) => finalSelectedKeywords.push(Object.keys(value)))
    // push selected keywords to finalSelectedKeywords
    finalSelectedKeywords.push(item)
    this.setState({ finalSelectedValue: item, finalSelectedKeywords, disableAddKeywordBtn: false })
  }

  checkAddedKeywords(keyword: Array<string>) {
    const { formData } = this.props
    let found = false
    if (keyword.length > 4) {
      formData.forEach((item: string) => {
        if (Object.values(item)[3] === keyword[4]) {
          found = true
        }
      })
      return found
    }
    Object.values(formData).forEach((item: string) => {
      if (Object.values(item)[2] === keyword[3]) {
        found = true
      }
    })
    return found
  }

  searchKeywords(text: any) {
    const { value, fullPath } = this.state
    const split: string[] = text.toString().split(' > ')
    const { onChange } = this.props

    // fullPath state variable will have the complete list of all of the keyword variation
    // This is needed beacuse if the user searches inside a level, the paths state variable will only have values that level down.
    // Therefore, having a complete list of all keyword variation allows us to find the user seletect value and add it to formData
    const filter = fullPath.filter((path) => path.indexOf(split[split.length - 1]) !== -1)
    const filterArr: string[] = filter.toString().split(' > ')
    const found = this.checkAddedKeywords(filterArr)

    if (filterArr.length === 5 && !found) {
      value.push({
        ToolCategory: filterArr[1],
        ToolTopic: filterArr[2],
        ToolTerm: filterArr[3],
        ToolSpecificTerm: filterArr[4]
      })
    }
    if (filterArr.length === 4 && !found) {
      value.push({
        ToolCategory: filterArr[1],
        ToolTopic: filterArr[2],
        ToolTerm: filterArr[3]
      })
    }
    this.setState(value, () => onChange(value))
    this.setState({ showSearchDropdown: false })
  }

  render() {
    const {
      lastUpdated, selectedKeywords, currentList, marginTop, marginLeft, disableAddKeywordBtn, finalSelectedKeywords, paths, showSearchDropdown, value
    } = this.state
    const {
      formData,
      onChange,
      schema,
      uiSchema
    } = this.props
    const { description } = schema
    const title = uiSchema['ui:title']

    // checks if the Draft is empty, if yes then, removes the empty object
    if (JSON.stringify(formData[0]) === '{}') {
      formData.splice(0)
    }

    // strips off the 0 > in the fornt of
    const searchResult: Array<string> = []
    paths.forEach((value: string) => {
      const stripValue = value.replace('0 > ', '')
      searchResult.push(stripValue)
    })
    return (
      <div key={JSON.stringify(lastUpdated)}>
        <div style={{ fontSize: '1.10rem' }}>
          {title}
          <hr className="border-0 bg-secondary" style={{ height: '1px' }} />
          {description}
        </div>

        <div className="added-keywords" data-testid="added-tool-keywords" style={{ padding: '20px' }}>
          {
            Object.values(formData).map((item: object, index: number) => (
              <li key={Object.values(item).toString()}>
                {Object.values(item).join(' > ')}
                <a
                  href="#"
                  onClick={() => this.setState(value.splice(index, 1), () => onChange(value))}
                  data-testid={`tool-keyword__added-keyword--${index}`}
                >
                  <i className="fa fa-times-circle" style={{ padding: '5px', color: 'red' }} />
                </a>
              </li>
            ))

          }
        </div>
        <div className="eui-nested-item-picker" style={{ marginLeft, padding: '15px' }}>
          <ul className="eui-item-path">
            {
              selectedKeywords.map((item: object) => (
                <li key={Object.keys(item).toString()}>
                  <a
                    data-testid={`tool-keyword__select-previous--${kebabCase(Object.keys(item).toString())}`}
                    href="#"
                    onClick={() => this.selectPrevious(item)}
                  >
                    {Object.keys(item)}

                  </a>
                </li>
              ))
            }
          </ul>

          <div className="eui-item-list-pane" style={{ marginTop }}>
            <div data-testid="tool-keyword__search-keyword-field">
              <Typeahead
                id="search-keywords"
                placeholder="Search for keywords..."
                onChange={(text) => { this.searchKeywords(text) }}
                options={searchResult}
                clearButton
                onInputChange={(text) => {
                  if (text === '') {
                    this.setState({ showSearchDropdown: false })
                  } else {
                    this.setState({ showSearchDropdown: true })
                  }
                }}
                style={{ width: '399px', borderStyle: 'hidden' }}
                open={showSearchDropdown}
                onBlur={() => this.setState({ showSearchDropdown: false })}
              />
            </div>
            <ul>
              {
                currentList.map((item: object) => (
                  <li key={Object.values(item).toString()}>{this.displayItems(item)}</li>
                ))
              }

            </ul>
          </div>
        </div>
        <Button
          style={{ marginTop: '20px', marginLeft: '10px' }}
          className="eui-btn--blue add-science-keyword"
          data-testid="tool-keyword__add-keyword-btn"
          disabled={disableAddKeywordBtn}
          onClick={() => {
            const found = this.checkAddedKeywords(finalSelectedKeywords)
            if (finalSelectedKeywords.length > 4 && !found) {
              value.push({
                ToolCategory: finalSelectedKeywords[1][0],
                ToolTopic: finalSelectedKeywords[2][0],
                ToolTerm: finalSelectedKeywords[3][0],
                ToolSpecificTerm: finalSelectedKeywords[4]
              })
            }
            if (finalSelectedKeywords.length === 4 && !found) {
              value.push({
                ToolCategory: finalSelectedKeywords[1][0],
                ToolTopic: finalSelectedKeywords[2][0],
                ToolTerm: finalSelectedKeywords[3]
              })
            }
            this.setState(value, () => onChange(value))
            this.setState({ finalSelectedKeywords: [], finalSelectedValue: '', disableAddKeywordBtn: true })
          }}
        >
          Add Keyword
        </Button>
      </div>
    )
  }
}
