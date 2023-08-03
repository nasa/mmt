/* eslint-disable react/jsx-no-constructed-context-values */
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
// import UmmVarForm from './UmmVarForm'
// import UmmToolsForm from './UmmToolsForm'
import UmmServicesForm from './UmmServicesForm'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <UmmServicesForm />
  // <UmmToolsForm shouldRedirectAfterPublish={false} />
  // <UmmToolsForm />
)
