import os
import shutil
import pandas as pd
import yfinance as yf
import requests
import numpy as np
import urllib.parse
from io import StringIO
from datetime import datetime, timedelta
import csv

ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")

DATA_DIR = "backend/data"
DATA_DIR = os.path.join("backend", "data")
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
    df = df.replace([np.inf, -np.inf], np.nan).dropna()

    # Normalize column names to lowercase for consistency
    df.columns = [col.lower() for col in df.columns]

    # Minimal format (SPY or custom manual files): timestamp + close
    if "timestamp" in df.columns and "close" in df.columns:
        return {
            "dates": df["timestamp"].tolist(),
            "close": df["close"].tolist(),
            "open": [],
            "high": [],
            "low": [],
            "volume": []
        }

    # Full OHLCV data
    expected = ["date", "open", "high", "low", "close", "volume"]
    if all(col in df.columns for col in expected):
        return {
            "dates": df["date"].tolist(),
            "open": df["open"].tolist(),
            "high": df["high"].tolist(),
            "low": df["low"].tolist(),
            "close": df["close"].tolist(),
            "volume": df["volume"].tolist()
        }

    # Still no match? Log available columns and fail gracefully
    print(f"❌ Missing expected columns in {ticker}. Found: {df.columns.tolist()}")
    return None

def format_alpha_date(raw):
    """Convert Alpha Vantage's timestamp format to ISO 8601"""
    try:
        return datetime.strptime(raw, "%Y%m%dT%H%M%S").isoformat()
    except Exception as e:
        print("❌ Date format error:", e)
        return None

def fetch_market_news():
    import requests, os, urllib

    alpha_key = os.getenv("ALPHA_VANTAGE_API_KEY")
    newsapi_key = os.getenv("NEWS_API_KEY")

    # ✅ Alpha Vantage query
    av_url = (
        f"https://www.alphavantage.co/query?function=NEWS_SENTIMENT"
        f"&tickers=AAPL,MSFT,GOOGL,NVDA,TSLA,SPY"
        f"&topics=financial_markets,economy_macro,economy_monetary"
        f"&sort=RELEVANCE&limit=6&apikey={alpha_key}"
    )

    try:
        av_response = requests.get(av_url)
        print("🔗 AV Request URL:", av_url)
        print("✅ AV Status:", av_response.status_code)

        av_data = av_response.json()
        articles = av_data.get("feed", [])
        print("📦 AV Feed Preview:", articles[:1])

        if articles:
            return [
                {
                    "title": article["title"],
                    "url": article["url"],
                    "image": article.get("banner_image", ""),
                    "publishedAt": format_alpha_date(article["time_published"])
                }
                for article in articles[:4]
            ]
    except Exception as e:
        print("❌ Alpha Vantage Error:", e)

    # 🔁 NewsAPI fallback
    try:
        query = urllib.parse.quote(
            "(stock market OR S&P 500 OR economy OR inflation OR recession OR interest rates OR GDP OR federal reserve) "
            "AND (crash OR rally OR correction OR surge OR volatility OR slowdown)"
        )
        newsapi_url = (
            f"https://newsapi.org/v2/everything?q={query}&"
            f"language=en&sortBy=publishedAt&pageSize=4&apiKey={newsapi_key}"
        )

        news_response = requests.get(newsapi_url)
        print("🌐 NewsAPI Status:", news_response.status_code)

        news_data = news_response.json()
        print("📰 NewsAPI Feed Preview:", news_data.get("articles", [])[:1])

        return [
            {
                "title": a["title"],
                "url": a["url"],
                "image": a.get("urlToImage", ""),
                "publishedAt": a["publishedAt"]
            }
            for a in news_data.get("articles", [])[:4]
        ]
    except Exception as e:
        print("❌ NewsAPI Error:", e)
        return []

def evaluate_market_state():
    from datetime import datetime, timedelta
    import yfinance as yf

    tickers = ["AAPL", "MSFT", "GOOGL", "NVDA", "TSLA", "^GSPC"]
    end = datetime.now()
    start = end - timedelta(days=30)

    price_changes = []
    for ticker in tickers:
        try:
            df = yf.download(ticker, start=start, end=end, progress=False)
            df = df[["Close"]].dropna()
            if not df.empty:
                start_price = df["Close"].iloc[0]
                end_price = df["Close"].iloc[-1]
                change_pct = ((end_price - start_price) / start_price) * 100
                price_changes.append(float(change_pct))
        except Exception as e:
            print(f"Failed to get data for {ticker}: {e}")

    avg_trend_pct = float(sum(price_changes)) / len(price_changes) if price_changes else 0

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

    print(f"Avg Trend %: {avg_trend_pct:.2f}")
    print(f"🧠 News sentiment score: {news_sentiment}")

    # Determine market state
    if avg_trend_pct > 2 and news_sentiment >= 0:
        state = "bull"
    elif avg_trend_pct < -2 and news_sentiment <= 0:
        state = "bear"
    else:
        state = "neutral"

    return {
        "state": state,
        "trendPct": avg_trend_pct,
        "sentiment": news_sentiment,
        "news": news
    }

def download_ticker_data(ticker: str) -> bool:
    try:
        df = yf.download(ticker, period="6mo", interval="1d", progress=False)
        if not df.empty:
            os.makedirs(DATA_DIR, exist_ok=True)
            df.to_csv(os.path.join(DATA_DIR, f"{ticker.upper()}.csv"))
            return True
        return False
    except Exception as e:
        print(f"Failed to fetch data for {ticker}: {e}")
        return False

def find_ticker_in_master(ticker: str) -> dict:
    """
    Searches for the given ticker in the tickers_master.csv file.

    Returns:
        dict: Dictionary with the ticker's info if found, else None.
    """
    path = os.path.join("backend", "data", "tickers_master.csv")
    ticker = ticker.upper()
    try:
        with open(path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row['Symbol'].upper() == ticker:
                    return row
    except FileNotFoundError:
        print(f"❌ File not found: {path}")
    except Exception as e:
        print(f"❌ Error reading {path}: {e}")
    return None