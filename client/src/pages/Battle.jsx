// Battle.jsx
import React from "react"
import { useLocation } from "react-router-dom"

function Battle() {
  const location = useLocation()
  const hero = location.state?.hero

  if (!hero) {
    return <h2>No hero selected. Go back to Characters.</h2>
  }

  return (
    <div>
      <h2>Battle Page</h2>
      <p>Selected Hero: {hero.name}</p>
      <p>Strength: {hero.powerstats.strength}</p>
    </div>
  )
}

export default Battle