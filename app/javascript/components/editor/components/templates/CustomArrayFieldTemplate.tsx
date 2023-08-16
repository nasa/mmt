/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrayFieldTemplateProps } from '@rjsf/utils'
import _, { kebabCase } from 'lodash'
import { observer } from 'mobx-react'
import React, { MouseEventHandler, ReactNode } from 'react'
import { Row, Col } from 'react-bootstrap'
import './CustomArrayFieldTemplate.css'

type Element = {
  index: number,
  key: string,
  children: ReactNode,
  className: string,
  onDropIndexClick: (index: number) => MouseEventHandler<HTMLButtonElement>
}

interface CustomArrayTemplateProps extends ArrayFieldTemplateProps {
  items: any[]
  canAdd: boolean
  onAddClick: (event: object) => void
  title: string
  uiSchema: any
}

class CustomArrayFieldTemplate extends React.Component<CustomArrayTemplateProps, never> {
  private scrollRef: Array<React.RefObject<HTMLDivElement>>
  private titleScrollRef: React.RefObject<HTMLDivElement>
  constructor(props: CustomArrayTemplateProps) {
    super(props)
    const {
      items
    } = this.props
    this.scrollRef = []
    items.forEach(() => {
      this.scrollRef.push(React.createRef())
    })
    this.titleScrollRef = React.createRef()
  }

  createTitle() {
    const { uiSchema } = this.props
    let { title } = this.props
    const uiTitle = uiSchema['ui:title']
    if (uiTitle) {
      title = uiTitle
      return title
    }
    let itemTitle = _.startCase(title)
    if (uiSchema.items) {
      itemTitle = uiSchema.items['ui:title'] ?? itemTitle
    }
    return itemTitle
  }

  headerWithRemove(element: Element, index: number, items: any) {
    const itemTitle = this.createTitle()
    return (
      <div className="custom-array-template-remove-btn">
        <div className="remove-header">
          <div className="h3-title">
            <span>
              {this.parseTitle(itemTitle)}
            </span>
            <span>
              {items.length > 0 && ` (${index + 1} of ${items.length})`}
            </span>
          </div>
          <button
            data-testid={`custom-array-template__remove-button--${kebabCase(itemTitle)}`}
            className="btn"
            onClick={element.onDropIndexClick(element.index)}
            type="button"
          >
            <span className="remove-button">
              <i className="fa-solid fa-circle-minus fa-lg" />
            </span>
            {' '}
            <span className="remove-label">
              {' '}
              Remove
            </span>
          </button>
        </div>
      </div>
    )
  }

  headerWithAdd(items: any) {
    const { registry, onAddClick } = this.props
    const { formContext } = registry
    const { editor } = formContext
    const itemTitle = this.createTitle()
    return (
      <div className="custom-array-template-add-btn add-header">
        <button
          data-testid={`custom-array-template__add-button--${kebabCase(itemTitle)}`}
          className="btn"
          type="button"
          onClick={(e) => {
            onAddClick(e)
            editor.setArrayAutoScroll(items.length)
            setTimeout(() => {
              editor.setArrayAutoScroll(-1)
            }, 400)
          }}
        >
          <span className="add-button">
            <i className="fa-solid fa-circle-plus fa-lg" />
          </span>
          {' '}
          <span className="add-label">
            {items.length === 0 ? (
              <span data-testid="custom-array-template-add-btn">Add</span>
            ) : <span data-testid="custom-array-template-add-another-btn">Add another</span>}
            {' '}
            {this.parseTitle(itemTitle)}
          </span>
        </button>
      </div>
    )
  }

  parseTitle(title: string) {
    if (title == null) {
      return title
    }
    if (title.length > 1) {
      if (title.charAt(title.length - 1) === 's' && title.charAt(title.length - 2) !== 's') {
        title = title.slice(0, -1)
      }
    }
    return title
  }

  itemBody(element: Element) {
    return (
      <Row className="mb-2  d-flex align-items-center">
        <Col xs="12" lg="12" key={element.key} className={element.className} data-testid="custom-array-element">
          {element.children}
        </Col>
      </Row>
    )
  }
  render() {
    const {
      items, schema, uiSchema, registry, required, title
    } = this.props
    let { canAdd } = this.props
    const { formContext } = registry
    const { editor } = formContext
    const headerBoxClassName = uiSchema['ui:header-box-classname'] ? uiSchema['ui:header-box-classname'] : 'h2-box'
    const headerClassName = uiSchema['ui:header-classname'] ? uiSchema['ui:header-classname'] : 'h2-title'
    items.forEach(() => {
      this.scrollRef.push(React.createRef())
    })

    if (uiSchema['ui:canAdd'] === false) {
      canAdd = false
    }

    if (editor?.arrayFieldAutoScroll !== -1) {
      if (editor?.arrayFieldAutoScroll || editor.focusField === title) {
        setTimeout(() => {
          this.scrollRef[editor.arrayFieldAutoScroll]?.current?.scrollIntoView({ behavior: 'smooth' })
        }, 200)
      }
    }
    return (
      <div className="metadata-editor-array-field" data-testid="custom-array-template" ref={this.titleScrollRef}>
        <div className={headerBoxClassName}>
          <span className={headerClassName}>
            {this.createTitle()}
            {required ? <i className="eui-icon eui-required-o required-icon" /> : ''}
          </span>
        </div>
        <p className="description-box">
          {schema.description}
        </p>
        {items && <br />}

        {items && items.map((element: Element, index: number) => (
          <div
            key={element.key}
            className={`${element.className} element`}
            ref={this.scrollRef[index]}
          >
            {canAdd ? (
              this.headerWithRemove(element, index, items)
            ) : (null)}
            <div className="custom-array-template-element" />
            {this.itemBody(element)}
          </div>
        ))}
        {canAdd ? (
          this.headerWithAdd(items)
        ) : null}
      </div>
    )
  }
}
export default observer(CustomArrayFieldTemplate)
