/* eslint-disable react/require-default-props */
import React from 'react'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { observer } from 'mobx-react'
import MetadataEditor from './MetadataEditor'
import DetailedProgressView from './components/progress/DetailedProgressView'
import MetadataEditorForm from './components/MetadataEditorForm'

type AppProps = {
  editor: MetadataEditor;
  heading?: string;
};

class App extends React.Component<AppProps, never> {
  render() {
    const { editor } = this.props
    return (
      <BrowserRouter>
        <Routes>
          <Route path={`/${editor.model.documentType}/:id`} element={<DetailedProgressView editor={editor} />} />
          <Route path={`/${editor.model.documentType}/:id/edit/:sectionName`} element={<MetadataEditorForm editor={editor} {...this.props} />} />
          <Route path={`/${editor.model.documentType}/new`} element={<MetadataEditorForm editor={editor} {...this.props} />} />
          <Route path="/" element={<MetadataEditorForm editor={editor} {...this.props} />} />
        </Routes>
      </BrowserRouter>
    )
  }
}
export default observer(App)
