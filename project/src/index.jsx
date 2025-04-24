import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Import styles
import "./index.css";

const root = createRoot(document.getElementById("app"));

root.render(
  <StrictMode>
    <App />
  </StrictMode>
); 