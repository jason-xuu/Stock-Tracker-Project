import pandas as pd
import os

# Load your full NASDAQ file
raw_path = "backend/raw/nasdaqlisted.txt"  # or wherever you placed it
output_path = "backend/ticker_list/tickers_master.csv"
os.makedirs(os.path.dirname(output_path), exist_ok=True)

df = pd.read_csv(raw_path, sep="\t")

# Filter only valid tickers
df = df[df["Test Issue"] != "Y"]

# Select only useful columns
df = df[["Symbol", "Security Name", "Listing Exchange"]]
df.columns = ["symbol", "name", "exchange"]

# Optional: remove ETF and weird symbols
df = df[~df["symbol"].str.contains(r"[^A-Z]", na=False)]

# Save cleaned list
df.to_csv(output_path, index=False)
print("✅ Ticker master list saved.")
