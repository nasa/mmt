/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/static-property-placement */
/* eslint-disable react/jsx-no-useless-fragment */
import { observer } from 'mobx-react'
import React, { MouseEventHandler, ReactNode } from 'react'
import { Row, Col } from 'react-bootstrap'
import { retrieveSchema } from 'react-jsonschema-form/lib/utils'
import MetadataEditor from '../MetadataEditor'

type Element = {
  index: number,
  key: string,
  children: ReactNode,
  className: string,
  onDropIndexClick: (index:number) => MouseEventHandler<HTMLButtonElement>
}

type CustomArrayTemplateProps = {
  items: Element[]
  canAdd: boolean
  onAddClick: (event: object) => void
  title: string
  schema: {
    description: string
    items: {
      default?: string
      definitions: any
    },
    definitions: unknown
  }
  uiSchema: unknown,
  options: {
    editor: MetadataEditor
  }
}

class CustomArrayTemplate extends React.Component<CustomArrayTemplateProps, never> {
  static defaultProps: { options: { editor: MetadataEditor } }
  private scrollRef: Array<React.RefObject<HTMLDivElement>>
  constructor(props: CustomArrayTemplateProps) {
    super(props)
    const { items, schema, options } = this.props
    const { editor } = options
    this.scrollRef = []
    const { definitions } = editor.fullSchema
    const itemsSchema = retrieveSchema(schema.items, definitions)
    const { type } = itemsSchema
    if (type && type === 'string') {
      schema.items.default = ''
    }
    items.forEach(() => {
      this.scrollRef.push(React.createRef())
    })
  }
  componentDidUpdate(): void {
    const { options } = this.props
    const { editor } = options
    // Keep this setTimeout at 200 ms. If it is anything less than 200ms it will set the
    // FocusArrayField to null before the page renders causing a console error.
    if (editor.focusArrayField) {
      setTimeout(() => {
        editor.setArrayField(-1)
      }, 300)
    }
  }

  render() {
    const {
      items, canAdd, title, onAddClick, schema, uiSchema, options
    } = this.props
    const { editor } = options
    const uiTitle = uiSchema['ui:title']
    const uiClassNames = uiSchema['ui:classNames']
    items.forEach(() => {
      this.scrollRef.push(React.createRef())
    })
    if (editor?.focusArrayField >= 0) {
      setTimeout(() => {
        this.scrollRef[editor.focusArrayField]?.current?.scrollIntoView({ behavior: 'smooth' })
      }, 200)
    }

    let titleName = title
    if (uiTitle) {
      titleName = uiTitle
    } else if (title.charAt(title.length - 1) === 's') {
      titleName = title.slice(0, -1)
    }
    return (
      <div data-testid="custom-array-template">
        {uiClassNames ? (
          <div className={uiClassNames}>{titleName}</div>
        ) : (
          <div className="title" style={{ borderBottom: 'solid 2px rgb(240,240,240', paddingBottom: 14, paddingTop: 14 }}>
            {titleName}
          </div>
        )}
        <p>
          {schema.description}
        </p>
        <br />

        {items && items.map((element: Element, index: number) => (
          <div
            key={element.key}
            className={element.className}
            style={{
              borderLeft: 'solid 6px rgb(240,240,240', borderBottom: 'solid 2px rgb(240,240,240)', marginBottom: 25, paddingLeft: 10
            }}
            ref={this.scrollRef[index]}
          >
            <div className="custom-array-template-remove-btn">
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginRight: -12, borderBottom: 'solid 2px rgb(240,240,240)', marginBottom: 10, paddingBottom: 10
              }}
              >
                <h6 style={{ height: 14 }}>
                  <b>{titleName}</b>
                  <span style={{ color: 'gray', marginLeft: 5, paddingTop: 20 }}>
                    {items.length > 0 && `(${index + 1} of ${items.length})`}
                  </span>
                </h6>
                <button className="btn" onClick={element.onDropIndexClick(element.index)} type="button">
                  <span style={{ color: 'red' }}>
                    <i className="fa-solid fa-circle-minus fa-2xl" />
                  </span>
                  {' '}
                  <span style={{ color: 'red', fontWeight: 'bold' }}>
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

        {
          (items.length === 0 && canAdd) && (
            <div className="custom-array-template-add-btn" data-testid="custom-array-template-add-btn" style={{ marginTop: -30 }}>
              <button
                className="btn"
                type="button"
                onClick={(e) => {
                  onAddClick(e)
                  editor.setArrayField(items.length)
                }}
              >
                <span style={{ color: 'rgb(31, 107, 162)', marginLeft: '-12px' }}>
                  <i className="fa-solid fa-circle-plus fa-2xl" />
                </span>
                {' '}
                <span style={{ color: 'rgb(31, 107, 162)', fontWeight: 'bold' }}>
                  Add
                  {' '}
                  {titleName}
                </span>
              </button>
            </div>
          )
        }
        {
          (items.length > 0 && canAdd) && (
            <div className="custom-array-template-add-btn" data-testid="custom-array-template-add-btn" style={{ marginTop: -10 }}>
              <button
                className="btn"
                type="button"
                onClick={(e) => { onAddClick(e); editor.setArrayField(items.length) }}
              >
                <span style={{ color: 'rgb(31, 107, 162)', marginLeft: '-12px' }}>
                  <i className="fa-solid fa-circle-plus fa-2xl" />
                </span>
                {' '}
                <span style={{ color: 'rgb(31, 107, 162)', fontWeight: 'bold' }}>
                  Add another
                  {' '}
                  {titleName}
                </span>
              </button>
            </div>
          )
        }
      </div>
    )
  }
}
export default observer(CustomArrayTemplate)
