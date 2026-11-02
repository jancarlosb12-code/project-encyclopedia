# Project Encyclopedia Demo

This repository was originally a project concept and prototype, but it was not yet structured as a runnable website. I created a minimal full-stack demo setup so it can run locally:

- A small React frontend for the calendar UI
- A simple Express backend with JSON persistence
- Local API endpoints for saving and retrieving project notes by date

## Run the app

### 1) Start the backend

```bash
cd backend
npm install
npm start
```

The API will run at:

- `http://localhost:4000/api/health`

### 2) Start the frontend

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Then open:

- `http://localhost:5173`

## Demo features

- Calendar view for October 2026
- Click any day to manage notes for that date
- Save text entries through the backend API
- Stored items persist in `backend/data/items.json`

## Notes

This is a minimal working demo, designed to make the concept usable locally. It is intentionally simple and can be expanded for a fuller product experience.
