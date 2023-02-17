/* eslint-disable react/jsx-no-constructed-context-values */
import React from 'react'
import ReactDOM from 'react-dom/client'
// import './index.css'
// import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App'
import UmmToolsModel from './model/UmmToolsModel'
import MetadataEditor from './MetadataEditor'
import UmmToolsForm from './UmmToolsForm'

const root = ReactDOM.createRoot(document.getElementById('root'))
// const model = new UmmToolsModel()
// const editor = new MetadataEditor(model)
root.render(
  <UmmToolsForm />
  // <App editor={editor} />
)
