/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { kebabCase } from 'lodash'
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
      editor.setFocusField(null)
      editor.setFocusField(currentSelect)
    }
    if (currentSelect) {
      this.setState({ currentSelect: null })
    }
  }
  isRequired(error:FormError):boolean {
    if (error.name === 'required') {
      return true
    }
    if (error.name === 'minItems') {
      const { params } = error
      const { limit } = params
      if (limit === 1) {
        return true
      }
    }
    return false
  }
  progressCircle(error: FormError): React.ReactNode {
    const icon = `eui-icon eui-fa-circle-o icon-red ${this.isRequired(error) ? 'eui-required-o' : ''}`
    return (
      <i style={{ height: 12, fontSize: 14, width: 14 }} className={`${icon}`} />
    )
  }
  navigateToField(fieldName: string) {
    const { editor } = this.props
    if (/^[[a-zA-Z]+$/.test(fieldName)) { // Basic Field}
      editor.setFocusField(fieldName)
    } else if (/[0-9]/.test(fieldName)) { // Array case
      const regexp = /^[^[]+\[(\d+)\].*/
      const index = fieldName.match(regexp)
      editor.setArrayField(parseInt(index[1], 10))
    } else { // Controlled Field
      const array = fieldName.split('.')
      editor.setFocusField(array.at(0))
    }
  }

  render() {
    const { editor, section } = this.props
    const { fullErrors } = editor
    const errors: FormError[] = fullErrors
    const filteredErrors: FormError[] = errors.filter((error: FormError) => section.properties.some((propertyPrefix) => error.property.startsWith(`.${propertyPrefix}`)))
    return filteredErrors.map((error: FormError) => (
      <div className="error-list" data-testid={`errorlist__${kebabCase(error.stack)}`} key={JSON.stringify(error)} style={{ marginLeft: 18, wordWrap: 'break-word', color: 'red' }}>
        {this.progressCircle(error)}
        &nbsp;
        <span className="errorListItem" data-testid={`error-list__${error.property.substring(1)}`} onClick={() => { this.navigateToField(error.property.substring(1)); this.setState({ currentSelect: error.property.substring(1) }) }}>
          {error.stack.substring(1)}
        </span>
      </div>
    ))
  }
}
export default withRouter(observer(ErrorList))
