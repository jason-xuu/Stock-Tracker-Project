import os
import shutil
import pandas as pd
import yfinance as yf
import requests
import numpy as np
import urllib.parse
from io import StringIO
from datetime import datetime, timedelta

ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")

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
            data.reset_index(inplace=True)  # Make sure 'Date' becomes a column
            csv_path = os.path.join(DATA_DIR, f"{ticker}.csv")
            data.to_csv(csv_path, index=False)
        else:
            print(f"No data for {ticker}, skipping.")
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

    tickers = fetch_nasdaq_tickers()

    # Always download these popular tickers
    must_have = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "NFLX", "AMD", "INTC"]
    for ticker in must_have:
        if ticker in tickers:
            download_stock_data(ticker)

    # Then download more tickers (up to 100 or all)
    for ticker in tickers[:100]:
        download_stock_data(ticker)

def get_all_tickers():
    return [f.replace(".csv", "") for f in os.listdir(DATA_DIR) if f.endswith(".csv")]

def get_price_data(ticker):
    path = os.path.join(DATA_DIR, f"{ticker}.csv")
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return None

    df = pd.read_csv(path)

    # Drop rows with NaNs and replace infs with None
    df = df.replace([np.inf, -np.inf], np.nan).dropna()

    if "Date" not in df.columns or "Close" not in df.columns:
        print(f"Missing columns in {ticker}: {df.columns.tolist()}")
        return None

    return {
        "dates": df["Date"].tolist(),
        "close": df["Close"].tolist(),
        "volume": df["Volume"].tolist()
    }

def fetch_market_news():
    import requests
    from datetime import datetime, timedelta
    import os

    API_KEY = os.getenv("ALPHA_VANTAGE_KEY")
    base_url = "https://www.alphavantage.co/query"
    function = "NEWS_SENTIMENT"
    tickers = "AAPL,MSFT,NVDA"
    sort = "LATEST"
    limit = 10
    time_from = (datetime.now() - timedelta(days=3)).strftime("%Y%m%dT%H%M")

    query_url = (
        f"{base_url}?function={function}"
        f"&tickers={tickers}"
        f"&sort={sort}"
        f"&limit={limit}"
        f"&time_from={time_from}"
        f"&apikey={API_KEY}"
    )

    try:
        response = requests.get(query_url)
        print("API response status:", response.status_code)

        data = response.json()
        print("News API Response (preview):", data.get("feed", [])[:1])

        articles = data.get("feed", [])[:4]  # Get top 4
        return [
            {
                "title": a["title"],
                "url": a["url"],
                "image": a.get("banner_image") or "",
                "publishedAt": a["time_published"]
            }
            for a in articles if "title" in a
        ]
    except Exception as e:
        print("Error fetching from Alpha Vantage:", e)
        return []




def evaluate_market_state():
    from datetime import datetime, timedelta
    import yfinance as yf

    tickers = ["AAPL", "MSFT", "GOOGL", "NVDA", "TSLA", "^GSPC"]
    end = datetime.now()
    start = end - timedelta(days=30)

    gainers = 0
    losers = 0

    for ticker in tickers:
        try:
            df = yf.download(ticker, start=start, end=end, progress=False)
            df = df[["Close"]].dropna()
            if not df.empty:
                start_price = df["Close"].iloc[0]
                end_price = df["Close"].iloc[-1]
                if float(end_price.iloc[0]) > float(start_price.iloc[0]):
                    gainers += 1
                else:
                    losers += 1
        except Exception as e:
            print(f"Failed to get data for {ticker}: {e}")

    # Fetch news and analyze sentiment
    news = fetch_market_news()

    bearish_keywords = ["recession", "crash", "inflation", "sell-off", "tariffs", "downturn", "decline", "fear", "plunge", "jobless"]
    bullish_keywords = ["rally", "boom", "optimism", "growth", "gain", "surge", "recovery", "bullish", "spike"]

    news_sentiment = 0
    for article in news:
        title = article["title"].lower()
        if any(kw in title for kw in bullish_keywords):
            news_sentiment += 1
        elif any(kw in title for kw in bearish_keywords):
            news_sentiment -= 1

    print(f"📊 Price trend: {gainers} up vs {losers} down")
    print(f"🧠 News sentiment score: {news_sentiment}")

    # Combine both signals to decide market state
    if gainers == 0 and losers == 0:
        state = "neutral"
    elif gainers > losers and news_sentiment >= 0:
        state = "bull"
    elif losers > gainers and news_sentiment <= 0:
        state = "bear"
    else:
        state = "neutral"

    return {
        "state": state,
        "news": news
    }

