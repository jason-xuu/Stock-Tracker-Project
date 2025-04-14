import React, { useState, useEffect } from 'react';
import TickerDropdown from './components/TickerDropdown';
import ChartView from './components/ChartView';
import axios from 'axios';

function App() {
  const [tickers, setTickers] = useState([]);
  const [selected, setSelected] = useState('');
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('/tickers').then(res => setTickers(res.data));
  }, []);

  useEffect(() => {
    if (selected) {
      axios.get(`/prices/${selected}`).then(res => setChartData(res.data));
    }
  }, [selected]);

  return (
    <div className="container mt-5">
      <h1>📈 Stock Tracker Dashboard</h1>
      <TickerDropdown options={tickers} onChange={setSelected} />
      <ChartView data={chartData} />
      {selected && (
        <a href={`/download/${selected}`} className="btn btn-success mt-3">Download CSV</a>
      )}
    </div>
  );
}

export default App;
