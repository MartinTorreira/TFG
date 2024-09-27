import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { LoginProvider } from "./components/context/LoginContext.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
      <LoginProvider>
        <App />
      </LoginProvider>
  </React.StrictMode>
);

reportWebVitals();
