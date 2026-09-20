import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import { HttpAuthService } from "./features/auth/infrastructure/HttpAuthService";
import "./styles/global.css";

const authService = new HttpAuthService();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App authService={authService} />
  </React.StrictMode>,
);
