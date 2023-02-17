/* eslint-disable react/static-property-placement */
/* eslint-disable react/jsx-no-useless-fragment */
import { observer } from 'mobx-react'
import React from 'react'
import { Row, Col } from 'react-bootstrap'
import MetadataEditor from '../MetadataEditor'

type CustomArrayTemplateProps = {
  className: string,
  items: string[]
  canAdd: boolean
  onAddClick: (event: object) => void
  title: string
  schema: any,
  uiSchema: any,
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
    if (editor.focusArrayField) {
      setTimeout(() => {
        editor.setArrayField(null)
      }, 100)
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
    if (editor?.focusArrayField >= 0) {
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
        {items && items.map((element: any, index: number) => (
          <div key={element.key} className={element.className} style={{ borderLeft: 'solid 10px rgb(240,240,240', marginBottom: '25px', paddingLeft: 5 }} ref={this.scrollRef[index]}>
            <Row className="mb-2  d-flex align-items-center">
              <>
                <Col xs="9" lg="9" key={element.key} className={element.className} data-testid="custom-array-element">
                  {element.children}
                </Col>
              </>
            </Row>
            <div className="custom-array-template-remove-btn">
              <button className="btn" onClick={element.onDropIndexClick(element.index)} type="button">
                <span style={{ color: 'red', marginLeft: '-10px' }}>
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
