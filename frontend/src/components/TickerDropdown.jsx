import React from 'react';

const TickerDropdown = ({ options, onChange }) => (
  <select className="form-select" onChange={e => onChange(e.target.value)}>
    <option>Select a ticker</option>
    {options.map(ticker => (
      <option key={ticker} value={ticker}>{ticker}</option>
    ))}
  </select>
);

export default TickerDropdown;
