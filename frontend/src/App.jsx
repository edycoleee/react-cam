import { useState } from 'react'
import Capture from './Capture'
import Writing from './Writing'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('capture')

  return (
    <div className="App">
      <nav className="navigation">
        <div className="nav-container">
          <h2 className="nav-title">📱 Aplikasi Multimedia</h2>
          <div className="nav-buttons">
            <button 
              onClick={() => setActivePage('capture')}
              className={`nav-btn ${activePage === 'capture' ? 'active' : ''}`}
            >
              📷 Camera Capture
            </button>
            <button 
              onClick={() => setActivePage('writing')}
              className={`nav-btn ${activePage === 'writing' ? 'active' : ''}`}
            >
              ✍️ Tanda Tangan
            </button>
          </div>
        </div>
      </nav>

      <div className="page-content">
        {activePage === 'capture' && <Capture />}
        {activePage === 'writing' && <Writing />}
      </div>
    </div>
  )
}

export default App
