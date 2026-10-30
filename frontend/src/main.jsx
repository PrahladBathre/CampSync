import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// Inject the CSS-JS styling to override the CSS MUI.
import { StyledEngineProvider } from "@mui/material/styles";
import axios from "axios";

// Use the deployed backend URL from the VITE_API_URL environment variable.
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
// Avoid requests hanging forever when the API is unavailable.
axios.defaults.timeout = 25000;

const getSessionAccessToken = () => {
  try { return sessionStorage.getItem("campSyncAccessToken"); } catch { return null; }
};

axios.interceptors.request.use((request) => {
  const accessToken = getSessionAccessToken();
  if (accessToken) {
    request.headers = request.headers || {};
    request.headers.Authorization = "Bearer " + accessToken;
  }
  return request;
});

// Share one refresh request when several API calls receive an expired-token response.
let refreshInFlight = null;
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    if (!request) return Promise.reject(error);

    // Retry safe GET requests for transient network errors and temporary server failures.
    // Never retry mutations such as login, registration, attendance updates, or deletes.
    const method = (request.method || "get").toLowerCase();
    const transient = !error.response ||
      [502, 503, 504].includes(error.response.status) ||
      error.code === "ECONNABORTED" ||
      error.code === "ETIMEDOUT" ||
      error.code === "ERR_NETWORK";
    if (method === "get" && transient && (request._campSyncRetries || 0) < 2) {
      request._campSyncRetries = (request._campSyncRetries || 0) + 1;
      const delay = request._campSyncRetries * 700;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return axios(request);
    }

    const url = request.url || "";
    const excluded = ["/api/teacher/login", "/api/teacher/refresh-token", "/api/teacher/logout"];
    if (error.response?.status !== 401 || request._campSyncRetried || excluded.some((path) => url.includes(path))) {
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
        try { sessionStorage.setItem("campSyncAccessToken", accessToken); } catch {}
        request.headers = request.headers || {};
        request.headers.Authorization = "Bearer " + accessToken;
      }
      return axios(request);
    } catch {
      try { sessionStorage.removeItem("campSyncAccessToken"); } catch {}
      return Promise.reject(error);
    }
  }
);

createRoot(document.getElementById("root")).render(
  <StyledEngineProvider>
    <App />
  </StyledEngineProvider>
);
