# PocketInvestor — Retail Investor Education 

**Problem:** Retail investors often lack accessible education, rely on unverified advice, and struggle with English-only material.

**Solution:** An interactive web app with:
- Bite-sized lessons (English & Hindi)
- Risk profiling with suggested allocations
- Quizzes and progress tracking
- Virtual trading sandbox using delayed sample data (no real money)
- Translate & Summarize tool (prototype, on-device heuristic)

> This is a Functional MVP suitable for a hackathon demo. No backend required; runs locally in any browser.

## Quick Start
- Download/clone the repo.
- Open `index.html` in a modern browser.
- Data is stored in `localStorage` for your session.

## Tech Stack
- Frontend: HTML5, CSS3, Vanilla JavaScript
- Data: Static JSON (sample delayed prices)
- i18n: Simple client-side dictionary (EN/HI)
- Storage: localStorage (browser)
- License: MIT

## Notes
- This prototype does **not** provide financial advice.
- Delayed data is mock historical series for demo.
- Translation & summarization are lightweight heuristics for offline demo.

## How to Extend
- Replace `data/delayed_prices.json` with delayed data from an approved source or API.
- Add more languages in `/lang` and extend `I18N` in `app.js`.
- Hook summarizer to an LLM endpoint for better quality (subject to policy).
- Add real charts (e.g., using Chart.js) and more lessons/quizzes.
