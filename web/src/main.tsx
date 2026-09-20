import React from "react";
import ReactDOM from "react-dom/client";
import { LoginPage } from "./features/auth/LoginPage";
import { UnavailableAuthService } from "./features/auth/auth-service";
import "./styles.css";

// Replace this adapter with the .NET API implementation when its contract is ready.
const authService = new UnavailableAuthService();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LoginPage authService={authService} />
  </React.StrictMode>,
);
