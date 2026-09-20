import { useEffect, useState } from "react";
import { LoginPage } from "./features/auth/LoginPage";
import { RegisterPage } from "./features/auth/RegisterPage";
import type { AuthService } from "./features/auth/auth-service";
import type { RegistrationService } from "./features/auth/registration-service";

type AuthRoute = "login" | "register";

function routeFromPath(pathname: string): AuthRoute {
  return pathname === "/register" ? "register" : "login";
}

interface AppProps {
  authService: AuthService;
  registrationService: RegistrationService;
}

export function App({ authService, registrationService }: AppProps) {
  const [route, setRoute] = useState<AuthRoute>(() =>
    routeFromPath(window.location.pathname),
  );

  useEffect(() => {
    const handleNavigation = () =>
      setRoute(routeFromPath(window.location.pathname));
    window.addEventListener("popstate", handleNavigation);
    return () => window.removeEventListener("popstate", handleNavigation);
  }, []);

  useEffect(() => {
    document.title =
      route === "register" ? "Đăng ký tài khoản | GOAN" : "Đăng nhập | GOAN";
  }, [route]);

  function navigate(nextRoute: AuthRoute) {
    const path = nextRoute === "register" ? "/register" : "/";
    window.history.pushState({}, "", path);
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (route === "register") {
    return (
      <RegisterPage
        registrationService={registrationService}
        onBackToLogin={() => navigate("login")}
      />
    );
  }

  return (
    <LoginPage
      authService={authService}
      onRegister={() => navigate("register")}
    />
  );
}
