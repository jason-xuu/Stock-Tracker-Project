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
        .then(res => setChartData(res.data))
        .catch(err => console.error(err));

      // Update recent tickers in localStorage
      let recent = JSON.parse(localStorage.getItem("recentTickers")) || [];
      recent = [ticker, ...recent.filter(t => t !== ticker)].slice(0, 6);
      localStorage.setItem("recentTickers", JSON.stringify(recent));
    }
  }, [ticker]);

  return (
    <div className="min-h-screen bg-[#0e0e1c] text-white px-4 py-10">
      <div className="max-w-5xl mx-auto bg-white text-black rounded-2xl shadow-xl p-8 space-y-6">
        {/* Title */}
        <div className="text-center space-y-1">
          <div className="flex justify-center items-center gap-2 text-3xl font-extrabold text-primary">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="32"
              width="32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="m16 6 2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
            </svg>
            <span>{ticker} Chart</span>
          </div>
          <p className="text-sm text-gray-500">Candlestick Chart</p>
        </div>

        {/* Chart */}
        <div className="bg-gray-100 rounded-xl p-4">
          <ChartView data={chartData} />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 pt-2">
          <a
            href={`/download/${ticker}`}
            className="btn btn-primary btn-md"
          >
            Download CSV
          </a>
          <button
            onClick={() => navigate('/')}
            className="btn btn-outline btn-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockPage;
