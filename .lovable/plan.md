
# ⚔️ Medieval Team Building — Game Timer & Scoreboard

## Overview
A single-page medieval-themed web app to manage team building games with timers and a live scoreboard for 4 teams (Red, Blue, Green, Yellow).

## Design & Theme
- Medieval aesthetic: dark parchment-style background, ornate borders, medieval-style fonts (Google Fonts: MedievalSharp or UnifrakturCook for headings)
- Team colors displayed as bold banners/shields: **Red**, **Blue**, **Green**, **Yellow**
- Subtle medieval decorative elements (swords, shields icons from Lucide)

## Layout (Single Page)
### Top Section — Current Game & Timer
- **Current game name** displayed prominently (editable)
- **Large timer display** — toggleable between countdown and stopwatch mode
  - For countdown: set minutes/seconds before starting
  - Start / Pause / Reset controls
  - Visual + sound alert when countdown reaches zero
- Medieval-styled control buttons

### Middle Section — Scoreboard Table
- Table showing all 4 teams with their colored banners
- Columns: **Team** | **Points per game** (expandable) | **Total Points**
- Teams auto-sorted by total points (leaderboard style)
- Crown/trophy icon on the leading team

### Bottom Section — Game Management
- **Add Game** button to create a new game round
- List of past games with scores recorded
- Ability to input/edit points per team for each game
- Delete game option

## Key Features
- **Dynamic game creation** — add/remove games on the fly
- **Flexible timer** — countdown or stopwatch per game
- **Manual point entry** — input points per team per game
- **Live leaderboard** — auto-calculates totals and ranks teams
- **All local state** — no backend needed, data persists in-page during the session
