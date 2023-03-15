import React from 'react'
import { observer } from 'mobx-react'
import { ListGroup } from 'react-bootstrap'
import { kebabCase } from 'lodash'
import { toJS } from 'mobx'
import MetadataEditor from '../MetadataEditor'
import ErrorList from './ErrorList'
import './NavigationItem.css'
import { prefixProperty, removeEmpty } from '../utils/json_utils'
import withRouter from './withRouter'

type NavigationItemProps = {
  editor: MetadataEditor,
  section: FormSection,
  router: RouterType
}
type NavigationViewState = {
  hasFocus: boolean,
  previousSection: string

}
class NavigationItem extends React.Component<NavigationItemProps, NavigationViewState> {
  constructor(props: NavigationItemProps) {
    super(props)
    this.state = {
      hasFocus: false,
      previousSection: ''
    }
  }
  componentDidUpdate(): void {
    const { editor } = this.props
    const { previousSection } = this.state
    if (editor.currentSection.displayName !== previousSection) {
      this.setState({ previousSection: toJS(editor.currentSection.displayName) })
    }
  }

  setFocus(focus: boolean) {
    this.setState({ hasFocus: focus })
  }

  circleType(section: FormSection): string {
    const { editor } = this.props
    const { previousSection } = this.state
    const { fullData, fullErrors } = editor
    const draft = removeEmpty(JSON.parse(JSON.stringify(fullData)))
    const hasValues = section.properties.some((propertyPrefix) => {
      const value = draft[propertyPrefix]
      return value !== undefined
    })
    if (!hasValues) {
      return 'eui-fa-circle-o gray-progress-circle'
    }
    const hasError = fullErrors.some((error: FormError) => {
      const { property } = error
      return section.properties.some((propertyPrefix) => prefixProperty(property).startsWith(`${prefixProperty(propertyPrefix)}`))
    })
    if (hasError) {
      if (section.displayName !== previousSection) {
        return 'eui-fa-times-circle red-progress-circle'
      }
      return 'eui-fa-circle-o red-progress-circle'
    }
    return 'eui-check green-progress-circle'
  }

  progressCircle(section: FormSection): React.ReactNode {
    const icon = `eui-icon eui-icon--sm ${this.circleType(section)}`
    return (
      <i className={`${icon}`} />
    )
  }

  render() {
    const { editor, section, router } = this.props
    const { navigate, params } = router
    const { id } = params
    const { hasFocus } = this.state
    const styles = {
      backgroundColor: hasFocus ? '#f5f5f5' : 'rgb(235,242,246)',
      fontSize: 16,
      border: 'none',
      margin: 0,
      padding: 0,
      width: '330px'
    }
    return (
      <div
        data-testid={`navigationitem--${kebabCase(section.displayName)}`}
        style={styles}
        key={section.displayName}
      >
        <ListGroup.Item
          data-testid={`navigationitem--listgroup.item__${kebabCase(section.displayName)}`}
          style={styles}
          action
          onMouseOver={() => {
            this.setFocus(true)
          }}
          onMouseOut={() => {
            this.setFocus(false)
          }}
          key={section.displayName}
          onClick={() => {
            editor.setFocusField('')
            editor.setArrayAutoScroll(null)
            editor.navigateTo(section)
            navigate(`/${editor.documentType}/${id}/edit/${section.displayName.replace(/\s/g, '_')}`, { replace: false })
          }}
        >
          <span style={{
            fontWeight: section.displayName === editor.currentSection.displayName ? 'bold' : null,
            fontSize: section.displayName === editor.currentSection.displayName ? 17 : null
          }}
          >
            {this.progressCircle(section)}
            {' '}
            {section.displayName}
          </span>
        </ListGroup.Item>
        {section.displayName === editor.currentSection.displayName
          && <ErrorList section={section} editor={editor} />}
      </div>
    )
  }
}
export default withRouter(observer(NavigationItem))
export { NavigationItem as PureNavigationItem }
