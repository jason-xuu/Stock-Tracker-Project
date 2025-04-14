import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChartView from './ChartView';

const StockPage = () => {
  const { ticker } = useParams();
  const [chartData, setChartData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (ticker) {
      axios.get(`/prices/${ticker}`)
        .then(res => {
          setChartData(res.data);
  
          // Update recently viewed stack
          let recent = JSON.parse(localStorage.getItem("recentTickers")) || [];
  
          // Remove existing occurrence
          recent = recent.filter(t => t !== ticker);
  
          // Add current to top
          recent.unshift(ticker);
  
          // Limit to 2 most recent
          recent = recent.slice(0, 2);
  
          localStorage.setItem("recentTickers", JSON.stringify(recent));
        })
        .catch(err => console.error(err));
    }
  }, [ticker]);

  return (
    <div className="container mt-5">
      <h2>📊 Stock Data: {ticker}</h2>
      <ChartView data={chartData} />
      <a href={`/download/${ticker}`} className="btn btn-success mt-3 me-2">
        Download CSV
      </a>
      <button className="btn btn-secondary mt-3" onClick={() => navigate("/")}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default StockPage;
