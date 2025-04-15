import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsSection from './NewsSection';
import TickerDropdown from './TickerDropdown';
import MarketState from './MarketState';

const Dashboard = ({ tickers }) => {
  const [recent, setRecent] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentTickers") || "[]");
    setRecent(stored);
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0e1c] text-white px-4 py-10 space-y-10">
      {/* Main white container */}
      <div className="max-w-3xl mx-auto bg-white text-black rounded-2xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="flex justify-center items-center gap-2 text-4xl font-extrabold text-primary">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="36"
              width="36"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="m16 6 2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"></path>
            </svg>
            <span>Stock Tracker</span>
          </div>
          <p className="text-sm text-gray-500">Search or select a ticker below</p>
        </div>

        {/* Search bar */}
        <TickerDropdown options={tickers} />

        {/* Recently Viewed */}
        {recent.length > 0 && (
          <div>
            <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="text-xl">🕓</span> Recently Viewed
            </h2>
            <div className="flex flex-wrap gap-2">
              {recent.map((ticker, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/stock/${ticker}`)}
                  className="btn btn-sm rounded-full bg-gray-100 hover:bg-primary hover:text-white text-sm"
                >
                  {ticker}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Market Status Card */}
        <MarketState />
      </div>

      {/* 📰 News section styled below */}
      <div className="max-w-5xl mx-auto px-4">
        <NewsSection />
      </div>
    </div>
  );
};

export default Dashboard;
