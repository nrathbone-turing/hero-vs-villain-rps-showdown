// App.jsx
// Root component with navigation and routing.

import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Characters from './pages/Characters'
import Battle from './pages/Battle'
import './App.css'

function App() {
  return (
    <div id="app">
      <header>
        <nav>
          <Link to="/">Home</Link> |{" "}
          <Link to="/characters">Characters</Link> |{" "}
          <Link to="/battle">Battle</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </main>
    </div>
  )
}

export default App