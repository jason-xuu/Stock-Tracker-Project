import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TickerDropdown = ({ options }) => {
  const [input, setInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const popularTickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "NFLX", "AMD", "INTC"];

  const filtered = input
    ? options.filter(t => t.toLowerCase().includes(input.toLowerCase()))
    : popularTickers;

  const handleSelect = (ticker) => {
    setInput('');
    setShowDropdown(false);
    navigate(`/stock/${ticker}`);
  };

  // Hide dropdown if clicked outside
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
    <div className="position-relative" ref={dropdownRef}>
      <input
        type="text"
        className="form-control"
        placeholder="Search or select a ticker"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
      />
      {showDropdown && (
        <ul className="list-group position-absolute w-100" style={{ zIndex: 10, maxHeight: 200, overflowY: 'auto' }}>
          {filtered.length > 0 ? (
            filtered.map((ticker) => (
              <li
                key={ticker}
                className="list-group-item list-group-item-action"
                onClick={() => handleSelect(ticker)}
              >
                {ticker}
              </li>
            ))
          ) : (
            <li className="list-group-item text-muted">No match found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default TickerDropdown;
