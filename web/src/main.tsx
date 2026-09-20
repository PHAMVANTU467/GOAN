import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { UnavailableAuthService } from "./features/auth/auth-service";
import { UnavailableRegistrationService } from "./features/auth/registration-service";
import "./styles.css";

const authService = new UnavailableAuthService();
const registrationService = new UnavailableRegistrationService();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App authService={authService} registrationService={registrationService} />
  </React.StrictMode>,
);
