import { observer } from 'mobx-react'
import React from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import UmmToolsForm from './UmmToolsForm'
import UmmVarForm from './UmmVarForm'

class Home extends React.Component {
  render() {
    return (
      <Tabs>
        <Tab eventKey="tool" title="UMM-Tools">
          <UmmToolsForm heading={null} token="token" user="user" provider="MMT_1" />
        </Tab>
        <Tab eventKey="var" title="UMM-Var">
          <UmmVarForm heading={null} token="token" user="user" provider="MMT_1" />
        </Tab>
      </Tabs>
    )
  }
}
export default observer(Home)
