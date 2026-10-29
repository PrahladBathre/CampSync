import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
//inject the css-js styling to override  the css MUI
import { StyledEngineProvider } from "@mui/material/styles";
import axios from "axios";

// Use the deployed backend URL from the VITE_API_URL environment variable.
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

// Recover an expired access cookie through the refresh cookie and retry once.
let refreshInFlight = null;
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const url = request?.url || "";
    const excluded = ["/api/teacher/login", "/api/teacher/refresh-token", "/api/teacher/logout"];
    if (error.response?.status !== 401 || !request || request._campSyncRetried || excluded.some((path) => url.includes(path))) {
      return Promise.reject(error);
    }
    request._campSyncRetried = true;
    try {
      if (!refreshInFlight) {
        refreshInFlight = axios.post("/api/teacher/refresh-token", {}, { withCredentials: true })
          .finally(() => { refreshInFlight = null; });
      }
      const refreshed = await refreshInFlight;
      const accessToken = refreshed?.data?.data?.accessToken;
      if (accessToken) {
        request.headers = request.headers || {};
        request.headers.Authorization = "Bearer " + accessToken;
      }
      return axios(request);
    } catch {
      return Promise.reject(error);
    }
  }
);

createRoot(document.getElementById("root")).render(
  <StyledEngineProvider>
    <App />
  </StyledEngineProvider>
);
