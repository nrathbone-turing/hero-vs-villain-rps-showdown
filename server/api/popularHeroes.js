// server/api/popularHeroes.js
// Static list of popular heroes (can later be swapped for DB/API calls)

export const popularHeroes = [
  {
    id: 70,
    name: "Batman",
    image: "https://www.superherodb.com/pictures2/portraits/10/100/639.jpg",
    powerstats: {
      intelligence: "100",
      strength: "26",
      speed: "27",
      durability: "50",
      power: "47",
      combat: "100"
    }
  },
  {
    id: 644,
    name: "Superman",
    image: "https://www.superherodb.com/pictures2/portraits/10/100/791.jpg",
    powerstats: {
      intelligence: "94",
      strength: "100",
      speed: "100",
      durability: "100",
      power: "100",
      combat: "85"
    }
  },
  {
    id: 720,
    name: "Wonder Woman",
    image: "https://www.superherodb.com/pictures2/portraits/10/100/807.jpg",
    powerstats: {
      intelligence: "88",
      strength: "100",
      speed: "79",
      durability: "100",
      power: "100",
      combat: "100"
    }
  },
  {
    id: 620,
    name: "Spider-Man",
    image: "https://www.superherodb.com/pictures2/portraits/10/100/133.jpg",
    powerstats: {
      intelligence: "90",
      strength: "55",
      speed: "67",
      durability: "75",
      power: "74",
      combat: "85"
    }
  }
]