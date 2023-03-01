/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { observer } from 'mobx-react'
import React from 'react'
import MetadataEditor from '../MetadataEditor'
import withRouter from './withRouter'
import './ErrorList.scoped.css'

type ErrorListProps = {
  editor: MetadataEditor;
  section: FormSection
};

type ErrorListState = {
  currentSelect: string
};

class ErrorList extends React.Component<ErrorListProps, ErrorListState> {
  constructor(props: ErrorListProps) {
    super(props)
    this.state = {
      currentSelect: ''
    }
  }
  componentDidUpdate(prevProps: Readonly<ErrorListProps>, prevState: Readonly<ErrorListState>) {
    const { currentSelect } = this.state
    const { editor } = this.props

    if (prevState.currentSelect === currentSelect || editor.focusField === currentSelect) {
      editor.setFocusField('')
      // editor.setArrayField(-1)
      editor.setFocusField(currentSelect)
    }
    if (currentSelect) {
      this.setState({ currentSelect: '' })
    }
  }

  // Given the full path, e.g. ContactGroups[1].ContactInformation.ContactMechanisms, it will return the total
  // number of elements of the last element in the path (in this example, of ContactMechanisms)
  // This algorithm dives into the formData until it gets the last element and then grabs the count.
  getArrayCount(path: string): number {
    const parts = path.split('.')
    const { editor } = this.props
    const { formData } = editor
    let data: any = formData
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
    // console.log('error', error)

    if (str.match(/\[[0-9]]/)) {
      result = str.split(/\[[0-9]]/)
      console.log(result)
      error = result.at(0) + result.at(1)
      // return result
    }
    const words = error.split(' ')
    words.forEach((word: string) => {
      if (this.countCapitals(word) >= 2 && this.countCapitalsTogether(word) === 0) {
        // console.log('word', word)
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
    return error
  }

  navigateToField(fieldName: string) {
    const { editor } = this.props
    const errorName = fieldName.split(' ')
    if (/^[[a-zA-Z]+$/.test(errorName[0])) { // Basic Field}
      editor.setFocusField(errorName[0])
    } else if (/[0-9]/.test(fieldName)) { // Array case
      const regexp = /^[^[]+\[(\d+)\].*/
      const index = fieldName.match(regexp)
      editor.setArrayField(parseInt(index[1], 10))
    } else { // Controlled Field
      const array = fieldName.split('.')
      editor.setFocusField(array.at(0))
    }
  }
  displayArrayIndex(error: string, length: number) {
    const getError = /([A-Z])\w+/
    const getIndex = /^[^[]+\[(\d+)\].*/
    const title = error.match(getError)
    const index = error.match(getIndex)
    const filter = this.displayErrors(title.at(0))
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

  // Given the full path, e.g. ContactGroups[1].ContactInformation.ContactMechanisms[1], it will return the total
  // number of elements of the last element in the path (in this example, of ContactMechanisms)
  // This algorithm evaluates the expression and returns the result.

  // Takes a map of the error list (see below), will walk the tree and produce
  // JSX markup of how the hierarchy should look.
  // You should pass in '' for path, but as it recursively walks the tree, it will
  // build the path for each level in the tree.   Key represents the name of the node,
  // e.g., ContractGroups and the attributes of the node are considered the children.
  walkErrorMap([path, key, node], rows) {
    if (node === null) {
      return
    }
    const { errorProperty = '' } = node
    delete node.errorProperty
    const keys = Object.keys(node)
    const r = []
    keys.forEach((key: string) => {
      this.walkErrorMap([`${path}/${key}`, key, node[key]], r)
    })

    let length = -1
    const regexp = /^(.*[^\\[]+)\[(\d+)\]/
    const match = errorProperty.match(regexp)
    if (match) {
      length = this.getArrayCount(match[1])
    }
    if (keys.length > 0) {
      rows.push(
        <div className="error-list" data-testid={`error-list-title__${key}`} style={{ marginTop: '0px', marginBottom: '3px' }} key={key}>
          {key !== 'root' ? (
            <h6
              style={{
                fontWeight: 'bold', fontSize: '15px', color: 'rgb(73,80,87)', marginBottom: '0px', marginLeft: '19px'
              }}
            >
              {length > 0 ? this.displayArrayIndex(key, length) : key}
            </h6>
          ) : <span style={{ marginTop: '-50px' }} />}
          <ul style={{ marginBottom: '-2px' }}>
            {r}
          </ul>
        </div>
      )
    } else {
      rows.push(
        <div className="error-list-item" onClick={() => { this.navigateToField(errorProperty.substring(1)); this.setState({ currentSelect: errorProperty.substring(1) }) }} key={key} data-testid={`error-list-item__${key}`}>
          {key !== 'root' ? (
            <li
              style={{
                fontSize: '15px',
                margin: 0,
                padding: 0
              }}
            >
              <i className="eui-icon eui-icon--sm eui-fa-times-circle red-progress-circle" />
              &nbsp;
              {this.displayErrors(key)}
            </li>
          ) : <span style={{ marginTop: '-50px' }} />}
        </div>
      )
    }
  }

  // Builds a map object representing the hierarchy of the errors, i.e.
  // ContactGroups[1].ContactInformation.ContactMechanisms[1].Type is a Required Property
  // ContactGroups[1].ContactInformation.ContactMechanisms[1].Value is a Required Property
  // would build a map like this:
  // { "ContactGroups[1]" : { "ContactInformation" : { "ContactMechanisms[1]": { "Type is a Required Property": { errorProperty: "{full path of the error}"}, "Value is a Required Property" }}}}
  buildErrorMap(errors: FormError[]): unknown {
    const root = {}
    errors.forEach((error) => {
      const parts = error.stack.split('.')
      let node = root
      let fullPath = ''
      parts.forEach((part: string) => {
        fullPath += part
        if (part !== '') {
          let value = node[part]
          if (!value) {
            value = { errorProperty: fullPath }
          }
          node[part] = value
          node = value
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
    const filteredErrors: FormError[] = errors.filter((error: FormError) => section.properties.some((propertyPrefix) => error.property.startsWith(`.${propertyPrefix}`)))

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
