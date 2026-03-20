# Castle Quest Scoreboard

A medieval-themed tournament scoreboard for tracking scores across multiple mini-games. Built for game masters and event organizers running team-based competitions with a fantasy medieval setting.

## Features

- **Multi-game score tracking** — add and remove named games, enter per-team scores for each round
- **Live leaderboard** — auto-sorted by total points across all games; the leader is crowned with a gold crown icon
- **Dual-mode timer** — switchable between **countdown** (configurable minutes/seconds, with a "TIME'S UP" alert) and **stopwatch** modes; supports start, pause, and reset; turns red when under 10 seconds
- **Four fixed teams** — Red Knights, Blue Dragons, Green Rangers, and Yellow Lions, each color-coded throughout the UI
- **Medieval aesthetic** — custom fonts, gold color scheme, ornate borders, and a parchment texture background

## Teams

| Team | Color |
|---|---|
| Red Knights | Red |
| Blue Dragons | Blue |
| Green Rangers | Green |
| Yellow Lions | Yellow |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Routing | React Router v6 |
| Server state | TanStack React Query v5 |
| UI components | shadcn/ui (Radix UI) |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Testing | Vitest + Playwright |

## Getting Started

**Requirements:** Node.js 18+ installed — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

```sh
# 1. Clone the repository
git clone <YOUR_GIT_URL>

# 2. Navigate to the project directory
cd castle-quest-scoreboard

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint all files with ESLint |
| `npm run test` | Run tests once with Vitest |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
├── audio/                 # Audio files and sound effects
├── components/
│   ├── GameManager.tsx    # Add/delete games; per-team score input grid
│   ├── Scoreboard.tsx     # Aggregated leaderboard sorted by total points
│   ├── TimerSection.tsx   # Timer UI with countdown and stopwatch modes
│   └── ui/                # shadcn/ui component library
├── hooks/
│   └── useTimer.ts        # Custom hook with all timer logic
├── pages/
│   └── Index.tsx          # Root page; owns all state and composes panels
├── types/
│   └── game.ts            # Game/Team interfaces, TEAMS constant, color helpers
└── App.tsx                # App shell with providers (Query, Router, Toasts)
```
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
