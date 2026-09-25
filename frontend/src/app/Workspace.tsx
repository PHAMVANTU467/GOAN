import { useEffect, useState } from "react";
import {
  BarChart3,
  Boxes,
  Coffee,
  LogOut,
  Package,
  ReceiptText,
  Settings2,
  ShoppingBag,
  Store,
  Users,
  UsersRound,
} from "lucide-react";
import type { CatalogService } from "../features/sales/application/CatalogService";
import type { AccountProfile } from "../features/auth/domain/AuthModels";
import type { StoreInfo } from "../features/sales/domain/SalesModels";
import { SalesPage } from "../features/sales/presentation/SalesPage";
import { CustomerManagementPage } from "../features/customers/presentation/CustomerManagementPage";
import type { CustomerService } from "../features/customers/application/CustomerService";
import type { InvoiceService } from "../features/invoices/application/InvoiceService";
import { InvoiceManagementPage } from "../features/invoices/presentation/InvoiceManagementPage";
import "../styles/workspace.css";

export const workspaceNavigation = [
  { path: "/sales", label: "Bán hàng", icon: ShoppingBag },
  { path: "/invoices", label: "Hóa đơn", icon: ReceiptText },
  { path: "/products", label: "Sản phẩm", icon: Package },
  { path: "/inventory", label: "Kho hàng", icon: Boxes },
  { path: "/customers", label: "Khách hàng", icon: Users },
  { path: "/employees", label: "Nhân viên", icon: UsersRound },
  { path: "/reports", label: "Báo cáo", icon: BarChart3 },
  { path: "/settings", label: "Cài đặt", icon: Settings2 },
];

export function Workspace({
  path,
  navigate,
  catalogService,
  customerService,
  invoiceService,
  account,
  onSignOut,
}: {
  path: string;
  navigate: (path: string) => void;
  catalogService: CatalogService;
  customerService: CustomerService;
  invoiceService: InvoiceService;
  account: AccountProfile | null;
  onSignOut: () => void;
}) {
  const [store, setStore] = useState<StoreInfo | null>(null);

  useEffect(() => {
    let cancelled = false;
    catalogService
      .getCatalog()
      .then((data) => {
        if (!cancelled && data.store) setStore(data.store);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [catalogService]);

  const active = workspaceNavigation.find((item) => item.path === path) ?? workspaceNavigation[0];
  const fullName = account?.fullName.trim() || "Chưa đăng nhập";
  const initials = account?.fullName.trim().split(/\s+/).slice(-2).map(part => part[0]).join("").toLocaleUpperCase("vi-VN") || "?";
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <a
          href="/sales"
          className="app-brand"
          onClick={(event) => {
            event.preventDefault();
            navigate("/sales");
          }}
        >
          <img src="/images/goan-logo.png" alt="GOAN" />
        </a>
        <nav aria-label="Điều hướng chính">
          {workspaceNavigation.map(
            ({ path: target, label, icon: Icon }, index) => (
              <a
                key={target}
                href={target}
                aria-label={label}
                title={label}
                aria-current={path === target ? "page" : undefined}
                className={`${path === target ? "active" : ""} ${index === 8 ? "settings-nav-link" : ""}`}
                onClick={(event) => {
                  if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
                    event.preventDefault();
                    navigate(target);
                  }
                }}
              >
                <span className="nav-icon" data-tone={index % 6} aria-hidden="true"><Icon size={22} /></span>
                <span className="nav-label">{label}</span>
              </a>
            ),
          )}
        </nav>
      </aside>
      <div className="workspace-main">
        <header className="app-topbar">
          <div className="store-badge">
            <span className="store-icon" aria-hidden="true">
              <Store size={16} />
            </span>
            <strong className="store-name">{store?.name ?? "Coffee & Tea"}</strong>
          </div>
          <div className="user-profile">
            <span className="user-avatar" aria-hidden="true">{initials}</span>
            <strong title={fullName}>{fullName}</strong>
            <a
              href="/"
              aria-label="Về trang đăng nhập"
              onClick={(event) => {
                event.preventDefault();
                onSignOut();
              }}
            >
              <LogOut size={18} />
            </a>
          </div>
        </header>
        <div hidden={path !== "/sales"} className="sales-container">
          <SalesPage catalogService={catalogService} invoiceService={invoiceService} />
        </div>
        {path === "/customers" ? (
          <CustomerManagementPage customerService={customerService} invoiceService={invoiceService} />
        ) : path === "/invoices" ? (
          <InvoiceManagementPage invoiceService={invoiceService} customerService={customerService} />
        ) : path !== "/sales" && (
          <main className="placeholder-page">
            <span className="section-kicker">GOAN WORKSPACE</span>
            <h1>{active.label}</h1>
            <p>
              Không gian quản lý {active.label.toLocaleLowerCase("vi-VN")} của
              cửa hàng.
            </p>
            <section>
              <span className="placeholder-icon">
                <active.icon size={34} />
              </span>
              <span className="demo-badge">Đang xây dựng</span>
              <h2>{active.label}</h2>
              <p>
                Khu vực {active.label.toLocaleLowerCase("vi-VN")} đã sẵn sàng
                trong hệ thống điều hướng.
                <br />
                Nội dung và nghiệp vụ sẽ được bổ sung ở giai đoạn tiếp theo.
              </p>
              <button
                className="btn-primary"
                onClick={() => navigate("/sales")}
              >
                <Coffee size={18} /> Trải nghiệm bán hàng
              </button>
            </section>
          </main>
        )}
      </div>
    </div>
  );
}
