import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import StockPage from './components/StockPage';
import Navbar from './components/Navbar';
import axios from 'axios';

const App = () => {
  const [tickers, setTickers] = useState([]);

  useEffect(() => {
    axios.get('/tickers')
      .then(res => setTickers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-base-100 text-base-content">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard tickers={tickers} />} />
        <Route path="/stock/:ticker" element={<StockPage />} />
      </Routes>
    </div>
  );
};

export default App;
