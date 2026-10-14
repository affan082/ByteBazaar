import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import config from "./config/global-info.json";

if (import.meta.env.VITE_SERVER_URI) {
  config.server.uri = import.meta.env.VITE_SERVER_URI.endsWith("/")
    ? import.meta.env.VITE_SERVER_URI
    : `${import.meta.env.VITE_SERVER_URI}/`;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
