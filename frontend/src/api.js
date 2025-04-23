// src/api.js
import axios from "axios";

export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://stock-tracker-backend-trk4.onrender.com";

const api = axios.create({ baseURL: BASE_URL });

export default api;
