import App from "components/App";
import React from "react";
import { createRoot } from "react-dom/client";

document.addEventListener("turbo:load", () => {
  const rootElement = document.createElement("div");
  const root = createRoot(document.body.appendChild(rootElement));

  root.render(<App />);
});
