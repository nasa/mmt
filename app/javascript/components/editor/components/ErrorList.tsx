/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { observer } from 'mobx-react'
import React from 'react'
import { cloneDeep, kebabCase } from 'lodash'
import MetadataEditor from '../MetadataEditor'
import withRouter from './withRouter'
import './ErrorList.scoped.css'
import { prefixProperty, removeEmpty } from '../utils/json_utils'

type ErrorListProps = {
  editor: MetadataEditor;
  section: FormSection
};

class ErrorList extends React.Component<ErrorListProps> {
  // Given the full path, e.g. ContactGroups[1].ContactInformation.ContactMechanisms, it will return the total
  // number of elements of the last element in the path (in this example, of ContactMechanisms)
  // This algorithm dives into the formData until it gets the last element and then grabs the count.
  getArrayCount(path: string): number {
    const parts = path.split('.')
    const { editor } = this.props
    const { formData } = editor
    let data: any = removeEmpty(cloneDeep(formData))
    let length = -1
    parts.forEach((part: string, index) => {
      if (part !== '') {
        part = part.replace('.', '')
        const regexp = /^(.*[^\\[]+)\[(\d+)\]/
        const match = part.match(regexp)
        if (match) {
          data = data[match[1]].at(match[2])
        } else {
          data = data[part]
        }
        if (index === parts.length - 1) { // this is the last element in the path
          length = data.length
        }
      }
    })
    return length
  }
  countCapitalsTogether(word: string) {
    let count = 0
    for (let i = 0; i < word.length; i += 1) {
      let previousLetter = ' '
      if (i >= 1) {
        previousLetter = word.charAt(i - 1)
      }
      const letter = word.charAt(i)
      if (previousLetter.match(/[A-Z]/) && letter.match(/[A-Z]/)) {
        count += 1
      }
    }
    return count
  }
  countCapitals(word: string) {
    let count = 0
    for (let i = 0; i < word.length; i += 1) {
      let previousLetter = ' '
      if (i >= 1) {
        previousLetter = word.charAt(i - 1)
      }
      const letter = word.charAt(i)
      if (!previousLetter.match(/[A-Z]/) && letter.match(/[A-Z]/)) {
        count += 1
      }
    }
    return count
  }

  displayErrors(error: string) {
    const str = error
    let result = []
    if (str.match(/\[[0-9]]/)) {
      result = str.split(/\[[0-9]]/)
      error = result.at(0) + result.at(1)
    }
    const words = error.split(' ')
    words.forEach((word: string) => {
      if (this.countCapitals(word) >= 2 && this.countCapitalsTogether(word) === 0) {
        const newWord = word.replace(/([A-Z])/g, ' $1')
        if (newWord !== word) {
          const re = new RegExp(word, 'g')
          error = error.replace(re, newWord)
        }
      }
    })
    if (error.startsWith(' ')) {
      error = error.slice(1)
    }
    error = error.replace(/' /g, '\'')
    return error.charAt(0).toUpperCase() + error.slice(1)
  }

  navigateToField(error: string) {
    const { editor } = this.props

    if (error.startsWith('.')) {
      error = error.substring(1)
    }

    editor.setFocusField(error.replace(/\./g, '_'))
  }
  displayArrayIndex(error: string, length: number) {
    const getError = /([A-Z])\w+/
    const getIndex = /^[^[]+\[(\d+)\].*/
    const title = error.match(getError)
    const index = error.match(getIndex)
    let filter = this.displayErrors(title.at(0))
    if (filter.endsWith('s')) {
      filter = filter.slice(0, filter.length - 1)
    }

    return (
      <>
        <span>
          {filter}
          &nbsp;
        </span>
        {/* Converts the string to an interger and adds 1 to the value */}
        <span>
          {index !== null ? (
            <span className="error-list-total-number-of-arrays">
              {`(${parseInt(index.at(1), 10) + 1} of ${length})`}
            </span>
          ) : ''}
        </span>
      </>
    )
  }

  // Takes a map of the error list (see below), will walk the tree and produce
  // JSX markup of how the hierarchy should look.
  // You should pass in '' for path, but as it recursively walks the tree, it will
  // build the path for each level in the tree.   Key represents the name of the node,
  // e.g., ContractGroups and the attributes of the node are considered the children.
  walkErrorMap([path, key, node], rows) {
    if (node === null) {
      return
    }
    const { errorProperty = '', path: fullPath = '', message = '' } = node
    delete node.errorProperty
    delete node.path
    delete node.message
    const keys = Object.keys(node)
    const r = []
    keys.forEach((key: string) => {
      this.walkErrorMap([`${path}/${key}`, key, node[key]], r)
    })

    let length = -1
    const regexp = /^(.*[^\\[]+)\[(\d+)\]/
    const match = fullPath.match(regexp)
    if (match) {
      length = this.getArrayCount(match[1])
    }

    if (keys.length > 0) {
      rows.push(
        <div className="error-list" data-testid={`error-list-title__${kebabCase(key)}`} style={{ marginTop: '0px', marginBottom: '3px' }} key={key}>
          {key !== 'root' ? (
            <h6
              style={{
                fontWeight: 'bold', fontSize: '15px', color: 'rgb(73,80,87)', marginBottom: '0px'
              }}
            >
              {length > 0 ? this.displayArrayIndex(key, length) : this.displayErrors(key)}
            </h6>
          ) : <span style={{ marginTop: '-50px' }} />}
          <ul style={{ paddingLeft: 15, marginBottom: '-2px' }}>
            {r}
          </ul>
        </div>
      )
    } else {
      rows.push(
        <div className="error-list-item" onClick={() => { this.navigateToField(errorProperty) }} key={key} data-testid={`error-list-item__${kebabCase(key)}`}>
          {key !== 'root' ? (
            <li>
              <i className="eui-icon eui-icon--sm eui-fa-times-circle red-progress-circle" />
              {this.displayErrors(message)}
            </li>
          ) : <span style={{ marginTop: '-50px' }} />}
        </div>
      )
    }
  }
  createPath(property: string) {
    property = property.replace(/\.(\d)/, '[$1')
    property = property.replace(/(\d)\./, '$1].')
    return property
  }
  // Builds a map object representing the hierarchy of the errors, i.e.
  // ContactGroups[1].ContactInformation.ContactMechanisms[1].Type is a Required Property
  // ContactGroups[1].ContactInformation.ContactMechanisms[1].Value is a Required Property
  // would build a map like this:
  // { "ContactGroups[1]" : { "ContactInformation" : { "ContactMechanisms[1]": { "Type is a Required Property": { errorProperty: "{full path of the error}"}, "Value is a Required Property" }}}}
  buildErrorMap(errors: FormError[]): unknown {
    const root = {}
    const { editor } = this.props
    const { currentSection } = editor
    const { displayName } = currentSection
    errors.forEach((error) => {
      const path = this.createPath(error.property)
      const parts = path.split('.')

      let node = root
      let fullPath = ''
      parts.forEach((part: string, index: number) => {
        fullPath += part
        if (part !== '') {
          const name = displayName.replace(/ /g, '')
          if (!(part === name && index === 1)) {
            let value = node[part]
            if (!value) {
              value = { message: error.message, path, errorProperty: error.property }
            }
            node[part] = value
            node = value
          }
        }
        fullPath += '.'
      })
    })
    return root
  }

  render() {
    const { editor, section } = this.props
    const { fullErrors } = editor
    const errors: FormError[] = fullErrors
    const filteredErrors: FormError[] = errors.filter((error: FormError) => section.properties.some((propertyPrefix) => prefixProperty(error.property).startsWith(prefixProperty(propertyPrefix))))

    const root = {}
    filteredErrors.forEach((error) => {
      const parts = error.stack.split('.')
      let node = root
      parts.forEach((part: string) => {
        if (part !== '') {
          let value = node[part]
          if (!value) {
            value = {}
          }
          node[part] = value
          node = value
        }
      })
    })
    const errorMap = this.buildErrorMap(filteredErrors)
    const treeMarkup = []
    this.walkErrorMap(['', 'root', errorMap], treeMarkup)
    return (
      <div>
        {treeMarkup}
      </div>
    )
  }
}
export default withRouter(observer(ErrorList))
