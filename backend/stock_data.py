import os
import shutil
import pandas as pd
import yfinance as yf
import requests
from io import StringIO
from datetime import datetime

DATA_DIR = "backend/data"
ARCHIVE_DIR = "backend/archive"

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(ARCHIVE_DIR, exist_ok=True)

def fetch_nasdaq_tickers():
    url = "https://www.nasdaqtrader.com/dynamic/SymDir/nasdaqlisted.txt"
    response = requests.get(url)
    df = pd.read_csv(StringIO(response.text), sep='|')
    tickers = df[df['Test Issue'] == 'N']['Symbol'].dropna().unique()
    return [t for t in tickers if isinstance(t, str) and t.isalnum()]

def download_stock_data(ticker):
    try:
        data = yf.download(ticker, period="2y", interval="1d", progress=False)
        if not data.empty:
            csv_path = os.path.join(DATA_DIR, f"{ticker}.csv")
            data.to_csv(csv_path)
    except Exception as e:
        print(f"Error fetching {ticker}: {e}")

def archive_if_needed():
    today = datetime.today()
    if today.day != 1:
        return
    archive_path = os.path.join(ARCHIVE_DIR, today.strftime("%Y-%m-%d"))
    if not os.path.exists(archive_path):
        os.makedirs(archive_path)
        for f in os.listdir(DATA_DIR):
            shutil.copy(os.path.join(DATA_DIR, f), os.path.join(archive_path, f))

def cleanup_old_archives(keep_last=6):
    archives = sorted(os.listdir(ARCHIVE_DIR))
    for old in archives[:-keep_last]:
        shutil.rmtree(os.path.join(ARCHIVE_DIR, old))

def fetch_and_update_data():
    archive_if_needed()
    cleanup_old_archives()
    for ticker in fetch_nasdaq_tickers()[:100]:
        download_stock_data(ticker)

def get_all_tickers():
    return [f.replace(".csv", "") for f in os.listdir(DATA_DIR) if f.endswith(".csv")]

def get_price_data(ticker):
    path = os.path.join(DATA_DIR, f"{ticker}.csv")
    if not os.path.exists(path):
        return None
    df = pd.read_csv(path)
    return {
        "dates": df["Date"].tolist(),
        "close": df["Close"].tolist(),
        "volume": df["Volume"].tolist()
    }
