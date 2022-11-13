import { createElement, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";

const container = document.getElementById("app");

if (container === null) {
  throw new Error("No root element");
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
