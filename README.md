# Nudge (Prototype)

A lightweight task/chase/meeting prototype built with **React + Vite**.

## What it includes (prototype scope)
- **Today**: next actions due today + blocked items + meetings today
- **Inbox**: triage **Untriaged** quick notes into **Task** or **Chase**
- **Items**: master list of all tasks + chases with filters + sort
- **Meetings**: meetings list + meeting detail with notes + create actions
- **Item Drawer**: edit, convert type, dependencies (blockers), log

Uses mocked data persisted to `localStorage` (`nudge_data_v1`).

## Run locally
```bash
npm install
npm run dev
```

## GitHub Pages deploy
Configured for GitHub Pages:
- `HashRouter` (no 404 on refresh)
- `vite.config.js` uses `base: './'`

This repo includes `.github/workflows/deploy.yml` (GitHub Actions Pages deploy).
