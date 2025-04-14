import React from 'react';
import { Routes, Route } from "react-router-dom";
import Dashboard from './components/Dashboard';
import StockPage from './components/StockPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/stock/:ticker" element={<StockPage />} />
    </Routes>
  );
}

export default App;
