import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/BlueprintList.js'
import './index.css'

createRoot(document.getElementById('root')).render(
  <>
    <App />
  </>
)
