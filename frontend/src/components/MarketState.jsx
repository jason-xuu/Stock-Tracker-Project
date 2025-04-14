import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MarketState = () => {
  const [state, setState] = useState(null);
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios.get("/market-state").then(res => {
      console.log("Market response:", res.data);
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

  const formatAlphaVantageDate = (dateStr) => {
    if (!dateStr || dateStr.length < 15) return "Unknown";
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const day = dateStr.slice(6, 8);
    const hour = dateStr.slice(9, 11);
    const minute = dateStr.slice(11, 13);
    const second = dateStr.slice(13, 15);
    const formatted = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    const date = new Date(formatted);
    return date.toLocaleString();
  };

  return (
    <>
      {state && <div style={getStyle()}>{renderStateLabel()}</div>}

      {news.length > 0 && (
        <div className="row">
          {news.map((article, idx) => (
            <div className="col-md-6 mb-3" key={idx}>
              <div className="card" style={{ height: "220px", overflow: "hidden" }}>
                {article.image ? (
                  <img
                    src={article.image}
                    className="card-img-top"
                    alt="News"
                    style={{ height: "100px", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{
                    height: "100px",
                    backgroundColor: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.9rem",
                    color: "#888"
                  }}>
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
                    {formatAlphaVantageDate(article.publishedAt)}
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
