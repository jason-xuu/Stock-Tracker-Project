// src/api.js
import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://stock-tracker-backend-trk4.onrender.com";

const api = axios.create({ baseURL });

export default api;
