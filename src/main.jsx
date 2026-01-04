import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <div className="min-h-screen bg-gradient-to-br from-teal-300 to-indigo-300">
  <App />
</div>
  </StrictMode>,
)
