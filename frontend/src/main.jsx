import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
//inject the css-js styling to override  the css MUI
import { StyledEngineProvider } from "@mui/material/styles";
import axios from "axios";

// Use the deployed backend URL from the VITE_API_URL environment variable.
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

createRoot(document.getElementById("root")).render(
  <StyledEngineProvider>
    <App />
  </StyledEngineProvider>
);
