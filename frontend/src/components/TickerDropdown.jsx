import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TickerDropdown = ({ options: initialOptions }) => {
  const [input, setInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [tickerOptions, setTickerOptions] = useState(initialOptions || []);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const popularTickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA"];

  const filtered = input
    ? tickerOptions.filter(t => t.toLowerCase().includes(input.toLowerCase()))
    : popularTickers;

  const handleSelect = async (ticker) => {
    try {
      if (tickerOptions.includes(ticker.toUpperCase())) {
        navigate(`/stock/${ticker}`);
      } else {
        const res = await fetch(`/fetch-ticker/${ticker}`, { method: "POST" });
        const result = await res.json();

        if (result.status === "ok") {
          const tickersRes = await fetch("/tickers");
          const newTickers = await tickersRes.json();

          setTickerOptions(newTickers); // ✅ fixed state update
          navigate(`/stock/${ticker}`);
        } else {
          alert("Ticker not found");
        }
      }
    } catch (err) {
      console.error("Error fetching ticker:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="form-control w-full max-w-md mx-auto relative">
      <input
        type="text"
        placeholder="Search stock ticker..."
        className="input input-bordered w-full bg-gray-100 text-black"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
      />
      {showDropdown && (
        <ul className="menu bg-white border border-base-300 rounded-box absolute w-full mt-1 z-50 max-h-60 overflow-y-auto shadow-md">
          {filtered.length > 0 ? (
            filtered.map(ticker => (
              <li key={ticker}>
                <button className="text-left px-4 py-2 hover:bg-base-200 w-full text-sm" onClick={() => handleSelect(ticker)}>
                  {ticker}
                </button>
              </li>
            ))
          ) : (
            <li className="text-base-content/50 px-4 py-2 text-sm">No matches found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default TickerDropdown;
