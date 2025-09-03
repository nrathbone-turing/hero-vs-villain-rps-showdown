// App.jsx
// Root component of the app.
// Contains navigation links and route definitions for Home, Characters, and Battle pages.

import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Characters from './pages/Characters'
import Battle from './pages/Battle'
import './App.css'

function App() {
  return (
    <div className="App">
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/characters">Characters</Link> |{" "}
        <Link to="/battle">Battle</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/battle" element={<Battle />} />
      </Routes>
    </div>
  )
}

export default App