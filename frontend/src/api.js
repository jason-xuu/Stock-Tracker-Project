import axios from "axios";

// Set base URL for Render backend
const api = axios.create({
  baseURL: "https://stock-tracker-backend-trk4.onrender.com",
});

export default api;
