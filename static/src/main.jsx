import React from 'react'
import ReactDOM from 'react-dom/client'

// Must stay above App. It sotres the login token and 'App'
// pulls in 'react-cookie', which reads document.cookie once it loads
import './storeAuthToken'

import App from './js/App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
