import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './js/App'
import consumeAuthToken from './js/utils/consumeAuthToken'

// Store the token handed back by the login redirect before anything reads it
consumeAuthToken()

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
