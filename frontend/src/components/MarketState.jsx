import React, { useEffect, useState } from 'react';
import api from '../api';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ChartBarIcon } from '@heroicons/react/24/solid';

const MarketState = () => {
  const [state, setState] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/market-state'); 
        setState(res.data);
      } catch (err) {
        console.error("Failed to fetch market state:", err);
      }
    };

    fetchData();
  }, []);

  const getColor = () => {
    if (!state) return '';
    return state.state === 'bull'
      ? 'alert-success'
      : state.state === 'bear'
      ? 'alert-error'
      : 'alert-warning';
  };

  const getIcon = () => {
    if (!state) return null;
    return state.state === 'bull' ? (
      <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
    ) : state.state === 'bear' ? (
      <ArrowTrendingDownIcon className="w-6 h-6 text-red-600" />
    ) : (
      <ChartBarIcon className="w-6 h-6 text-yellow-500" />
    );
  };

  const getAnalysisText = () => {
    if (!state) return "Analyzing market data...";

    const trend = typeof state.trendPct === 'number' ? state.trendPct.toFixed(2) : '0.00';
    const sentiment = typeof state.sentiment === 'number' ? state.sentiment.toFixed(2) : '0.00';

    if (state.state === 'bull') {
      return `The market is bullish with a ${trend}% price increase over the past month and mostly positive news sentiment (${sentiment}).`;
    } else if (state.state === 'bear') {
      return `The market is bearish with a ${trend}% decline over the past month and predominantly negative news sentiment (${sentiment}).`;
    } else {
      return `The market is currently neutral, with price changes fluctuating and mixed sentiment in recent news (${sentiment}).`;
    }
  };

  return (
    <div className={`alert ${getColor()} rounded-lg shadow mt-6 flex items-start gap-3`}>
      {getIcon()}
      <span>{getAnalysisText()}</span>
    </div>
  );
};

export default MarketState;
