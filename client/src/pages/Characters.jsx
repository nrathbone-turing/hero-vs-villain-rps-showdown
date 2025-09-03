// Characters.jsx
// Fetches and displays a single hero with power stats.

import React, { useEffect, useState } from 'react'

function Characters({ heroId = 1 }) {
  const [hero, setHero] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchHero() {
      try {
        const response = await fetch(`https://superheroapi.com/api/${import.meta.env.VITE_API_KEY}/${heroId}`)
        if (!response.ok) throw new Error("Network response was not ok")
        const data = await response.json()
        setHero(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchHero()
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error fetching hero</p>

  return (
    <div>
      <h2>{hero.name}</h2>
      <p>Strength: {hero.powerstats.strength}</p>
    </div>
  )
}

export default Characters