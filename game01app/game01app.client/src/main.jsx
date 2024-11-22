import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import SignalRProvider from './SignalRContext.jsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <SignalRProvider>
            <App />
        </SignalRProvider>
  </React.StrictMode>,
)