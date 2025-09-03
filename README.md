# Hero vs Villain Showdown (React + Express)

A capstone project implementing a frontend React application with a backend Express proxy. The app integrates with the [SuperHero API](https://superheroapi.com/) to let users browse heroes/villains, view stats, and prepare for battles.

---

## Overview
- **Frontend (React + Vite)**
  - Client-side routing for Home, Characters, and Battle pages
  - Characters page displays a grid of popular heroes with stats
  - Material UI (MUI) for card-based UI
  - Tests with Vitest + React Testing Library
- **Backend (Express)**
  - Proxy route for individual hero lookups (`/api/hero/:id`) → forwards to SuperHero API
  - Stubbed endpoint for popular heroes (`/api/popular-heroes`)
  - Tests with Vitest + Supertest

---

## Features
- **Characters**
  - View a grid of popular heroes
  - Each hero displayed as an MUI card with stats
  - “Select” button (prepares for Battle page)
- **Battle (upcoming)**
  - Users select a hero vs villain and compare power stats
- **Server Proxy**
  - Protects API key and avoids CORS issues
  - Provides `/api/hero/:id` route to retrieve full hero data
  - Stubbed `/api/popular-heroes` route for static list

---

## Tech Stack
- **Frontend**: React + Vite + React Router + MUI
- **Backend**: Express + CORS + dotenv
- **Testing**: Vitest + React Testing Library + Supertest
- **Deployment**: Vercel (client), Render/Heroku/railway (server) — upcoming for optional stretch

---

## Installation & Setup

### 1. Clone & install dependencies
```
git clone git@github.com:your-username/hero-vs-villain-showdown.git
cd hero-vs-villain-showdown

# Install all deps (root, client, server)
npm install
```

### 2. Configure environment variables
Create `.env` files for server and client.

**client/.env**
```
VITE_API_KEY=your_api_key_here
```

**server/.env**
```
API_KEY=your_api_key_here
PORT=5001
```

### 3. Run the app in development
Start the server (Express API proxy):
```
npm run dev:server
# -> http://localhost:5001
```

Start the client (React app):
```
npm run dev:client
# -> http://localhost:5173
```

The client proxy (via `vite.config.js`) forwards `/api/*` requests to the server.

---

## API Endpoints
### Server (Express)

- `GET / - health check`
- `GET /api/popular-heroes` - returns static list of heroes
- `GET /api/hero/:id` - fetches single hero data from SuperHero API

### Client (React)
- `/` - Home page
- `/characters` - Characters list view
- `/battle` - Battle page (in progress)

## Running Tests
### Server
```
npm run test:server
```
Covers:
- `/` health check
- `/api/hero/:id` proxy behavior (mocked fetch)
- `/api/popular-heroes` returns static list

### Client
```
cd client
npm run test:client
```
Covers:
- Routing (Home, Characters, Battle links)
- Characters list rendering (loading, success, error, select button)

### Both
```
npm test
```
Runs all client + server tests

---

## Project Structure
```
hero-vs-villain-showdown/
├─ README.md
├─ package.json
├─ client/
│  ├─ src/
│  │  ├─ pages/
│  │  │  ├─ Home.jsx
│  │  │  ├─ Characters.jsx
│  │  │  └─ Battle.jsx
│  │  ├─ __tests__/
│  │  │  ├─ App.test.jsx
│  │  │  ├─ CharactersList.test.jsx
│  │  │  └─ ...
│  ├─ vite.config.js
├─ server/
│  ├─ api/
│  │  └─ popularHeroes.js
│  ├─ __tests__/
│  │  ├─ proxy.test.js
│  │  └─ popularHeroes.test.js
│  ├─ index.js
└─ .gitignore
```

---

## About This Repo
**Author:** Nick Rathbone | [GitHub Profile](https://github.com/nrathbone-turing)

This project is part of the Flatiron School Capstone course.

**License:** MIT — feel free to use or remix!