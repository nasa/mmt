import React from 'react'
import ReactDOM from 'react-dom/client'

// Must stay above App. See storeAuthToken.js
import './storeAuthToken'

import App from './js/App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
