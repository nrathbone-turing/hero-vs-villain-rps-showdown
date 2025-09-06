// App.jsx
// Root component with global navigation and routing.

import React from "react"
import { Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import Characters from "./pages/Characters"
import Battle from "./pages/Battle"
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material"
import "./App.css"

function App() {
  return (
    <div id="app">
      {/* Global Nav */}
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Hero vs Villain Showdown
          </Typography>
          <Box>
            <Button color="inherit" component={Link} to="/" data-testid="nav-home">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/characters" data-testid="nav-characters">
              Characters
            </Button>
            <Button color="inherit" component={Link} to="/battle" data-testid="nav-battle">
              Battle
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Page Routing */}
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