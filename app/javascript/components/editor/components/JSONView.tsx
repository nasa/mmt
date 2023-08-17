import { cloneDeep } from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import {
  Accordion, Card
} from 'react-bootstrap'
import './JSONView.css'
import JSONPretty from 'react-json-pretty'
import MetadataEditor from '../MetadataEditor'
import { removeEmpty } from '../utils/json_utils'

type JSONViewProps = {
  editor: MetadataEditor;
}
type JSONViewState = {
  icon: string
}

class JSONView extends React.Component<JSONViewProps, JSONViewState> {
  constructor(props: JSONViewProps) {
    super(props)
    this.state = {
      icon: 'fa fa-chevron-down'
    }
  }
  iconType() {
    const { icon } = this.state
    if (icon === 'fa fa-chevron-down') {
      this.setState({ icon: 'fa fa-chevron-up' })
    } else {
      this.setState({ icon: 'fa fa-chevron-down' })
    }
  }

  render() {
    const { editor } = this.props
    const { icon } = this.state

    const data = removeEmpty(cloneDeep(editor.fullData))

    return (
      <Accordion defaultActiveKey="0" className="json-accordion">
        <Card>
          <Accordion.Toggle className="json-accordion-header" data-testid="json-view__accordion-header" as={Card.Header} eventKey="0" onClick={() => { this.iconType() }}>
            JSON
            <i className={icon} style={{ marginLeft: '620px' }} />
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body id="json-text-field" data-testid="json-view__full-data">
              <JSONPretty data={data} />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    )
  }
}
export default observer(JSONView)
