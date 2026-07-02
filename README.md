# My Backlog

A full-stack-feeling React app for tracking films, shows, games, and books you want to get to — with a twist: instead of just scrolling a list, you filter by how much time and energy you actually have right now, and get a suggestion tailored to your mood.

**Live demo:** [link coming soon]

## Why I built this

Most backlog/watchlist apps are just a list. I wanted something that solved the actual problem I have: I know what I want to watch/play/read eventually, but I never know what fits *right now*. So instead of a plain CRUD list, the core feature is a mood-based filter and suggestion system.

## Features

- Add items with type (TV Show / Film / Game / Book), estimated time commitment, and energy level required
- Filter your backlog by time available and energy level
- **Surprise Me** — get a single suggested item from your filtered backlog, weighted toward the category you've rated highest in the past
- Mark items as done and rate them 1–5
- Completed history, separate from your active backlog
- Data persists locally via `localStorage` — no backend required, refresh-proof

## How the suggestion logic works

When you hit "Surprise Me", the app:
1. Filters your backlog by your selected time/energy filters
2. Looks at your completed items and calculates your average rating per category (TV Show, Film, Game, Book)
3. Prefers items from your highest-rated category, if any are in the filtered pool
4. Falls back to a random pick from the full filtered pool if there's no rating history yet, or no match in the preferred category

It's simple weighted-random selection, not machine learning — but it's a genuine first step toward personalization, built on real data rather than guesswork.

## Tech stack

- React (Vite)
- Plain CSS
- Browser `localStorage` for persistence (no backend yet)

## What I'd add next

- A proper Node/Express + SQLite backend, so data isn't tied to one browser
- Replace the `prompt()`-based rating flow with an in-page modal
- Genre tags, not just type, for more nuanced suggestions
- Basic stats page (items completed per month, breakdown by type)

## Running it locally

\`\`\`
git clone https://github.com/Adamyork43/backlog-app.git
cd backlog-app
npm install
npm run dev
\`\`\`
