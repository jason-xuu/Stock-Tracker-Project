// src/components/NewsSection.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const NewsSection = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios.get("/news")
      .then(res => setNews(res.data))
      .catch(err => console.error("News fetch error:", err));
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4 text-white">📰 Market News</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {news.map((article, i) => (
          <a
            key={i}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-base-200 p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <p className="font-medium text-base-content">{article.title}</p>
            <p className="text-xs text-base-content/60 mt-1">{new Date(article.publishedAt).toLocaleString()}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
