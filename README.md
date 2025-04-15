# 📈 Stock Tracker Dashboard

An intelligent, interactive stock tracking platform built with **React**, **Tailwind CSS**, and **FastAPI** — featuring real-time data, sentiment-based market analysis, and dynamic ticker fetching via `yfinance`.

> **Live Demo:** [https://stock-tracker-frontend.onrender.com](https://stock-tracker-frontend.onrender.com)

---

## Overview

This project is more than just a stock visualizer — it’s a full-stack dashboard that empowers users to:

- **Search any stock** (even if it's not preloaded)
- **View live chart data** with candlestick visualization
- **Analyze market conditions** (Bull, Bear, or Neutral) based on news sentiment + 30-day trends
- **Stay informed** with financial news tailored to top tickers and economic trends
- **Download stock CSVs** with one click for deeper analysis

---

## Key Features

✅ **Dynamic Ticker Support**  
Search for *any valid ticker* and the backend will fetch and cache the latest 6 months of historical data.

✅ **Market State Inference**  
The dashboard intelligently determines if the market is Bullish 🟢, Bearish 🔴, or Neutral 🟡 by combining:
- 30-day trend of major stocks
- Financial news sentiment analysis (Alpha Vantage + NewsAPI)

✅ **Modern UI/UX**  
A sleek, mobile-responsive interface powered by:
- Tailwind CSS & DaisyUI
- Dark theme backgrounds with bright white card containers
- Clean layout with subtle transitions

✅ **Real-Time News Feed**  
Top finance/economy news is auto-fetched, prioritized by relevance and source trustworthiness.

✅ **Chart Visualization**  
Beautiful candlestick charts powered by Plotly.js — fast, interactive, and responsive.

✅ **Fully Extensible Backend**  
FastAPI handles routing, ticker management, and dynamic data fetching from:
- Yahoo Finance via `yfinance`
- Alpha Vantage and NewsAPI (fallbacks built-in)

---

## Tech Stack

- **Frontend**: React, Tailwind CSS, DaisyUI, Plotly.js
- **Backend**: FastAPI, yfinance, pandas, NumPy
- **APIs Used**: Alpha Vantage, NewsAPI, Yahoo Finance
- **Data Caching**: Local CSV-based caching for high performance and offline-friendly usage

---

## Project Structure

```txt
📁 frontend/
│   └── React UI
│       ├── Dashboard.jsx
│       ├── TickerDropdown.jsx
│       ├── MarketState.jsx
│       └── StockPage.jsx

📁 backend/
│   └── FastAPI Server
│       ├── main.py
│       ├── stock_data.py
│       └── scripts/

📁 backend/data/
└── CSV files for each cached stock ticker
