import { useEffect, useState } from "react";
import type { AuthService } from "../features/auth/application/AuthService";
import { LoginPage } from "../features/auth/presentation/pages/LoginPage";
import { RegisterPage } from "../features/auth/presentation/pages/RegisterPage";
import { Workspace, workspaceNavigation } from "./Workspace";
import { MockCatalogService } from "../features/sales/infrastructure/MockCatalogService";
import { AccountProfileStore } from "../features/auth/infrastructure/AccountProfileStore";
import { CustomerService } from "../features/customers/application/CustomerService";
import { MockCustomerRepository } from "../features/customers/infrastructure/MockCustomerRepository";
import { InvoiceService } from "../features/invoices/application/InvoiceService";
import { MockInvoiceRepository } from "../features/invoices/infrastructure/MockInvoiceRepository";

const catalogService = new MockCatalogService();
const customerService = new CustomerService(new MockCustomerRepository());
const invoiceService = new InvoiceService(new MockInvoiceRepository());

type AuthRoute = string;

function routeFromPath(pathname: string): AuthRoute {
  if (workspaceNavigation.some((item) => item.path === pathname))
    return pathname;
  if (pathname === "/overview") return "/sales";
  return pathname === "/register" ? "register" : "login";
}

interface AppProps {
  authService: AuthService;
}

export function App({ authService }: AppProps) {
  const [account, setAccount] = useState(() => AccountProfileStore.read());
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
      route === "register"
        ? "Đăng ký tài khoản | GOAN"
        : workspaceNavigation.some((item) => item.path === route)
          ? `${workspaceNavigation.find((item) => item.path === route)?.label} | GOAN`
          : "Đăng nhập | GOAN";
  }, [route]);

  function navigate(nextRoute: AuthRoute) {
    const path =
      nextRoute === "register"
        ? "/register"
        : nextRoute === "login"
          ? "/"
          : nextRoute;
    window.history.pushState({}, "", path);
    setRoute(routeFromPath(path));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (workspaceNavigation.some((item) => item.path === route)) {
    return (
      <Workspace
        path={route}
        navigate={navigate}
        catalogService={catalogService}
        customerService={customerService}
        invoiceService={invoiceService}
        account={account}
        onSignOut={() => {
          AccountProfileStore.clear();
          setAccount(null);
          navigate("login");
        }}
      />
    );
  }

  if (route === "register") {
    return (
      <RegisterPage
        authService={authService}
        onBackToLogin={() => navigate("login")}
      />
    );
  }

  return (
    <LoginPage
      authService={authService}
      onRegister={() => navigate("register")}
      onSignedIn={(response, remember) => {
        const profile = { userId: response.userId, fullName: response.fullName };
        AccountProfileStore.save(profile, remember);
        setAccount(profile);
        navigate("/sales");
      }}
    />
  );
}
