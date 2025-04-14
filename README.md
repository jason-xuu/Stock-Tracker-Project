# Stock Tracker Dashboard

Full-stack stock monitoring app that auto-fetches NASDAQ tickers and displays 2 years of price history.

## Tech Stack
- 🐍 FastAPI (backend)
- ⚛️ React + Bootstrap (frontend)
- 📈 Plotly.js (charts)
- 🗃 Archiving + auto data update on server start

## Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Deployment
- Backend: [Render](https://render.com/docs/deploy-fastapi)
- Frontend: [Vercel](https://vercel.com/new)
