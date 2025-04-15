import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from stock_data import get_all_tickers, get_price_data, fetch_and_update_data
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from stock_data import evaluate_market_state
from fastapi import HTTPException
from stock_data import download_ticker_data

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    fetch_and_update_data()  # Runs every time app starts

@app.get("/tickers")
def get_tickers():
    files = os.listdir("backend/data")
    return [f.replace(".csv", "") for f in files if f.endswith(".csv")]

@app.get("/prices/{ticker}")
def prices(ticker: str):
    data = get_price_data(ticker)
    if not data:
        raise HTTPException(status_code=404, detail="Ticker not found")
    return data

@app.get("/download/{ticker}")
def download(ticker: str):
    path = f"data/{ticker}.csv"
    try:
        return FileResponse(path, filename=f"{ticker}.csv")
    except:
        raise HTTPException(status_code=404, detail="File not found")

@app.get("/market-state")
def market_state():
    from stock_data import evaluate_market_state
    return evaluate_market_state()

@app.get("/news")
def get_news():
    from stock_data import fetch_market_news
    return fetch_market_news()

@app.post("/fetch-ticker/{ticker}")
def fetch_ticker(ticker: str):
    ticker_info = find_ticker_in_master(ticker)
    if not ticker_info:
        raise HTTPException(status_code=404, detail="Ticker not found in master list.")
    
    success = download_ticker_data(ticker)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to download ticker data.")
    
    return {"status": "ok", "ticker": ticker.upper()}

@app.get("/search-ticker/{query}")
def search_ticker(query: str):
    path = "backend/ticker_list/tickers_master.csv"
    if not os.path.exists(path):
        raise HTTPException(status_code=500, detail="Ticker list missing")

    df = pd.read_csv(path)
    df['symbol'] = df['symbol'].astype(str)

    matches = df[df['symbol'].str.contains(query.upper(), na=False)]
    return matches['symbol'].tolist()[:10]  # limit results