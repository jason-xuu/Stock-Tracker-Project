import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MarketState = () => {
  const [state, setState] = useState(null);
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios.get("/market-state").then(res => {
      console.log("📈 Market response:", res.data);
      setState(res.data.state);
      setNews(res.data.news);
    });
  }, []);

  const getStyle = () => ({
    backgroundColor:
      state === "bull" ? "#c8f7c5" :
      state === "bear" ? "#f8d7da" :
      "#e2e3e5",
    color:
      state === "bull" ? "#155724" :
      state === "bear" ? "#721c24" :
      "#383d41",
    border:
      `1px solid ${
        state === "bull" ? "#28a745" :
        state === "bear" ? "#dc3545" :
        "#d6d8db"
      }`,
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "20px",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: "1.2em"
  });

  const renderStateLabel = () => {
    if (state === "bull") return "🐂 Bull Market";
    if (state === "bear") return "🐻 Bear Market";
    return "🔍 Market Unclear";
  };

  const getSentimentStyle = (title) => {
    const lower = title.toLowerCase();
    const bullish = ["rally", "boom", "optimism", "growth", "gain", "surge", "recovery", "bullish", "spike"];
    const bearish = ["recession", "crash", "inflation", "sell-off", "tariffs", "downturn", "decline", "fear", "plunge", "jobless"];

    if (bullish.some(kw => lower.includes(kw))) {
      return { backgroundColor: "#d4edda", color: "#155724" };
    }
    if (bearish.some(kw => lower.includes(kw))) {
      return { backgroundColor: "#f8d7da", color: "#721c24" };
    }
    return { backgroundColor: "#fdfdfe", color: "#333" };
  };

  const getSentimentTooltip = (title) => {
    const lower = title.toLowerCase();
    const bullish = ["rally", "boom", "optimism", "growth", "gain", "surge", "recovery", "bullish", "spike"];
    const bearish = ["recession", "crash", "inflation", "sell-off", "tariffs", "downturn", "decline", "fear", "plunge", "jobless"];

    if (bullish.some(kw => lower.includes(kw))) return "Positive Sentiment";
    if (bearish.some(kw => lower.includes(kw))) return "Negative Sentiment";
    return "Neutral Sentiment";
  };

  return (
    <>
      {state && <div style={getStyle()}>{renderStateLabel()}</div>}

      {news.length > 0 && (
        <div className="row">
          {news.map((article, idx) => (
            <div className="col-md-6 mb-3" key={idx}>
              <div
                className="card"
                style={{ height: "220px", overflow: "hidden", ...getSentimentStyle(article.title) }}
                title={getSentimentTooltip(article.title)}
              >
                {article.image ? (
                  <img
                    src={article.image}
                    className="card-img-top"
                    alt="News"
                    style={{ height: "100px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      height: "100px",
                      backgroundColor: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.9rem",
                      color: "#888"
                    }}
                  >
                    📰 No Image
                  </div>
                )}
                <div className="card-body p-2">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-title d-block text-truncate mb-1"
                    title={article.title}
                    style={{ fontSize: "0.95rem", fontWeight: "bold", lineHeight: "1.2em" }}
                  >
                    {article.title}
                  </a>
                  <p className="text-muted mb-0" style={{ fontSize: "0.75rem" }}>
                    {article.publishedAt && !isNaN(new Date(article.publishedAt)) 
                      ? new Date(article.publishedAt).toLocaleString()
                      : "Unknown Date"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default MarketState;
