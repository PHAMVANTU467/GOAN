import type { ReactNode } from "react";

interface AuthPageLayoutProps {
  title: string;
  subtitle?: string;
  variant?: "login" | "register";
  children: ReactNode;
}

export function AuthPageLayout({
  title,
  subtitle,
  variant = "login",
  children,
}: AuthPageLayoutProps) {
  return (
    <main className="page-shell">
      <div className="background-image" aria-hidden="true" />
      <div className="background-overlay" aria-hidden="true" />

      <div className={`auth-layout auth-layout--${variant}`}>
        <section
          className={`auth-card auth-card--${variant}`}
          aria-labelledby="auth-page-title"
        >
          <div className="auth-brand">
            <img src="/images/goan-logo.png" alt="GOAN" />
          </div>
          <div className="auth-welcome">
            <h1 id="auth-page-title">{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
