import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from stock_data import get_all_tickers, get_price_data, fetch_and_update_data
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

@app.on_event("startup")
def startup_event():
    fetch_and_update_data()  # Runs every time app starts

@app.get("/tickers")
def tickers():
    return get_all_tickers()

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
