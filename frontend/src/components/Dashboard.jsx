import React, { useEffect, useState } from 'react';
import TickerDropdown from './TickerDropdown';
import MarketState from './MarketState';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ tickers }) => {
  const navigate = useNavigate();
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentTickers") || "[]");
    setRecent(stored);
  }, []);

  return (
    <div className="container mt-5">
      <h1>📈 Stock Tracker Dashboard</h1>
      <p>Search or select a ticker</p>
      <TickerDropdown options={tickers} />

      {recent.length > 0 && (
        <>
          <hr />
          <h5>🕓 Recently Viewed</h5>
          <ul className="list-group">
            {recent.map((t, idx) => (
              <li key={idx} className="list-group-item list-group-item-action" onClick={() => navigate(`/stock/${t}`)} style={{ cursor: 'pointer' }}>
                {t}
              </li>
            ))}
          </ul>
        </>
      )}

      <hr />
      <MarketState />
    </div>
  );
};

export default Dashboard;
