import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./index.css";
import App from "./App.jsx";
import { StyledEngineProvider } from "@mui/material/styles";

// A blank value keeps local development on Vite's /api proxy.
// Set VITE_API_BASE_URL to the preview API URL for a separately hosted frontend.
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "";
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
  </StrictMode>
);
