import React from "react";
import Plot from "react-plotly.js";

const ChartView = ({ data }) => {
  if (!data || !data.dates || data.dates.length === 0) {
    return <p className="text-muted">No chart data available</p>;
  }

  return (
    <Plot
      data={[
        {
          type: "candlestick",
          x: data.dates,
          open: data.open,
          high: data.high,
          low: data.low,
          close: data.close,
          name: "Stock",
        },
      ]}
      layout={{
        title: "📈 Candlestick Chart",
        xaxis: {
          title: "Date",
          type: "category",
          rangeslider: { visible: false },
        },
        yaxis: { title: "Price (USD)" },
        dragmode: "pan",
        hovermode: "x unified",
        margin: { l: 50, r: 50, t: 50, b: 40 },
        template: "plotly_dark",
      }}
      config={{
        scrollZoom: true, // ⬅️ enables mouse wheel zoom
        responsive: true,
      }}
      style={{ width: "100%", height: "500px" }}
    />
  );
};

export default ChartView;
