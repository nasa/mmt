/* eslint-disable react/jsx-no-constructed-context-values */
import React from 'react'
import ReactDOM from 'react-dom/client'
import UmmVarForm from './UmmVarForm'
// import UmmToolsForm from './UmmToolsForm'

/** Javascript to prevent wheel motion and up/down arrow from
 * changing input when type=number.
 */
document.addEventListener('wheel', () => {
  if (document.activeElement.type === 'number') {
    document.activeElement.blur()
  }
})
document.addEventListener('keydown', (event) => {
  if (document.activeElement.type === 'number') {
    if (event.key === 'ArrowDown'
      || event.key === 'ArrowUp'
      || (!/[0-9\\.e\\-]/.test(event.key))) {
      event.preventDefault()
    }
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <UmmToolsForm />
)
