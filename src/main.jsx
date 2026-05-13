import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { SensorProvider } from './context/SensorContext'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <SensorProvider>
          <App />
        </SensorProvider>
      </AuthProvider>
    </HashRouter>
  </StrictMode>,
)
