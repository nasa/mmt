/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/static-property-placement */
/* eslint-disable react/jsx-no-useless-fragment */
import { ArrayFieldTemplateProps } from '@rjsf/utils'
import { kebabCase } from 'lodash'
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

  parseTitle(title:string) {
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

  render() {
    const {
      items, canAdd, onAddClick, schema, uiSchema, registry
    } = this.props
    let { title } = this.props
    const { formContext } = registry
    const { editor } = formContext
    const uiTitle = uiSchema['ui:title']
    const uiClassName = uiSchema['ui:className'] ?? 'title'
    items.forEach(() => {
      this.scrollRef.push(React.createRef())
    })
    if (editor?.arrayFieldAutoScroll !== -1) {
      if (editor.focusField === title) {
        setTimeout(() => {
          this.titleScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 200)
      }
      if (editor?.arrayFieldAutoScroll || editor.focusField === title) {
        setTimeout(() => {
          this.scrollRef[editor.arrayFieldAutoScroll]?.current?.scrollIntoView({ behavior: 'smooth' })
        }, 200)
      }
    }

    if (uiTitle) {
      title = uiTitle
    }
    let itemTitle = null
    if (uiSchema.items) {
      itemTitle = uiSchema.items['ui:title'] ?? title
    }
    return (
      <div data-testid="custom-array-template" ref={this.titleScrollRef}>
        <div className={uiClassName}>
          {title}
        </div>
        <p>
          {schema.description}
        </p>
        <br />

        {items && items.map((element: Element, index: number) => (

          <div
            key={element.key}
            className={`${element.className} element`}
            ref={this.scrollRef[index]}
          >
            <div className="custom-array-template-remove-btn">
              <div className="remove-header">
                <h6 className="remove-title">
                  <b>{this.parseTitle(itemTitle)}</b>
                  <span className="element-index-title">
                    {items.length > 0 && `(${index + 1} of ${items.length})`}
                  </span>
                </h6>
                <button
                  data-testid={`custom-array-template__remove-button--${kebabCase(title)}`}
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
              <Row className="mb-2  d-flex align-items-center">

                <Col xs="12" lg="12" key={element.key} className={element.className} data-testid="custom-array-element">
                  {element.children}
                </Col>
              </Row>
            </div>
          </div>
        ))}
        {(items.length === 0 && canAdd) && (
        <div className="custom-array-template-add-btn add-header" data-testid="custom-array-template-add-btn">
          <button
            data-testid={`custom-array-template__add-button--${kebabCase(title)}`}
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
              Add
              {' '}
              {this.parseTitle(itemTitle)}
            </span>
          </button>
        </div>
        )}
        {
          (items.length > 0 && canAdd) && (
            <div className="custom-array-template-add-btn add-header" data-testid="custom-array-template-add-btn">
              <button
                data-testid={`custom-array-template__add-button--${kebabCase(title)}`}
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
                  Add another
                  {' '}
                  {this.parseTitle(itemTitle)}
                </span>
              </button>
            </div>
          )
        }
      </div>
    )
  }
}
export default observer(CustomArrayFieldTemplate)
