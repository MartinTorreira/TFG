import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { LoginProvider } from "./components/context/LoginContext.js";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LoginProvider>
      <Theme>
        <App />
      </Theme>
    </LoginProvider>
  </React.StrictMode>,
);

reportWebVitals();
