/* eslint-disable react/static-property-placement */
/* eslint-disable react/jsx-no-useless-fragment */
import { observer } from 'mobx-react'
import React, { MouseEventHandler, ReactNode } from 'react'
import { Row, Col } from 'react-bootstrap'
import MetadataEditor from '../MetadataEditor'

type Element = {
  index: number,
  key: string,
  children: ReactNode,
  className: string,
  onDropIndexClick: (index:number) => MouseEventHandler<HTMLButtonElement>
}

type CustomArrayTemplateProps = {
  className: string,
  items: Element[]
  canAdd: boolean
  onAddClick: (event: object) => void
  title: string
  schema: {
    description: string
  }
  uiSchema: unknown,
  options: {
    editor: MetadataEditor
  }
}

class CustomArrayTemplate extends React.Component<CustomArrayTemplateProps, never> {
  static defaultProps: {options:{editor:MetadataEditor}}
  private scrollRef: Array<React.RefObject<HTMLDivElement>>
  constructor(props: CustomArrayTemplateProps) {
    super(props)
    const { items } = this.props
    this.scrollRef = []
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
        editor.setArrayField(null)
      }, 200)
    }
  }

  render() {
    const {
      className, items, canAdd, title, onAddClick, schema, uiSchema, options
    } = this.props
    const { editor } = options
    const uiTitle = uiSchema['ui:title']
    items.forEach(() => {
      this.scrollRef.push(React.createRef())
    })

    if (editor?.focusArrayField >= 0 && editor.focusArrayField) {
      setTimeout(() => {
        this.scrollRef[editor.focusArrayField]?.current?.scrollIntoView({ behavior: 'smooth' })
      }, 200)
    }

    let titleName = ''
    if (uiTitle) {
      titleName = uiTitle
    } else if (title.charAt(title.length - 1) === 's') {
      titleName = title.slice(0, -1)
    }

    return (
      <div className={className} data-testid="custom-array-template">
        <h5>
          {titleName}
          <hr className="border-0 bg-secondary" style={{ height: '1px' }} />
        </h5>
        <p>
          {schema.description}
        </p>
        <br />
        {items && items.map((element: Element, index: number) => (
          <div key={element.key} className={element.className} style={{ borderLeft: 'solid 10px rgb(240,240,240', marginBottom: '25px', paddingLeft: 5 }} ref={this.scrollRef[index]}>
            <Row className="mb-2  d-flex align-items-center">
              <>
                <Col xs="12" lg="12" key={element.key} className={element.className} data-testid="custom-array-element">
                  {element.children}
                </Col>
              </>
            </Row>
            <div className="custom-array-template-remove-btn">
              <button className="btn" onClick={element.onDropIndexClick(element.index)} type="button">
                <span style={{ color: 'red', marginLeft: '-8px' }}>
                  <i className="fa-solid fa-circle-minus fa-2xl" />
                </span>
                {' '}
                <span style={{ color: 'red', fontWeight: 'bold', textDecoration: 'underline' }}>
                  Remove
                  {' '}
                  {titleName}
                </span>
              </button>
            </div>
          </div>
        ))}

        {
          canAdd && (
            <div className="custom-array-template-add-btn" data-testid="custom-array-template-add-btn">
              <button
                className="btn"
                type="button"
                onClick={(e) => { onAddClick(e); editor.setArrayField(items.length) }}
              >
                <span style={{ color: 'rgb(31, 107, 162)' }}>
                  <i className="fa-solid fa-circle-plus fa-2xl" />
                </span>
                {' '}
                <span style={{ color: 'rgb(31, 107, 162)', fontWeight: 'bold', textDecoration: 'underline' }}>
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
