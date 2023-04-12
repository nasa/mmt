// import { cloneDeep } from 'lodash'
import { cloneDeep } from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import { Card } from 'react-bootstrap'
import JSONPretty from 'react-json-pretty'
import MetadataEditor from '../MetadataEditor'
import { removeEmpty } from '../utils/json_utils'

type JSONViewProps = {
  editor: MetadataEditor;
}
type JSONViewState = {
  status: string
}

class JSONView extends React.Component<JSONViewProps, JSONViewState> {
  render() {
    const { editor } = this.props
    const data = removeEmpty(cloneDeep(editor.fullData))
    // const data = editor.fullData
    return (
      <Card>
        <Card.Header>JSON</Card.Header>
        <Card.Body id="json-text-field">
          <JSONPretty data={data} />
        </Card.Body>
      </Card>
    )
  }
}
export default observer(JSONView)
