import React from 'react';
import Plot from 'react-plotly.js';

const ChartView = ({ data }) => {
  if (!data) return <p>Select a ticker to see chart</p>;

  return (
    <Plot
      data={[
        {
          x: data.dates,
          y: data.close,
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'blue' },
        },
      ]}
      layout={{ title: `Price Chart`, width: 720, height: 400 }}
    />
  );
};

export default ChartView;
